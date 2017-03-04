# Giphy Groupme Bot
This is a groupme bot that searches giphy.com and posts a random gif into a groupme group message.

## Installation

While you can install this on any service that supports NodeJS servers, heroku is a good candidate, mainly because it's free and simple to setup.

1. Fork this repository and checkout your fork somewhere locally.
2. Run `npm install`
3. Ensure you have heroku CLI installed and [setup](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up).
4. `heroku create` (Optional give it a name, or note the random name generated)
5. Create a groupme bot for each group you want giphy bot in at https://dev.groupme.com/bots
  - Set the 'Callback URL' to your heroku URL
6. Get a groupme access token at https://dev.groupme.com/applications/new
  - `heroku config:set GROUPME_API_KEY=[GROUPME_ACCESS_TOKEN]`
7. Deploy the bot: `git push heroku master`
8. Ensure one instance is running `heroku ps:scale web=1`
9. Test everything is up: `heroku open`
  - Should see "I'm alive!!! WHHAHHAHAH"

## Using giphy bot

Whenever a message that starts with 'giphy ' appears in the group message, giphy will reply with a random gif based on the string that follows giphy.

For instance, `giphy katy perry` will likely return a gif of katy perry.  However, it should be noted, giphy is rather random and not generally well indexed, some really random and strange gifs can be returned, but this is part of the fun! :-)

## Further customization

The sky is the limit.  This bot is intentionally meant to be stupid simple, while utilizing node modules to help avoid edge-cases and simplify any complexities.  The entire bot is in index.js, and currently is < 100 LOC.

Currently used node modules:

  * express.js - Groupme sends a POST request to the 'Callback URL' specified in the bot configuration, express is used to handle these requests with body-parser middleware to easily parse the JSON data.
  * https - The built-in HTTPS module for nodejs is used to send API requests back to groupme.  This request is always the same to /v3/bots/post to post a message in the group chat as the bot.
  * giphy-api - Used for the obvious.  This module has some additionally configuration options you can use to further filter giphy searches (i.e. image rating restrictions)