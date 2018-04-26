var gulp = require('gulp');
var lib = require('../lib');
var log = require('../lib').log;
var github = require('octonode');
var async = require('async');
var chalk = require('chalk');
var argv = require('yargs').argv;
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var inquirer = require('inquirer');
var debug = require('debug')('clone');

var configFileName = 'deploy.config.js';
var config;

gulp.task('clone', ['clone:init', 'clone:copy', 'clone:npm_install', 'clone:link_shared']);

gulp.task('clone:init', function(taskCallback) {
  config = findConfig();
  debug(config);
  if (config) {
    log('> found config file, continue the task..');
    return taskCallback(null);
  }
  argv = require('yargs')
    .usage('Usage: $0 clone --src user@server:/path/to/dir --dst /path/to/dir')
    .demand(['src', 'dst'])
    .help('h')
    .alias('h', 'help')
    .argv;

  var srcSrv = argv.src.split(':')[0];
  var srcDir = argv.src.split(':')[1];
  config = {
    options: {
      src: argv.src,
      dst: path.resolve(argv.dst),
      link_shared: {
        type: 'symlink' // npm_link
      }
    }
  };

  async.series([
    findSharedModules,
    getRootDirs,
    makeConfig,
  ], function(err, res) {
    if (err) return taskCallback(err);

    log(chalk.bgGreen('SUCCESS'), chalk.green('You should edit ' + configFileName + ' and run the task again'));
    return taskCallback();
  });

  function findSharedModules(cb) {
    // find all symlinks ignoring all errors
    var cmd = 'find -L ' + srcDir + ' -xtype l 2>/dev/null || true';
    var sharedModules = {};
    var tasks = {};
    var p, symlinks, key;
    lib.remoteFactory(srcSrv, cmd)(function(err, res) {
      if (err) return cb(err);

      symlinks = res.stdout.trim().split('\n');
      for (var i = 0; i < symlinks.length; i++) {
        if (symlinks[i].indexOf('node_modules') !== -1 && symlinks[i].indexOf('.bin') === -1) {
          //p = '..' + symlinks[i].slice(srcDir.length);
          key = path.basename(symlinks[i]);
          if (!sharedModules.hasOwnProperty(path.basename(symlinks[i]))) {
            sharedModules[key] = {
              linked: [symlinks[i]]
            };
            tasks[key] = lib.remoteFactory(srcSrv, 'readlink -f ' + symlinks[i]);
          } else {
            sharedModules[key].linked.push(symlinks[i]);
          }
        }
      }

      // resolve links
      async.series(tasks, function(err, res) {
        log('> shared modules: ');
        for (var key in sharedModules) {
          sharedModules[key].src = srcSrv + ':' + res[key].stdout.trim();
          log(key, sharedModules[key]);
        }
        config.shared = {
          dst: path.join(config.options.dst, 'shared'),
          modules: sharedModules
        };
        return cb(null, sharedModules);
      });
    });
  }

  function getRootDirs(cb) {
    config.app = {
      dirs: []
    };
    lib.getRemoteDirs(srcSrv, srcDir, function(err, dirs) {
      if (err) return cb(err);

      for (var i = 0; i < dirs.length; i++) {
        config.app.dirs.push({
          src: srcSrv + ':' + path.join(srcDir, dirs[i]),
          dst: path.join(config.options.dst, dirs[i])
        });
      }
      return cb(null);
    });
  }

  function makeConfig(cb) {
    var data = 'module.exports = ' + JSON.stringify(config, null, 2) + ';';
    fs.writeFile(configFileName, data, function(err) {
      if (err) return cb(err);
      log('> succesfully created config file:', configFileName);
      return cb(null);
    });
  }

});


gulp.task('clone:copy', ['clone:init'], function(taskCallback) {
  async.series([
    confirmClone,
    copyApp,
    copyShared,
  ], function(err) {
    if (err) return taskCallback(err);

    log(chalk.bgGreen('SUCCESS'), chalk.green('All files are copied'));
    return taskCallback(null);
  });


  function confirmClone(cb) {
    if (!fs.existsSync(configFileName)) return cb('Can\'t find ' + configFileName);

    inquirer.prompt([{
      type: 'confirm',
      message: 'Clone with ' + configFileName + ' to ' + config.options.dst + '?',
      name: 'confirm'
    }], function(ans) {
      if (!ans.confirm) {
        log('Task was stopped by user');
        return taskCallback('stopped by user');
      }
      return cb(null);
    });
  }

  function copyApp(cb) {
    log('> Downloading app..');
    var tasks = [lib.localFactory('rm -rf ' + config.options.dst)];
    config.app.dirs.forEach(function(dir) {
      tasks.push(lib.localFactory('mkdir -p ' + dir.dst));
      tasks.push(lib.localFactory('rsync -chavzP --stats --exclude="node_modules" ' + dir.src + '/ ' + dir.dst,
        'downloading files from ' + dir.src));
    });
    async.series(tasks, function(err, res) {
      if (err) return cb(err);
      return cb(null);
    });

  }

  function copyShared(cb) {
    log('> Downloading shared modules..');
    //var tasks = [lib.localFactory('rm -rf ' + config.options.dst)];
    var tasks = [];
    for (var dir in config.shared.modules) {
      tasks.push(lib.localFactory('mkdir -p ' + path.join(config.shared.dst, dir)));
      tasks.push(lib.localFactory('rsync -chavzP --stats --exclude="node_modules" ' +
        config.shared.modules[dir].src + '/ ' + path.join(config.shared.dst, dir),
        'downloading files from ' + config.shared.modules[dir].src));
    }
    async.series(tasks, function(err, res) {
      if (err) return cb(err);
      return cb(null);
    });
  }
});


