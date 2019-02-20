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
	"items_per_page": "between 1 and 100",
	"amount_of_pages": "basically a multiplicator for items_per_page",
        "subreddits": "array of subreddits (e.g. ["funny","videos","gifs"]"
}
```

## Limits
* Discord-Webhook: If you plan to post more than 30 urls per execution make sure to raise the sleep
 duration (2s should be fine) in the scraper.js postUrl function in order not to trigger [Discords Rate-Limits](https://discordapp.com/developers/docs/topics/rate-limits).

## License
[MIT](https://choosealicense.com/licenses/mit/)
