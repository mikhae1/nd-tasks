require('dotenv/config');

const chalk = require('chalk');
const exec = require('child_process').exec;
const sshPool = require('ssh-pool');

const repos = {
  noodoo: {
    api: '/orgs/noodoo/repos'
  },
  // orichards: {
  //   api: '/users/orichards/repos'
  // },
  // minkolazer: {
  //   api: '/users/minkolazer/repos'
  // }
};

module.exports = {
  repos,
  getGithubToken,
  log,
  ignoreError,
  localFactory,
  remoteFactory,
  getRemoteDirs
};

function getGithubToken() {
  let { GITHUB_TOKEN: token } = process.env;

  const { GITHUB_AUTH: auth } = process.env;

  token = token || auth.split(':')[1];

  if (!token) throw new Error('Define GITHUB_TOKEN env variable');

  return token;
}

function log() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }
  args[0] = chalk.bold(args[0]);
  console.log.apply(null, args);
}

function ignoreError(func) {
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
}

function localFactory(cmd, opts, text) {
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

    if (text)
      self.log(chalk.dim('* ' + text));

    var ps = exec(cmd, {
      cwd: opts.cwd,
      maxBuffer: 1024 * 500000 // just empirical
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
}

function remoteFactory(srv, cmd, opts) {
  var self = this;
  if (typeof opts !== 'object') {
    cb = opts;
    opts = {};
  }

  return function(cb) {
    var connection = new sshPool.Connection({
      remote: srv,
      log: console.log.bind(console),
      maxBuffer: 1024 * 500000 // empirical
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
}

function getRemoteDirs(srv, path2dir, cb) {
  this.remoteFactory(srv, 'cd ' + path2dir + ' && ls -d */ | cut -f1 -d"/"')(function(err, res) {
    if (err) return cb(err);
    return cb(null, res.stdout.trim().split('\n'));
  });
}
