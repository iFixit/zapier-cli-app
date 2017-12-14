const dozukiAPI = require('../tools/dozukiAPI');

/**
 * extractDataFromResponse will pull the team data out of a response.
 *
 * An 'id' key/value pair (for Zapier) is added to each result, using the
 * result's 'teamid'.
 *
 * @param response
 * @returns {JSONReporter|*}
 */
const extractDataFromResponse = (response) => {
   for (let x in response.json) {
      if (response.json.hasOwnProperty(x)) {
         response.json[x].id = response.json[x].teamid;
      }
   }
   return response.json;
};

/**
 * checkForNewTeams will pull the team list.
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
const checkForNewTeams = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.endpoint = ['teams'];
   dAPI.callback = extractDataFromResponse;

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newTeam',
   noun: 'NewTeam',
   display: {
      label: 'New Team',
      description: 'Triggers when new a team is created.'
   },
   operation: {
      sample: {
         "id": 12,
         "teamid": 12,
         "image": null,
         "name": "Super Team",
         "description": "A really super team.",
         "owner": 123,
         "location": null,
         "latitude": null,
         "longitude": null,
         "reputation": 1234,
         "member_count": 5,
         "new_member_since": 1512423833
      },
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'teamid', label: 'Team ID'},
         {key: 'image', label: 'Image'},
         {key: 'name', label: 'Name'},
         {key: 'description', label: 'Description'},
         {key: 'owner', label: 'Owner'},
         {key: 'location', label: 'Location'},
         {key: 'latitude', label: 'Latitude'},
         {key: 'longitude', label: 'Longitude'},
         {key: 'reputation', label: 'Reputation'},
         {key: 'member_count', label: 'Member Count'},
         {key: 'new_member_since', label: 'New Member Since'}
      ],
      perform: checkForNewTeams
   }
};