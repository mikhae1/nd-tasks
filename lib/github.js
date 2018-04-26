require('dotenv/config');

const axios = require('axios');

module.exports= { api };

function api(token=process.env.GITHUB_TOKEN) {
  if (!token && process.env.GITHUB_AUTH)
    token = process.env.GITHUB_AUTH.split(':')[1];

  if (!token) throw new Error('Define GITHUB_TOKEN env variable');

  return axios.create({
    baseURL: 'https://api.github.com',
    timeout: 30000,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  });
}
