var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var inquirer = require('inquirer');
var argv = process.argv;
var github = require('octonode');
var chalk = require('chalk');
var async = require('async');

var lib = require('./lib');
var log = require('./lib').log;
var tasks = require('require-dir')('./tasks');

/**
 * Debug only
 */
var spawn = require('child_process').spawn;
gulp.task('debug', function() {
  var p; // store current process if any

  gulp.watch('gulpfile.js', spawnChildren);
  spawnChildren();

  function spawnChildren(e) {
    if (p) {
      p.kill();
    }

    p = spawn('gulp', ['default'], {
      stdio: 'inherit'
    });
  }
});
