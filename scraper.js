const request = require('request');
const fetch = require('node-fetch');
const config = require("./config.json");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const redditUrl = 'https://www.reddit.com/r/';
const url_storage = new Map();
const after_storage = new Map();

function postWebhook(jsonBody) {
    request({
        url: config.webhook,
        method: "POST",
        headers: {
            "content-type": "multipart/form-data",
        },
        json: true,
        body: jsonBody
    }, function (error, response, body) {
        if (error) {
            return console.error('Post on webhook failed ', error);
        }
    });
}

//time = hour, day, week, month, year or all
//sort = hot, new, rising, controversial or top 
//items_per_page between 25 and 100 (included)
async function loadSubreddits(subreddits) {
    const arrOfarrOfUrls = await Promise.all(subreddits.map(async function (subreddit) {
        const tmp = await getJson(subreddit, config.sort, config.time, config.items_per_page, config.amount_of_pages);
        return tmp
    }))
    const urls = [...new Set([].concat(...arrOfarrOfUrls))];
    postUrls(urls);
}

async function getJson(subreddit, sort, time, items_per_page, amount_of_pages) {
    let urls = url_storage.get(subreddit);
    for (i = 0; i < amount_of_pages; i++) {
        //Example URL: 'https://www.reddit.com/r/funny/top/.json?t=all&limit=100'
        const url = redditUrl + subreddit + '/' + sort + '/.json?t=' + time + '&limit=' + items_per_page + '&after=' + after_storage.get(subreddit);
        const response = await fetch(url);
        const json = await response.json();
        after_storage.set(subreddit, json.data.after);
        urls = urls.concat(getUrlsFromJson(json));
        url_storage.set(subreddit, urls);
    }
    return urls
}

function postUrls(urls) {
    for (i = 0; i < urls.length; i++) {
        postUrl(urls[i], i);
    }
}

async function postUrl(url, i) {
    const jsonBody = { content: url };
    await sleep(700 * i);
    postWebhook(jsonBody);
}

function getUrlsFromJson(jsonString) {
    const urls = [];
    jsonString.data.children.forEach(function (child) {
        urls.push(child.data.url);
    });
    return urls;
}

function init() {
    if (JSON.stringify(config).includes(null)) {
        console.error('config.json contains null values');
        process.exitCode = 1;
    } else {
        if (config.subreddits.constructor === Array) {
            config.subreddits.forEach(function (subreddit) {
                url_storage.set(subreddit, []);
                after_storage.set(subreddit, "");
            });
            loadSubreddits(config.subreddits);
        } else {
            console.error('config.subreddits has to be an array');
            process.exitCode = 1;
        }
    }
}

init();