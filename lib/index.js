var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var async = require('async');
var exec = require('child_process').exec;
var debug = require('debug')('lib');
var sshPool = require('ssh-pool');

var githubTokenFile = '.github.key';


exports.repos = {
  noodoo: {
    api: '/orgs/noodoo/repos'
  },
  orichards: {
    api: '/users/orichards/repos'
  },
  minkolazer: {
    api: '/users/minkolazer/repos'
  }
};

exports.getGithubToken = function getGithubToken(filename) {
  var filename = filename || githubTokenFile;
  var githubToken;
  var p;

  function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
  }

  if (filename) {
    p = path.join(__dirname, '../', filename);
    if (fs.existsSync(p)) {
      githubToken = fs.readFileSync(p, 'utf8').trim();
    } else {
      p = path.join(getUserHome(), filename);
      if (fs.existsSync(p)) {
        githubToken = fs.readFileSync(p, 'utf8').trim();
      }
    }
  }

  return githubToken;
};

exports.log = function log() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }
  args[0] = chalk.bold(args[0]);
  console.log.apply(null, args);
};

exports.ignoreError = function(func) {
  var self = this;

  return function(cb) {
    func(function() {
      var args = [null];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      if (arguments[0]) {
        self.log(chalk.red(arguments[0]));
      }
      return cb.apply(null, args);
    });
  };
};

exports.localFactory = function localFactory(cmd, opts, text) {
  var self = this;
  if (typeof opts !== 'object') {
    text = opts;
    opts = {};
  }

  return function(cb) {
    if (opts.cwd) {
      self.log('> cd ' + opts.cwd + ' && ' + cmd);
    } else {
      opts.cwd = __dirname;
      self.log('> ' + cmd);
    }

    if (text) {
      self.log(chalk.dim('* ' + text));
    }

    var ps = exec(cmd, {
      cwd: opts.cwd,
      maxBuffer: 1024 * 5000 // just empirical
    }, function(error, stdout, stderr) {
      if (error) return cb(error);
      return cb(null, {
        stdout: stdout,
        stderr: stderr
      });
    });
    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stderr);
  };
};

exports.remoteFactory = function remoteFactory(srv, cmd, opts) {
  var self = this;
  if (typeof opts !== 'object') {
    cb = opts;
    opts = {};
  }

  return function(cb) {
    var connection = new sshPool.Connection({
      remote: srv,
      log: console.log.bind(console),
      //maxBuffer: 1024 * 5000 // empirical
    });

    connection.run(cmd, opts, function(err, res) {
      if (err) return cb(err);

      if (!opts.silent) {
        if (res.stderr) self.log(chalk.red(res.stderr));
        if (res.stdout) self.log(chalk.reset(res.stdout));
      }
      return cb(null, res);
    });
  };
};

exports.getRemoteDirs = function getRemoteDirs(srv, path2dir, cb) {
  this.remoteFactory(srv, 'cd ' + path2dir + ' && ls -d */ | cut -f1 -d"/"')(function(err, res) {
    if (err) return cb(err);
    return cb(null, res.stdout.trim().split('\n'));
  });
};
