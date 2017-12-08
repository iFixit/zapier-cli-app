const httpCodes        = require('./httpCodes');
const authentication   = require('./authentication');
const newTeam          = require('./triggers/newTeam');
const newTeamMember    = require('./triggers/newTeamMember');
const newUser          = require('./triggers/newUser');
const newPage          = require('./triggers/newPage');
const newGuide         = require('./triggers/newGuide');
const newGuideReleased = require('./triggers/newGuideReleased');
const newWorkLogEntry  = require('./triggers/newWorkLogEntry');
const newImage         = require('./triggers/newImage');
//const newVideo         = require('./triggers/newVideo');

/**
 * API_APP_ID is used to identify the app to our API.
 *
 * The id is put in the header on our API calls.
 *
 * @type {string}
 */
const API_APP_ID = '9c9e0e7ae61d3a70bfe4debb87ad145a';

/**
 * addApiKeyToHeader is a 'beforeRequest' handler that adds the app id and the
 * sessionKey (auth token) to the header.
 *
 *
 *
 * @param request
 * @param z
 * @param bundle
 * @returns {*}
 */
const addApiKeyToHeader = (request, z, bundle) => {
   if (bundle.authData.sessionKey) {
      request.headers = request.headers || {};
      request.headers['Authorization'] = 'api ' + bundle.authData.sessionKey;
      request.headers['X-App-Id'] = API_APP_ID;
   }
   return request;
};

/**
 * sessionRefreshIf401 is an 'After Response' handler that requests a new auth
 * token when a 401 is received via a special Zapier hook called RefreshAuthError.
 *
 * @param response
 * @param z
 * @param bundle
 * @returns {*}
 */
const sessionRefreshIf401 = (response, z, bundle) => {
   if (bundle.authData.sessionKey) {
      if (response.status === httpCodes.unauthorized) {
         throw new z.errors.RefreshAuthError('Session key needs refreshing.');
      }
   }
   return response;
};

/**
 *
 * @type {{version, platformVersion: *, beforeRequest: [null], afterResponse: [null], resources: {team: {key: string, noun: string, list: {display: {label: string, description: string, hidden: boolean}, operation: {perform: checkForNewTeams}}}}, triggers: {}, searches: {}, creates: {}, authentication: *}}
 */
const App = {
   version: require('./package.json').version,
   platformVersion: require('zapier-platform-core').version,
   beforeRequest: [
      addApiKeyToHeader
   ],
   afterResponse: [
      sessionRefreshIf401
   ],
   resources: {
      // Re-purposing the newTeam.
      team: {
         key: 'team',
         noun: 'team',
         list: {
            display: {
               label: 'List Teams',
               description: 'List teams for the team filter drop down.',
               hidden: true
            },
            operation: {
               perform: newTeam.operation.perform
            }
         }
      },
   },
   triggers: {
      [newUser.key]: newUser,
      [newTeam.key]: newTeam,
      [newTeamMember.key]: newTeamMember,
      [newPage.key]: newPage,
      [newGuide.key]: newGuide,
      [newGuideReleased.key]: newGuideReleased,
      [newWorkLogEntry.key]: newWorkLogEntry,
      [newImage.key]: newImage,
//      [newVideo.key]: newVideo,
   },
   searches: {},
   creates: {
      /*
         - Add Comment
         - Create Page
         - Add Team Member
         - Finish A Work Log Entry
         - Start A Work Log Entry
         - Capture Data In Work Log
         - Create User
      */
   },
   authentication: authentication
};

module.exports = App;
