const httpCodes        = require('./tools/httpCodes');
const authentication   = require('./tools/authentication');
const dozukiAPI        = require('./tools/dozukiAPI');
const triggers         = require('./triggers/includeTriggers');
const creates          = require('./creates/includeCreates');

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
         // TODO: Debug kludge for not grabbing failed 'createUser' runs.
         if (!bundle.inputData.uniqueUsername) {
            throw new z.errors.RefreshAuthError('Session key needs refreshing.');
         }
      }
   }
   return response;
};

/**
 *
 * @type {{version, platformVersion: *, beforeRequest: [null], afterResponse: [null], resources: {team: {key: string, noun: string, list: {display: {label: string, description: string, hidden: boolean}, operation: {perform: checkForNewTeams}}}}, triggers: {}, searches: {}, creates: {}, authentication: {type: string, test: {url: string}, connectionLabel: string, fields: (null|null|null)[], sessionConfig: {perform: (function(*, *))}}}}
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
               perform: triggers.newTeam.operation.perform
            }
         }
      },
      testAPI: {
         key: 'testAPI',
         noun: 'testAPI',
         list: {
            display: {
               label: 'Test API',
               description: 'Test API Resource.',
               hidden: true
            },
            operation: {
               perform: (z, bundle) => {
                  let dAPI = new dozukiAPI(bundle.authData.siteName);

                  if (bundle.inputData.method === 'GET') {
                     dAPI.endpoint = ['teams'];
                     let promise = dAPI.getListFromEndpoint(z);
                     return promise.then((data) => {
                        return [{id: 1, data: data[0]}]
                     });
                  } else if (bundle.inputData.method === 'PUT') {
                     let promise = dAPI.putDataOnEndpoint(z);
                     return promise.then((data) => {
                        return [{id: 1, data: data[0]}]
                     });
                  } else {
                     let promise = dAPI.postDataOnEndpoint(z);
                     return promise.then((data) => {
                        return [{id: 1, data: data[0]}]
                     });
                  }
               }
            }
         }
      }
   },
   triggers: {
      [triggers.newUser.key]: triggers.newUser,
      [triggers.newTeam.key]: triggers.newTeam,
      [triggers.newTeamMember.key]: triggers.newTeamMember,
      [triggers.newPage.key]: triggers.newPage,
      [triggers.newGuide.key]: triggers.newGuide,
      [triggers.newGuideReleased.key]: triggers.newGuideReleased,
      [triggers.newWorkLogEntry.key]: triggers.newWorkLogEntry,
      [triggers.newImage.key]: triggers.newImage,
      [triggers.newVideo.key]: triggers.newVideo
   },
   searches: {},
   creates: {
      [creates.createComment.key]: creates.createComment,
      [creates.createStartedWorkLogEntry.key]: creates.createStartedWorkLogEntry,
      [creates.createFinishedWorkLogEntry.key]: creates.createFinishedWorkLogEntry,
      [creates.createDataCaptureInWorkLogEntry.key]: creates.createDataCaptureInWorkLogEntry,
      [creates.createUser.key]: creates.createUser,
      [creates.createTeamMember.key]: creates.createTeamMember,
      [creates.createPage.key]: creates.createPage,
      [creates.createImage.key]: creates.createImage
   },
   authentication: authentication
};

module.exports = App;
