# RedScrap

RedScrap gathers image and video urls from subreddits and posts them to a webhook. 
The urls that are to be gathered are configurable in reddits typical schema (e.g. Top of the day).

## Setup
RedScrap can be set up in many different ways, here is an example for the use with AWS Lambda.

### Requirements
* AWS-Account ([Website](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html))

* Serverless `npm install -g serverless` ([Website](https://serverless.com), [GitHub](https://github.com/serverless/serverless))  

### Preparation

1. **[Download](https://github.com/oakgary/RedScrap/archive/master.zip) and extraxt RedScrap**
2. **`npm install`**
3. **Replace scraper.js with [handler.js](https://gist.github.com/oakgary/47ed4e7635afcc27252cf350859ec3aa#file-handler-js) and create [serverless.yml](https://gist.github.com/oakgary/47ed4e7635afcc27252cf350859ec3aa#file-serverless-yml)**

### Configuration
* config.json (sort and time are the configurations for the reddit posts)
```json
{
	"webhook": "your webhook url (e.g. for Discord: "https://discordapp.com/api/webhooks/XXX/XXX)"",
	"sort": "hot, new, rising, controversial or top",
	"time": "hour, day, week, month, year or all",
	"items_per_page": "between 1 and 100",
	"amount_of_pages": "basically a multiplicator for items_per_page",
        "subreddits": "array of subreddits (e.g. ["funny","videos","gifs"]"
}
```
* serverless.yml

```
schedule indicates the time (in utc) of excecution in cron format; current setup is daily at 6pm utc)
raise the timeout if you plan to post more than 75 urls with each excecution
```

### Deployment

1. **`serverless login`**
2. **`serverless deploy`**

## License
[MIT](https://choosealicense.com/licenses/mit/)
