var gulp = require('gulp');
var lib = require('../lib');
var async = require('async');
var path = require('path');
var fs = require('fs');
var readline = require('readline');
var moment = require('moment');
const { exec } = require('child_process');

var debug = require('debug')('audit');

var config = {
  src: [
    resolveHome('~/repos/flow'),
    resolveHome('~/repos/org-deals'),
    resolveHome('~/repos/org-documents'),
    resolveHome('~/repos/org-models'),
    resolveHome('~/repos/org-shipments'),
    resolveHome('~/repos/org-transports'),
    resolveHome('~/repos/org-counterparts'),
    resolveHome('~/repos/org-yves'),
  ],

  dst: resolveHome('~/tmp/AUDIT.md'),

  filter: {
    from: moment('2017-01-01')
  }
};

function resolveHome(filepath) {
  if (filepath[0] === '~')
    return path.join(process.env.HOME, filepath.slice(1));

  return filepath;
}

gulp.task('audit', function(gulpCallback) {
  var tasks = [];
  var data = [];

  config.src.forEach(src => {
    tasks.push(gitReset(path.resolve(src)));
  });

  config.src.forEach(src => {
    tasks.push(readBlocks(path.join(src, 'CHANGELOG.md')));
  });

  async.series(tasks, done);

  function done(err) {
    if (err) return gulpCallback(err);

    debug(data);

    var content = '';
    for (var i = 0; i < data.length; i++) {
      content += '\n# ' + path.basename(config.src[i]) + '\n\n';
      for (var j = 0; j < data[i].length; j++) {
        if (data[i][j].ts !== 'unknown') {
          content += data[i][j].text;
          content += '###### ' + data[i][j].ts;
        }
      }
      content += '\n---';
    }
    debug(content);

    try {
      fs.unlinkSync(config.dst);
    } catch (e) {}

    fs.writeFileSync(config.dst, content, 'utf8');
    return gulpCallback();
  }

  function gitReset(file) {
    return cb => {
      exec(`cd ${file} && git checkout -f master && git reset --hard origin/master`, (err, stdout, stderr) => {
        console.log(file);

        if (err) {
          console.error(err);
          return cb(err);
        }

        console.log(stdout, stderr);

        return cb();
      });
    };
  }

  function readBlocks(file) {
    return function(cb) {
      var blocks = {};
      var chunk = '';
      var tags = [];
      var tag;
      var vre = /^##\s(\d+\.\d+\.\d+)/i;
      var filterGit = /github.com/i;
      var filterDov = /http:\/\/dov/i;

      var rd = readline.createInterface({
        input: fs.createReadStream(file),
        output: process.stdout,
        terminal: false
      });

      rd.on('line', function(line) {
        if (!filterGit.test(line)) {
          chunk += line + '\n';
        }

        if (vre.test(line)) {
          tag = line.match(vre)[1];
          tags.push(tag);
          blocks[tag] = {
            text: chunk,
            version: line.match(vre)[1]
          };
          chunk = '';
        }
      });

      rd.on('close', function(line) {
        console.log('END');
        findDates(tags);
      });

      function findDates(tags) {
        var tasks = [];
        tags.forEach(function(tag) {
          tasks.push(lib.ignoreError(
            lib.localFactory('git show v' + tag + ' | grep Date || true', {
              cwd: path.dirname(file)
            })));
        });

        async.series(tasks, function(err, res) {
          var out = [];
          let keepNext = false;
          for (var i = 0; i < res.length; i++) {
            var tag = tags[i];
            var ts = 'unknown';
            let re = /Date:[\s]+(.*)/;

            if (res[i][0] === null) ts = res[i][1].stdout;

            blocks[tag].ts = ts;

            let filtered = false;
            let tsParsed;
            if (config.filter && config.filter.from) {
              tsParsed = null;
              if (ts.match(re))
                tsParsed = moment(ts.match(re)[1]);

              debug('ts parsed:', tsParsed);
              if (tsParsed && tsParsed.isSameOrBefore(config.filter.from))
                if (!keepNext)
                  keepNext = true;
                else
                  filtered = true;
            }

            if (!filtered) out.push(blocks[tag]);
          }

          data.push(out);
          return cb(null, out);
        });
      }

    };
  }
});

