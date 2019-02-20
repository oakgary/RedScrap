const fetch = require('node-fetch');
const config = require('./config.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const postToWebhook = async (body) => {
  try {
    const response = await fetch(config.webhook, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body,
    });
    if (!response.ok) throw new Error(response);
  } catch (err) {
    console.log('err: ', err);
  }
};

const postUrls = async (urls) => {
  await Promise.all(urls.map(async (url, i) => {
    const jsonBody = `{"content":"${url}"}`;
    await sleep(500 * i);
    await postToWebhook(jsonBody);
  }));
};

const getUrls = async (subreddit, sort, time, itemsPerPage, amountOfPages, after, urls) => {
  if (amountOfPages === 0) return urls;

  const url = `https://www.reddit.com/r/${subreddit}/${sort}/.json?t=${time}&limit=${itemsPerPage}&after=${after || ''}`;
  const response = await fetch(url);
  const json = await response.json();
  const { data: { children, after: newAfter } } = json;

  const urlsFromJson = children.map(child => child.data.url);
  const newUrls = urls.concat(urlsFromJson);

  return getUrls(subreddit, sort, time, itemsPerPage, amountOfPages - 1, newAfter, newUrls);
};

const loadSubreddits = async (subreddits) => {
  const {
    sort, time, itemsPerPage, amountOfPages,
  } = config;
  const arrOfarrOfUrls = await Promise.all(subreddits.map(async (subreddit) => {
    const urls = await getUrls(subreddit, sort, time, itemsPerPage, amountOfPages, null, []);
    return urls;
  }));
  const urls = [...new Set([].concat(...arrOfarrOfUrls))];
  postUrls(urls);
};

const init = () => {
  if (JSON.stringify(config).includes(null)) {
    console.error('config.json contains null values');
    process.exitCode = 1;
  } else if (config.subreddits.constructor !== Array) {
    console.error('config.subreddits has to be an array');
    process.exitCode = 1;
  } else {
    loadSubreddits(config.subreddits);
  }
};

init();
