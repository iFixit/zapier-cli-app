const dozukiAPI = require('../tools/dozukiAPI');

const extractDataFromResponse = (response, bundle) => {
   let data = JSON.parse(response.content);

   // Special Case:
   // The Api returns the entire list of members instead of just the one that
   // we added.  We have to find that one in the list and return it.
   for (let x in data) {
      if (data.hasOwnProperty(x)
       && (data[x].userid === bundle.inputData.userId)) {
         return data[x];
      }
   }

   // Note: We should only get here if the API returned success without adding.
   return {};
};

const createTeamMember = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.timeout  = 3000; // Creates seem to take a little longer?
   dAPI.endpoint = ['teams', bundle.inputData.teamId, 'users', bundle.inputData.userId];
   dAPI.callback = extractDataFromResponse;

   if (bundle.inputData.joinCode) {
      dAPI.body.join_code = bundle.inputData.joinCode;
   }

   return dAPI.putDataOnEndpoint(z, bundle);
};

module.exports = {
   key: 'createTeamMember',
   noun: 'create team member',
   display: {
      label: 'Create Team Member',
      description: 'Creates a new team member.'
   },
   operation: {
      inputFields: [
         {key: 'teamId', required: true, type: 'string', label: 'Team ID',
            helpText: "Unique identifier for a specified team."},
         {key: 'userId', required: true, type: 'string', label: 'Username'
            , helpText: 'Unique identifier of specified user to be added to team.'},
         {key: 'joinCode', required: true, type: 'string', label: 'Join Code',
            helpText: 'Code required to join a private team.'},
      ],
      perform: createTeamMember,
      sample: { userid: 232,
         username: 'somename',
         unique_username: 'wizywizwig',
         join_date: 1513105512,
         image:
          { id: -32,
             guid: 'default_avatar_placeholder_guid',
             original: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-09',
             mini: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-09.mini',
             thumbnail: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-09.thumbnail',
             standard: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-09.standard',
             medium: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-09.medium',
             large: 'https://d1ulmmr4d4i8j4.cloudfront.net/static/images/avatars/User/Dozuki/single-avatar-2-09.large' },
         reputation: 1,
         url: 'https://slo.dozuki.com/User/232/somename',
         teams: [ 35 ],
         privileges: [ 'User' ]
      },
      outputFields: [
         {key: 'userid', label: 'User ID'},
         {key: 'unique_username', label: 'Unique Username'},
         {key: 'join_date', label: 'Join Date'},
      ]
   }
};