gulp.task('clone:npm_install', ['clone:copy'], function(taskCallback) {
  async.series([
    npmInstall,
  ], function(err) {
    if (err) return taskCallback(err);

    log(chalk.bgGreen('SUCCESS'), 'All modules are built');
    return taskCallback(null);
  });

  function npmInstall(cb) {
    log('> npm install');
    glob(config.options.dst + '/**/package.json', function(err, files) {
      if (err) return cb(err);

      var tasks = [];
      for (var i = 0; i < files.length; i++) {
        if (files[i].indexOf('node_modules') === -1) {
          tasks.push(lib.ignoreError(lib.localFactory('npm install', {
            cwd: path.dirname(files[i])
          })));
        }
      }
      async.series(tasks, cb);
    });
  }
});

gulp.task('clone:link_shared', ['clone:npm_install'], function(taskCallback) {
  if (!config.options.link_shared) {
    log(chalk.green('> No link_shared option in ' + configFileName));
    return taskCallback(null);
  } else {
    log('\n> Linking mode: \n', chalk.bgYellow(config.options.link_shared.type));
  }

  async.series([
    linkShared,
    findBrokenLinks,
  ], function(err) {
    if (err) return taskCallback(err);

    log(chalk.bgGreen('SUCCESS'), 'All files are copied');
    return taskCallback(null);
  });

  function linkShared(cb) {
    log('> Linking shared modules..');
    var tasks = [],
      shmDir, aDir, found;
    for (var m in config.shared.modules) {
      for (var l in config.shared.modules[m].linked) {
        shmDir = config.shared.modules[m].linked[l];
        found = false;
        for (var i in config.app.dirs) {
          aDir = config.app.dirs[i].src.split(':')[1];
          if (shmDir.indexOf(aDir) === 0) {
            found = true;
            if (config.options.link_shared.type === 'symlink') {
              tasks.push(lib.ignoreError(lib.localFactory('rm -rf ' + path.join(config.app.dirs[i].dst, shmDir.slice(aDir.length)))));
              tasks.push(lib.ignoreError(lib.localFactory(('ln -nfs ' + path.join(config.shared.dst, m) + ' ' +
                path.join(config.app.dirs[i].dst, shmDir.slice(aDir.length))))));
            } else if (config.options.link_shared.type === 'npm_link') {
              tasks.push(lib.ignoreError(
                lib.localFactory('cd ' + path.join(path.join(config.app.dirs[i].dst, shmDir.slice(aDir.length), '../..') +
                  ' && npm link ' + path.join(config.shared.dst, m)
                ))));
            }
          }
        }
        if (!found) {
          log(chalk.red('Can\'t resolve the path: ', shmDir));
        }
      }
    }
    async.series(tasks, function(err, res) {
      if (err) return cb(err);
      return cb(null);
    });
  }

  // function findSharedModulesLocal(cb) {
  //   log('> installed shared modules: ');
  //   var modules = {};
  //   var count = 0;
  //   glob(argv.dst + '/**/*', function(err, files) {
  //     files.forEach(function(file) {
  //       if (file.indexOf('node_modules') !== -1) {
  //         count++;
  //         fs.lstat(file, function(err, stats) {
  //           count--;
  //           if (err) return cb(err);

  //           if (stats.isSymbolicLink()) {
  //             modules[path.basename(file)] = file;
  //           }

  //           if (count === 0) {
  //             for (var key in modules) {
  //               log(key, modules[key]);
  //             }
  //             return cb(null, modules);
  //           }
  //         });
  //       }
  //     });
  //   });
  // }

  function findBrokenLinks(cb) {
    log('> Searching for broken links...');
    var broken = [];
    var count = 0;
    var lpath;
    glob(config.options.dst + '/**/*', function(err, files) {
      files.forEach(function(fpath) {
        count++;
        fs.lstat(fpath, function(err, stats) {
          count--;
          if (err) return cb(err);
          if (stats.isSymbolicLink()) {
            count++;
            fs.readlink(fpath, function(err, dst) {
              count--;
              if (err) return cb(err);

              lpath = dst;
              if (lpath.match(/^\./)) lpath = path.join(path.dirname(fpath), dst);
              count++;
              fs.exists(lpath, function(exists) {
                count--;
                if (!exists) {
                  broken.push({
                    src: fpath,
                    dst: dst
                  });
                }
                if (count === 0) {
                  if (broken.length === 0) {
                    log('no broken lings was found..');
                  } else {
                    log(chalk.bgRed('BROKEN LINKS:'));
                    broken.forEach(function(link){
                      log(chalk.green(link.src), '->', chalk.red(link.dst));
                    });
                  }
                  return cb(null, broken);
                }
              });
            });
          }
        });
      });
    });
  }
});


/**
 * Load config when you run it from: CWD or with gulp --gulpfile --cwd
 */
function findConfig() {
  var p;
  // p = path.join(__dirname, configFileName);
  // checkPath(p);
  p = path.join('..', configFileName);
  if (checkPath(p)) return require(p);
  p = path.join(process.env.INIT_CWD, configFileName);
  if (checkPath(p)) return require(p);
  return null;

  function checkPath(p) {
    if (fs.existsSync(p)) {
      log(chalk.green('> using config file:', p));
      return true;
    }
    return false;
  }
}
