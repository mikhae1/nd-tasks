require('dotenv/config');

const axios = require('axios');

module.exports= { api };

function api(gitlabUrl) {
  if (!gitlabUrl)
    throw new Error('Provide gitlab url, for example: http://gitlab.local');

  let { GITLAB_TOKEN: token } = process.env;
  const { GITLAB_AUTH: auth } = process.env;

  token = token || auth.split(':')[1];

  if (!token) throw new Error('Define GITLAB_TOKEN env variable');

  return axios.create({
    baseURL: `${gitlabUrl}/api/v4`,
    timeout: 30000,
    headers: { 'private-token': token }
  });
}
