const dozukiAPI     = require('../tools/dozukiAPI');

/**
 * extractDataFromResponse will pull the team member data out of a response.
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
 * checkForNewTeamMembers will pull the team member list.
 *
 * The list of teams is pulled in descending order with a limit of 200 to get
 * as many as 200 new teams at a time.
 *
 * Concerns: It is possible that more than 200 teams were added... what do we do?
 *
 * @param z
 * @param bundle
 * @returns {*}
 */
const checkForNewTeamMembers = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.endpoint = ['teams', bundle.inputData.teamid];
   dAPI.callback = extractDataFromResponse;

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newTeamMember',
   noun: 'New Team Member',
   display: {
      label: 'New Team Member',
      description: 'Triggers when new team members are added to the site.'
   },
   operation: {
      inputFields: [
         {
            key: 'teamid',
            required: true,
            label: 'Choose Team',
            dynamic: 'teamList.id.name'
         },
      ],
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
      perform: checkForNewTeamMembers
   }
};