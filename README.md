# Requestah - Discord Bot for checking the health status of services

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
