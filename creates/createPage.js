const httpCodes  = require('../tools/httpCodes');

module.exports = {
   key: 'createPage',
   noun: 'create page',
   display: {
      label: 'Create Page',
      description: 'Creates a new page.'
   },
   operation: {
      inputFields: [
         {key: 'namespace', required: true, label: 'Page Type', choices: {CATEGORY: 'Category', WIKI: 'Wiki', INFO: 'Info', ITEM: 'Item'},
            helpText: "What type of page would you like to create?"},
         {key: 'title', required: true, type: 'string', label: 'Title'
            , helpText: 'Title for the wiki. This determines the URL of wiki and the default display_title. If the Page Title is a USER or TEAM, the title must be the userid or teamid as a string.'},
         {key: 'contents', required: true, type: 'string', label: 'Contents',
            helpText: 'Main contents for the wiki. This is a free form wiki text field that gets rendered into HTML. See Wiki Syntax Help docs (`https://www.dozuki.com/Help/Wiki_Syntax`).'},
/*
TODO : Add additional fields
         Display_title
            Display title for the wiki. This does not change the wiki's title but does change the title used for display. Available to Authors and users with more than 500 reputation on the WIKI, INFO, CATEGORY, and ITEM Page Types.
         Description
            ...
         Image
            Imageid to set as the main image for this wiki. The image must be available in the user's media manager.
         Table_of_contents
            Boolean flag to include a table of contents in the contents_rendered result.
         Repairability_score
            Repairability score for the wiki. Valid values are 0 through 10 -- 0 being least repairable and 10 being most repairable. null removes the score. Available to Admins on the CATEGORY namespace on iFixit.
         Source_revisionid
            Revisionid for the wiki in the master langid that this wiki is up to date with. This field is required if the wiki being created is a translation of an existing wiki, otherwise it is forbidden.
         Flags
            List of flagids to apply to the wiki. See the Flags page for a list of acceptable values as well as our flags documentation for more information.
         Suppliers
            Array of objects that define types of items and where they can be found. This can be used to populate the item database that can be referenced from guides. All of the fields are optional but there must be at least one. Available on the ITEM namespace. • part_# — Part number. • type — Type of item e.g. color. Can be referenced directly from a guide item. • supplier — Name of supplier/manufacturer. • url — URL of source.
*/
      ],
      perform: (z, bundle) => {
         let myBody = {
            namespace: bundle.inputData.namespace,
            title: bundle.inputData.title,
            contents: bundle.inputData.contents
         };


         // TODO: ADD OPTIONAL PARAMS
//         if (bundle.inputData.joinCode) {
//            myBody.join_code = bundle.inputData.joinCode;
//         }

         const promise = z.request({
            url: 'https://' + bundle.authData.siteName + '.dozuki.com/api/2.0/wikis',
            method: 'POST',
            body: JSON.stringify(myBody),
            headers: {
               'content-type': 'application/json'
            }
         });

         return promise.then((response) => {
            if (response.status !== httpCodes.created) {
               // Usually a token went bad (401)... we will retry after fetching a new token.
               throw new Error('API call failed! ' + response.message + " : "
                + response.status + " : " + JSON.stringify(response.json));
            } else {
               return response.json
            }
         });
      },
      sample: { wikiid: 752,
         langid: 'en',
         namespace: 'WIKI',
         title: 'A new page by API (2)',
         revisionid: 2249,
         contents_raw: 'This is the page content.',
         contents_json: { type: 'doc', content: [] },
         contents_rendered: '<p>This is the page content.</p>',
         can_edit: true,
         flags: [],
         image: null,
         documents: [],
         display_title: 'A new page by API (2)',
         table_of_contents: false,
         description: '',
         source_revisionid: null
      },
      outputFields: [
         {key: 'wikiid', label: 'Wiki ID'},
      ]
   }
};