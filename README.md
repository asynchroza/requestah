# Requestah - Discord Bot for checking the health status of services

## Commands 
`schedule` - accepts: interval (cron), url, request type (GET, POST), expected status code:

- if the executed request returns a status code different than the one given as the default one, a Discord channel gets notified and the job is being garbaged. 


`request` - accepts: url, request (GET, POST):

- just a simple request towards an url - returns the status code (Discord curl 😄)

`listscheduled`: 
* lists all scheduled jobs  

`unschedule` - accepts: ID (matched key in `listscheduled`):
*  stops a scheduled job

### Create a command

```
POST 'https://discord.com/api/v10/applications/1036000679774396436/commands' 
header 'Authorization: Bot <BOT_TOKEN>' 
data: {
    "name": "request",
    "description": "Make a http request",
    "options": [
        {
            "name": "url",
            "description": "URL address",
            "required": true,
            "type": 3
        }, 
        {
            "name": "type",
            "description": "Type of the HTTP request",
            "required": true,
            "type": 3,
            "choices": [
                {
                    "name": "GET",
                    "value": "get"
                }, 
                {
                    "name": "POST",
                    "value": "post"
                }
            ]
        },
        {
            "name": "status",
            "description": "Expected response code",
            "required": true,
            "type": 4
        }
    ]

}
```
