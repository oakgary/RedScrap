const fetch = require('node-fetch');
const config = require('./config.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const postUrlsToWebhook = async (urls, webhook, interval) => {
  await Promise.all(urls.map(async (url, i) => {
    await sleep(interval * i);
    try {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ content: url }),
      });
      if (!response.ok) throw new Error(response);
    } catch (err) {
      console.log({ err });
    }
  }));
};

const getUrlsFromSubreddit = async (subreddit, sort, time, itemsPerPage, amountOfPages, after, urls) => {
  if (amountOfPages === 0) return urls;

  const url = `https://www.reddit.com/r/${subreddit}/${sort}/.json?t=${time}&limit=${itemsPerPage}&after=${after || ''}`;
  const response = await fetch(url);
  const json = await response.json();
  const { data: { children, after: newAfter } } = json;

  const urlsFromJson = children.map(child => child.data.url);
  const newUrls = urls.concat(urlsFromJson);

  return getUrlsFromSubreddit(subreddit, sort, time, itemsPerPage, amountOfPages - 1, newAfter, newUrls);
};

const getUrlsFromSubreddits = async (subreddits) => {
  const {
    sort, time, itemsPerPage, amountOfPages,
  } = config;
  const arrOfarrOfUrls = await Promise.all(subreddits.map(subreddit => getUrlsFromSubreddit(subreddit, sort, time, itemsPerPage, amountOfPages, null, [])));
  return [...new Set([].concat(...arrOfarrOfUrls))];
};

if (JSON.stringify(config).includes(null)) {
  console.error('config.json contains null values');
  process.exitCode = 1;
} else if (config.subreddits.constructor !== Array) {
  console.error('config.subreddits has to be an array');
  process.exitCode = 1;
} else {
  (async () => {
    const { webhook, interval, subreddits } = config;
    const urls = await getUrlsFromSubreddits(subreddits);
    await postUrlsToWebhook(urls, webhook, interval);
  })();
}
