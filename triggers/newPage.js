const dozukiAPI = require('../tools/dozukiAPI');

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

   function toTimestamp(strDate){
      var datum = Date.parse(strDate);
      return datum/1000;
   }

   if (bundle.inputData.modifiedSince) {
      dAPI.getParams.modifiedSince = toTimestamp(bundle.inputData.modifiedSince);
   }

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newPage',
   noun: 'New Page',
   display: {
      label: 'New Page Created',
      description: 'Triggers when a new page of a specified type is created.'
   },
   operation: {
      inputFields: [
         {
            key: 'pageType',
            required: true,
            label: 'Choose Page Type',
            choices: {WIKI: 'Wiki', CATEGORY: 'Category', INFO: 'Info', ITEM: 'Item'}
         },
         {
            key: 'modifiedSince',
            required: false,
            label: 'Select a date after which results to return have been modified.',
            helpText: "Type a date, date time or use '{{zap_meta_human_now}}' for now.  See [datetimes](https://zapier.com/help/field-types/#datetimes) and [modifying dates and times](https://zapier.com/help/modifying-dates-and-times/) for more details.",
            type: 'datetime'
         }
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