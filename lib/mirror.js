const fs = require('fs-extra');
const git = require('simple-git/promise');
const path = require('path');
const debug = require('debug')('mirror');

const { tmpdir } = require('os');

const dataDir = process.env.MIRRORS_PATH || path.join(tmpdir(), 'mirrors');

module.exports = mirror;

/**
 * Create or fetch bare clone of repository and push changes to mirrors
 *
 * @param {Object} repo - repo object from config with url, fullName and
 *                        host of repository to mirror
 * @param {Array} destinations - objects with mirrors urls
 *
 * @return {Promise}
 */
async function mirror({ url, host, owner, name }, destinations) {
  if (!url || !host || !owner || !name)
    throw new Error('Unable to parse repository url');

  if (!destinations.length) return;

  const localPath = path.join(dataDir, 'mirrors',
    host, owner, `${name}.git`);

  debug('mirror path:', localPath);

  // Ensure mirrors directory is exist
  await fs.ensureDir(localPath);
  const repo = git(localPath).silent(true);

  const origin = 'origin';
  const mirrors = 'mirrors';
  const fetch = `remote.${origin}.fetch`;
  const refs = ['heads', 'tags'];

  await repo.init(true);

  // Setup origin remote

  await repo.addConfig(`remote.${origin}.url`, url);
  await repo.addConfig(`remote.${origin}.mirror`, 'true');
  await repo.raw(['config', '--unset-all', fetch]);

  // Skip github pull requests refs
  // http://christoph.ruegg.name/blog/git-howto-mirror-a-github-repository-without-pull-refs.html
  for (const name of refs)
    await repo.raw(['config', '--add',
      fetch, `+refs/${name}/*:refs/${name}/*`]);

  // Setup mirrors remote

  await repo.addConfig(`remote.${mirrors}.mirror`, 'true');
  await repo.raw(['config', '--unset-all', `remote.${mirrors}.url`]);

  for (const { url } of destinations)
    await repo.remote(['set-url', '--add', mirrors, url]);

  // Fetch changes from remote and push them to mirrors

  await repo.fetch(['--prune', origin]);
  await repo.push(['--mirror', mirrors]);
}
