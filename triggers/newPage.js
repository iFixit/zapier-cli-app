const dozukiAPI     = require('../tools/dozukiAPI');

/**
 * extractDataFromResponse will pull the page data out of a response.
 *
 * An 'id' key/value pair (for Zapier) is added to each result, using the
 * result's 'wikiid'.
 *
 * @param response
 * @returns {Array}
 */
const extractDataFromResponse = (response) => {
   for (let x in response.json) {
      if (response.json.hasOwnProperty(x)) {
         response.json[x].id = response.json[x].wikiid;
      }
   }
   return response.json;
};

/**
 * checkForNewPages
 *
 * @param z
 * @param bundle
 * @returns {*}
 */
const checkForNewPages = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.endpoint = ['wikis', bundle.inputData.pageType];
   dAPI.callback = extractDataFromResponse;

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newPage',
   noun: 'New Page',
   display: {
      label: 'New Page',
      description: 'Triggers when new pages are added to the site.'
   },
   operation: {
      inputFields: [
         {
            key: 'pageType',
            required: true,
            label: 'Choose Page Type',
            choices: {WIKI: 'Wiki', CATEGORY: 'Category', INFO: 'Info', ITEM: 'Item'}
         },
      ],
      sample: {
         "id": 98,
         "dataType": "wiki",
         "wikiid": 98,
         "title": "Dozuki",
         "display_title": "Dozuki",
         "namespace": "CATEGORY",
         "summary": "",
         "url": "https://yoursitename.dozuki.com/c/Dozuki",
         "text": " ",
         "image": null,
         "modified_date": 1379367886
      },
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'dataType', label: 'Data Type'},
         {key: 'wikiid', label: 'Wiki ID'},
         {key: 'title', label: 'Title'},
         {key: 'display_title', label: 'Display Title'},
         {key: 'namespace', label: 'Namespace'},
         {key: 'summary', label: 'Summary'},
         {key: 'url', label: 'URL'},
         {key: 'text', label: 'Text'},
         {key: 'image', label: 'Image'},
         {key: 'modified_date', label: 'Modified Date'},
      ],
      perform: checkForNewPages
   }
};