const ListOptions     = require('../listOptions');

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
   let listOptions = new ListOptions(bundle.authData.siteName);

   listOptions.endpoint  = ['users'];
   listOptions.zidFields = ['userid'];

   return listOptions.getListFromEndpoint(z);
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
         "image": null,
         "reputation": 10,
         "url": "https://yoursitename.dozuki.com/User/123/John",
         "teams": [35],
         "privileges": ["User"]
      },
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'userid', label: 'User ID'},
         {key: 'unique_username', label: 'Unique Username'},
         {key: 'username', label: 'Username'},
         {key: 'join_date', label: 'Join Date'},
         {key: 'image', label: 'Image'},
         {key: 'url', label: 'URL'},
         {key: 'teams', label: 'Teams'},
         {key: 'privileges', label: 'Privileges'},
         {key: 'reputation', label: 'Reputation'}
      ],
      perform: checkForNewUsers
   }
};