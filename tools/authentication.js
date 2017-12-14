const httpCodes        = require('./httpCodes');

/**
 * Notes:
 *
 * 1) The fields in the AuthData are masked in the logs.
 *    email, password, sessionKey
 *
 * 2) If you look and the monitor for the app you will see that we are burning
 *    tokens during initial connection and when the 'test' button on the
 *    connection is used... this is just how Zapier does it.
 *
 * 3) We went with the 'session' model because it has a mechanism for refreshing the token if it becomes invalid.
 *
 */

/**
 * getAuthKey
 *
 * @param z
 * @param bundle
 * @returns {Promise|Promise.<TResult>}
 */
const getAuthKey = (z, bundle) => {
   if (bundle.authData && bundle.authData.email
    && bundle.authData.password
    && bundle.authData.siteName) {
      // Send email and password from the authData in the POST data
      const options = {
         method: 'POST',
         body: JSON.stringify({
            email: bundle.authData.email,
            password: bundle.authData.password
         }),
      };

      // Request an auth token from our API.
      const promise = z.request('https://'+ bundle.authData.siteName
       + '/api/2.0/user/token', options);
      return promise.then((response) => {
         if (response.status !== httpCodes.created) {
            if (response.status === httpCodes.unauthorized) {
               throw new Error('Invalid username and password combination.');
            } else {
               // include the message, status and json for additional details.
               throw new Error('Bad login... message: ' + response.message
                + "; status: " + response.status + ", json: "
                + JSON.stringify(response.json));
            }
         } else {
            // Return the authToken and the userid.
            // They are stored and passed around in the authData for future use.
            return {
               sessionKey: response.json.authToken,
               userId: response.json.userid
            };
         }
      });
   } else {
      // This should never happen unless called with bad params by a unit test.
      throw new Error('getAuthKey received bad params');
   }
};

/**
 * Export the JSON schema for authentication
 *
 * type: 'session' is the type of authentication model we are using.
 * test: 'url' is what we bang to confirm the sessionKey (authToken in dozuki speak) is working.
 * connectionLabel: Is how we get the email address displayed within the connection UI.
 * fields: Describes the controls we use to get the authData.  Site, Email and Password.
 * sessionConfig: 'Perform' tells Zapier to call getAuthKey when a token is needed.
 *
 * @type {{type: string, test: {url: string}, connectionLabel: string, fields: [null,null,null], sessionConfig: {perform: (function(*, *))}}}
 */
module.exports = {
   type: 'session',
   test: {
      url: 'https://{{bundle.authData.siteName}}/api/2.0/user'
   },
   connectionLabel: '{{bundle.authData.email}}',
   fields: [
      {key: 'siteName', label: 'Site Name', type: 'string',
         inputFormat: 'https://.{{input}}.dozuki.com',
         helpText: 'What is the name of your Dozuki site (e.g. yoursitename.dozuki.com).',
         required: true, placeholder: 'Enter Your Site Name'},
      {key: 'email', label: 'Username (email address)', type: 'string',
         required: true},
      {key: 'password', label: 'Password', type: 'password', required: true},
   ],
   sessionConfig: {
      perform: getAuthKey
   }
};
