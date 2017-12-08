# Dozuki Zapier CLI App #

A Zapier CLI App the provides Dozuki specific Zap triggers, searches, resources and creates.
Zapier CLI Apps are Node.js (6.10.2 ONLY) applications.
Zapier CLI Apps use JSON schemas to define the entire app including the triggers, searches, resources and creates.

A good place to learn more about Zapier CLI App basics is here: `https://github.com/zapier/zapier-platform-cli`

We follow the suggested folder structure... so find triggers in `./triggers`, searches in `./searches'` and creates in `./creates`.
Unit test code is in `./test`.

# Zapier Commands Worth Noting #

 - `$ zapier register <app name>` to register the app in an account.
 - `$ zapier test` to run the unit tests.
 - `$ zapier push` to push the app to Zapier.
 - `$ zapier link` to link the remote code base to an Zapier App ID.
 - `$ zapier logs` to view the error logs.
 - `$ zapier logs --type=http --detailed --limit=1` to view the http logs.

# The Code #

GitHub Repository: `https://github.com/iFixit/zapier-cli-app`

 - `./index.php` is where the app implementation lives.  Start here.
 - `./authentication.js` wraps up of token retrieval... refreshing is implemented at the app level.
 - `./listOptions.js` wraps up our API for simple data pulls (GET). Check out a trigger to see it how it is used.
 - `./httpCodes.js` defines the http status code we care about.
 - `./triggers/` contains the 'triggers'.
 - `./searches/` contains the 'searches'.
 - `./creates/` contains the 'creates'.
 - `./test/` contains the unit tests.
 
# Issues and Concerns 

## User Permissions Will Shape the Results ##
Comes up in the case of newImages and newVideos?  Need details.
 
## Dynamic inputs for users, teams, team members, guides, etc. ##
The 200 result limit makes this difficult.  We are currently asking the user to
find the id's themselves.

## Dynamic Inputs as Secondary Controls Discussion ##
It does not work.
When I pointed it out they (Bruno) told me known bug:  https://github.com/zapier/zapier-platform-cli/issues/162
