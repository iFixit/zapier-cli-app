const dozukiAPI = require('../tools/dozukiAPI');

/**
 * extractDataFromResponse will pull the guide data out of a response.
 *
 * An 'id' key/value pair (for Zapier) is added to each result, using the
 * result's 'guideid' as the value.
 *
 * @param response
 * @returns {JSONReporter|*}
 */
const extractDataFromResponse = (response) => {
   for (let x in response.json) {
      if (response.json.hasOwnProperty(x)) {
         response.json[x].id = response.json[x].guideid;
      }
   }
   return response.json;
};

/**
 * checkForNewGuides is technically new guide published.
 *
 * @param z
 * @param bundle
 * @returns {*}
 */
const checkForNewGuides = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.endpoint  = ['guides'];
   dAPI.callback  = extractDataFromResponse;

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newGuide',
   noun: 'guide published',
   display: {
      label: 'New Guide Published',
      description: 'Triggers when guides are published on the site.'
   },
   operation: {
      sample: {
         "id": 123,
         "dataType": "guide",
         "guideid": 123,
         "locale": "en",
         "revisionid": 1234,
         "modified_date": 1512692663,
         "prereq_modified_date": 0,
         "url": "https://yoursitename.dozuki.com/Guide/How+to+turn+a+loop./123",
         "type": "how-to",
         "category": "Beads",
         "subject": "beads",
         "title": "How to turn a loop.",
         "summary": "Learn how to turn a loop with a head pin.",
         "difficulty": "Moderate",
         "time_required_max": 0,
         "public": true,
         "userid": 123,
         "username": "abcdefg",
         "flags": [],
         "image": null
      },
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'dataType', label: 'Data Type'},
         {key: 'guideid', label: 'Guide ID'},
         {key: 'locale', label: 'Locale'},
         {key: 'revisionid', label: 'Revision ID'},
         {key: 'modified_date', label: 'Modified Date'},
         {key: 'prereq_modified_date', label: 'Pre-Req Modified Date'},
         {key: 'url', label: 'URL'},
         {key: 'type', label: 'Type'},
         {key: 'category', label: 'Category'},
         {key: 'subject', label: 'Subject'},
         {key: 'title', label: 'Title'},
         {key: 'summary', label: 'summary'},
         {key: 'difficulty', label: 'Difficulty'},
         {key: 'time_required_max', label: 'Time Required Maximum'},
         {key: 'public', label: 'Public'},
         {key: 'userid', label: 'User ID'},
         {key: 'username', label: 'Username'},
         {key: 'flags', label: 'Flags'},
         {key: 'image', label: 'Image'}
      ],
      perform: checkForNewGuides
   },
};
