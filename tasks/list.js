const gulp = require('gulp');
const log = require('../lib').log;
const chalk = require('chalk');
const debug = require('debug')('list');

const github = require('../lib/github').api(process.env.MY_GITHUB_TOKEN);

gulp.task('list', async() => {
  await getRepos('noodoo')
  await getRepos('orichards')
  await getRepos('minkolazer')
});

async function getRepos(name=proces.env.USER, limit=100) {
  let res = await github.get(`/orgs/${name}/repos?per_page=${limit}`).catch(debugError);

  if (!res)
    res = await github.get(`/users/${name}/repos?per_page=${limit}`).catch(debugError);

  log(`${name}, ${res.data.length} repos`);

  res.data.forEach(repo => {
    console.log(repo.ssh_url)
  });

  return res.data
}

function debugError(err) {
  debug(err.response)
}

gulp.task('ls', ['list']);
