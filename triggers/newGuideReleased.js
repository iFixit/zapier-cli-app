const dozukiAPI     = require('../tools/dozukiAPI');

/**
 * extractDataFromResponse will pull the released guide data out of a response.
 *
 * An 'id' key/value pair (for Zapier) added to each result, using a
 * concatenation of the result's 'releaseid' and 'status' values.
 *
 * Result data is found in the 'releases' node.
 *
 * @param response
 * @returns {*}
 */
const extractDataFromResponse = (response) => {
   let responseReleases = response.json.releases;

   for (let x in responseReleases) {
      if (responseReleases.hasOwnProperty(x)) {
         responseReleases[x].id = responseReleases[x].releaseid.toString().concat(responseReleases[x].status);
      }
   }
   return responseReleases;
};

/**
 * checkForNewGuides is technically new guide published.
 *
 * @param z
 * @param bundle
 * @returns {*}
 */
const checkForNewReleasedGuides = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.endpoint = ['guides', 'releases'];
   dAPI.callback = extractDataFromResponse;

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newGuideReleased',
   noun: 'guide released',
   display: {
      label: 'New Guide Released',
      description: 'Triggers when guides are released on the site.'
   },
   operation: {
      sample: {
         "id": 12,
         "releaseid": 12,
         "guideid": 123,
         "langid": "en",
         "revisionid": 1234,
         "user": {},
         "status": "released",
         "title": "Release V3.2",
         "init_date": 1512692697,
         "release_date": 1512692697,
         "notes": "Improved introduction text.",
         "type": "major"
      },
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'releaseid', label: 'Entry ID'},
         {key: 'guideid', label: 'Guide ID'},
         {key: 'langid', label: 'Lang ID'},
         {key: 'revisionid', label: 'Revision ID'},
         {key: 'user', label: 'User'},
         {key: 'status', label: 'Status'},
         {key: 'title', label:  'Title'},
         {key: 'init_date', label: 'Init Date'},
         {key: 'release_date', label: 'Release Date'},
         {key: 'notes', label: 'Notes'},
         {key: 'type', label: 'Type'}
      ],
      perform: checkForNewReleasedGuides
   }
};
