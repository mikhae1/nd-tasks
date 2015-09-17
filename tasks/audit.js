var gulp = require('gulp');
var lib = require('../lib');
var log = require('../lib').log;
var github = require('octonode');
var async = require('async');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');
var readline = require('readline');
var moment = require('moment');

var debug = require('debug')('audit');


var config = {
  src: [
    '/Users/mmekhanov/production/flow',
    '/Users/mmekhanov/production/org-deals',
    '/Users/mmekhanov/production/org-documents',
    '/Users/mmekhanov/production/org-models',
    '/Users/mmekhanov/production/org-shipments',
    '/Users/mmekhanov/production/org-transports',
  ],
  dst: '/tmp/RESULT.md'
};

gulp.task('audit-ppl', function(gulpCallback) {
  var filediff = '/Users/mmekhanov/tmp/diff-people.txt';
  var fileResult = '/tmp/PEOPLE.md';
  var users = {};
  //var reUser = /\(\d+,\'([a-zA-Z\s]+)\'/i;
  var reUser = /\(\d+,\'([^,]+)\'/i;
  var reTs = /Compare: prev = ([\d-]+)\.log.*next = ([\d-]+)\.log/i;
  var lines = [];

  var rd = readline.createInterface({
    input: fs.createReadStream(filediff),
    output: process.stdout,
    terminal: false
  });

  rd.on('line', function(line) {
    lines.push(line);
    if (reUser.test(line)) {
      users[line.match(reUser)[1]] = {};
    }
  });

  rd.on('close', function(line) {
    console.log('END');
    //return cb(null, blocks);
    main();
  });

  function main() {
    //debug(users);
    var tsOld, tsNew, lold, lnew, newUsers;
    var block = [];
    var blockHead = '';
    for (var i = 0; i < lines.length; i++) {
      if (reTs.test(lines[i])) {
        tsOld = lines[i].match(reTs)[1];
        tsNew = lines[i].match(reTs)[2];

        // process block
        if (block.length > 0) {
          lnew = [];
          lold = [];
          block.forEach(function(line) {
            if (line.indexOf('< ') === 0) {
              //debug('begin');
              if (line.match(reUser)) {
                lold.push(line.match(reUser)[1]);
              }
            } else if (line.indexOf('> ') === 0) {
              if (line.match(reUser)) {
                lnew.push(line.match(reUser)[1]);
              }
            }
          });

          // debug('users lold', lold);
          // debug('users lnew', lnew);
          // find created:
          if (lold.length < lnew.length) {
            newUsers = arrDiff(lold, lnew);
            debug('added users: %s, date: %s', newUsers, tsNew);
            newUsers.forEach(function(user) {
              users[user].tsCreate = formatTs(tsNew);
              users[user].tsCreateRaw = tsOld;
            });
          }
          // find deleted:
          if (lold.length > lnew.length) {
            newUsers = arrDiff(lold, lnew);
            debug('removed users: %s, date: %s', newUsers, tsNew);
            newUsers.forEach(function(user) {
              users[user].tsDelete = formatTs(tsNew);
              users[user].tsDeleteRaw = tsOld;
            });
          }
          block = [];
        } else {

        }
      } else {
        block.push(lines[i]);
      }
    }

    //debug(users);
    var content = '';
    for (var u in users) {
      content += '\n';
      content += '\n### ' + u;
      if (users[u].hasOwnProperty('tsCreate')) content += '\n###### Created: ' + users[u].tsCreate;
      if (users[u].hasOwnProperty('tsDelete')) content += '\n###### Deleted: ' + users[u].tsDelete;
      content += '\n---';
    }

    fs.writeFileSync(fileResult, content, 'utf8');
    return gulpCallback();


  }


  function arrDiff(a1, a2) {
    var a = [],
      diff = [];
    for (var i = 0; i < a1.length; i++)
      a[a1[i]] = true;
    for (var i = 0; i < a2.length; i++)
      if (a[a2[i]]) delete a[a2[i]];
      else a[a2[i]] = true;
    for (var k in a)
      diff.push(k);
    return diff;
  }

  function formatTs(str) {
    var s = moment(str.split('-')[0]).add(str.split('-')[1], 'weeks');
    return s.format("DD-MM-YYYY");
  }
});


gulp.task('audit', function(gulpCallback) {
  var tasks = [];
  for (var i = 0; i < config.src.length; i++) {
    tasks.push(readBlocks(path.join(config.src[i], 'CHANGELOG.md')));
  }

  async.series(tasks, function(err, filesdata) {
    if (err) return gulpCallback(err);

    //debug(res);
    var content = '';
    for (var i = 0; i < filesdata.length; i++) {
      content += '\n#' + path.basename(config.src[i]) + '\n';
      for (var j = 0; j < filesdata[i].length; j++) {
        if (filesdata[i][j].ts !== 'unknown') {
          content += filesdata[i][j].text;
          content += '###### ' + filesdata[i][j].ts;
        }
      }
      content += '---';
    }
    debug(content);

    try {
      fs.unlinkSync(config.dst);
    } catch (e) {}

    fs.writeFileSync(config.dst, content, 'utf8');
    return gulpCallback();
  });

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
        //return cb(null, blocks);
      });

      function findDates(tags) {
        var tasks = [];
        tags.forEach(function(tag) {
          tasks.push(lib.ignoreError(lib.localFactory('git show v' + tag + ' | grep Date', {
            cwd: path.dirname(file)
          })));
        });
        async.series(tasks, function(err, res) {
          out = [];
          for (var i = 0; i < res.length; i++) {
            var tag = tags[i];
            var ts = 'unknown';
            if (res[i][0] === null) ts = res[i][1].stdout;

            //debug(res[i]);
            blocks[tag].ts = ts;
            out.push(blocks[tag]);
          }
          return cb(null, out);
        });
      }

    };
  }


});


gulp.task('ls', ['list']);
