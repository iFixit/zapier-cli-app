const ListOptions     = require('../listOptions');

/**
 * checkForNewPages
 *
 * @param z
 * @param bundle
 * @returns {*}
 */
const checkForNewPages = (z, bundle) => {
   let listOptions = new ListOptions(bundle.authData.siteName);

   listOptions.endpoint  = ['wikis', bundle.inputData.pageType];
   listOptions.zidFields = ['wikiid'];

   return listOptions.getListFromEndpoint(z);
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