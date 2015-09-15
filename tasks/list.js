var gulp = require('gulp');
var lib = require('../lib');
var log = require('../lib').log;
var github = require('octonode');
var async = require('async');
var chalk = require('chalk');


gulp.task('list', function(gulpCallback) {
  var client = github.client(lib.getGithubToken());

  // //var url = '/orgs/noodoo/repos';
  // var org = client.org('noodoo');
  // org.repos(1, 100, function(err, data, headers) {
  //   // console.log("error: " + err);
  //   // console.log(data);
  //   // console.log("headers:" + headers);

  //   var c = 1;
  //   for (var key in data) {
  //     log(data[key].ssh_url, c++);
  //   }

  // });

  function fact(url) {
    return function(cb) {
      client.get(url, {
        page: 1,
        per_page: 200
      }, function(err, status, body, headers) {
        if (err) return cb(err);

        log(chalk.green(url));
        for (var key in body) {
          log(body[key].ssh_url);
        }
      });
    };
  }

  var tasks = [];
  for (var url in lib.repos) {
    tasks.push(fact(lib.repos[url].api));
  }
  async.parallel(tasks, gulpCallback);
});


gulp.task('ls', ['list']);