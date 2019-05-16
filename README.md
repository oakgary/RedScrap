# RedScrap

RedScrap gathers image and video urls from subreddits and posts them to a webhook.  
The urls that are to be gathered are configurable in reddits typical schema (e.g. top of the day).

## Setup

### Preparation

1. **[Download](https://github.com/oakgary/RedScrap/archive/master.zip) and extract RedScrap**
2. **`npm install`**

### Configuration
* config.json (sort and time are the configurations for the reddit posts)
```
{
    "webhook": "your webhook url (e.g. for Discord: "https://discordapp.com/api/webhooks/{webhook.id}/{webhook.token})"",
    "sort": "hot, new, rising, controversial or top",
    "time": "hour, day, week, month, year or all",
    "itemsPerPage": "between 1 and 100",
    "amountOfPages": "basically a multiplicator for itemsPerPage",
    "subreddits": "array of subreddits (e.g. ["funny","videos","gifs"]",
    "interval": interval between posts in milliseconds
}
```

## Limits
* Discord-Webhook: If you plan to post more than 30 urls per execution make sure to raise the interval
 duration (2s should be fine) in order not to trigger [Discords Rate-Limits](https://discordapp.com/developers/docs/topics/rate-limits).

## License
[MIT](https://choosealicense.com/licenses/mit/)
