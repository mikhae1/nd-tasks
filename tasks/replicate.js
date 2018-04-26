const gulp = require('gulp');
const github = require('../lib/github').api();
const log = require('../lib').log;
const debug = require('debug')('migrate');
const mirror = require('../lib/mirror');

const { GITHUB_AUTH: githubAuth } = process.env;
const { GITLAB_AUTH: gitlabAuth } = process.env;
const gitlabHost = 'gitlab.eurochem.ru'
const gitlabProto = 'http://'
const gitlab = require('../lib/gitlab').api(`${gitlabProto}${gitlabHost}`);

gulp.task('replicate', async() => {
  try {
    await repicate('noodoo')
  } catch (err) {
    done(err)
  }
});

async function repicate(orgName, project) {
  let repos = await getRepos(orgName)
  let config = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];

    debug('repo:', repo)
    log('processing "%s" (%s/%s)...', repo.name, i + 1, repos.length)
    project = await gitlabGetProject(repo.path)

    if (!project)
      await gitlabCreateProject(repo.path, { description: repo.description });

    const srcUrl = `https://${githubAuth}@github.com/${repo.path}`;
    const dstUrl = `${gitlabProto}${gitlabAuth}@${gitlabHost}/${repo.path}`;

    debug('srcUrl', srcUrl)
    debug('dstUrl', dstUrl)

    let dstArr = [ { url: dstUrl } ]
    let srcObj = {
      url: srcUrl,
      host: 'github.com',
      owner: orgName,
      name: repo.name
    };

    console.log(`mirroring from ${srcObj.host}/${repo.path} to ${gitlabHost}/${repo.path}`)
    await mirror(srcObj, dstArr);

    let str = `
  ${gitlabHost}:${repo.path}:
    protocol: ${gitlabProto.replace(/\:\/\//,'')}
    auth: "${gitlabAuth}"`;

    debug('config:', str);
    config.push(str);
  }

  log('config:')
  config.forEach(s => {
    console.log(s);
  });

  done()
}

function gitlabGetProject(path) {
  return gitlab.get(`/projects/${encodeURIComponent(path)}`).catch(err => {
    if (err.response.status != 404) throw err
  })
}

async function gitlabCreateProject(path, options) {
  let [ group, name ] = path.split('/')

  let defaults = {
    name,
    visibility: 'private',
    request_access_enabled: true,
  }

  const resGroup = await gitlab.get(`/groups/${group}`)

  let params = Object.assign({}, defaults, options)
  params.namespace_id = resGroup.data.id

  log(`creating new project: ${name} `, params)
  return await gitlab.post('/projects', params);
}

function done(err) {
  debug(err)

  if (err) {
    if (err.response) {
      log(err.toString());
      console.log(err.response.data);
    } else {
      console.log(err);
    }

    process.exit(1)
  }

  log('All done!')
}

async function getRepos(orgName, limit=100) {
  if (!orgName) throw new Error('No organization provided');

  let repos = [];

  let res = await github.get(`/orgs/${orgName}/repos?per_page=${limit}`);

  res.data.forEach(repo => {
    repos.push({
      name: repo.name,
      description: repo.description,
      path: repo.full_name
    })
  });

  debug('repos', repos)
  return repos
}
