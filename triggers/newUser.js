const dozukiAPI     = require('../tools/dozukiAPI');

/**
 * extractDataFromResponse will pull the user data out of a response.
 *
 * An 'id' key/value pair (for Zapier) is added to each result, using the
 * result's 'userid'.
 *
 * @param response
 * @returns {JSONReporter|*}
 */
const extractDataFromResponse = (response) => {
   for (let x in response.json) {
      if (response.json.hasOwnProperty(x)) {
         response.json[x].id = response.json[x].userid;
      }
   }
   return response.json;
};

/**
 * checkForNewUsers will pull the user list.
 *
 * The list of users is pulled in descending order with a limit of 200 to get
 * as many as 200 new users at a time.
 *
 * Concerns: It is possible that more than 200 users were added... what do we do?
 *
 * @param z
 * @param bundle
 * @returns {*}
 */
const checkForNewUsers = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.endpoint = ['users'];
   dAPI.callback = extractDataFromResponse;

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newUser',
   noun: 'New User',
   display: {
      label: 'New User',
      description: 'Triggers when new users are added to the site.'
   },
   operation: {
      sample: {
         "id": 123,
         "userid": 123,
         "username": "John",
         "unique_username": "johnjohn",
         "join_date": 1512423833,
         "image": {id: -32,
            guid: 'default_avatar_placeholder_guid',
            original: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-19',
            mini: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-19.mini',
            thumbnail: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-19.thumbnail',
            standard: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-19.standard',
            medium: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-19.medium',
            large: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-19.large'},
         "reputation": 10,
         "url": "https://yoursitename.dozuki.com/User/123/John",
         "teams": [35],
         "privileges": ["User"]
      },
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'userid', label: 'User ID'},
         {key: 'unique_username', label: 'Unique Username'},
         {key: 'join_date', label: 'Join Date'},
         {key: 'image', label: 'Image'},
         {key: 'url', label: 'URL'}
      ],
      perform: checkForNewUsers
   }
};