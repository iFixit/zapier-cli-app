const dozukiAPI = require('../tools/dozukiAPI');

const createPage = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.timeout  = 3000; // Creates seem to take a little longer?
   dAPI.endpoint = ['wikis'];

   /* Required */
   dAPI.body.namespace = bundle.inputData.namespace;
   dAPI.body.title     = bundle.inputData.title;
   dAPI.body.contents  = bundle.inputData.contents;

   /* Optional */
   if (bundle.inputData.displayTitle) {
      dAPI.body.display_title = bundle.inputData.displayTitle;
   }
   if (bundle.inputData.description) {
      dAPI.body.description = bundle.inputData.description;
   }
   if (bundle.inputData.image) {
      dAPI.body.image = bundle.inputData.image;
   }
   if (bundle.inputData.tableOfContents) {
      dAPI.body.table_of_contents = bundle.inputData.tableOfContents;
   }
   if (bundle.inputData.repairabilityScore) {
      dAPI.body.repairability_score = bundle.inputData.repairabilityScore;
   }
   if (bundle.inputData.sourceRevisionId) {
      dAPI.body.source_revision_id = bundle.inputData.sourceRevisionId;
   }
   if (bundle.inputData.flags) {
      dAPI.body.flags = bundle.inputData.flags;
   }
   if (bundle.inputData.suppliers) {
      dAPI.body.suppliers = bundle.inputData.suppliers;
   }

   return dAPI.postDataOnEndpoint(z, bundle);
};

module.exports = {
   key: 'createPage',
   noun: 'create page',
   display: {
      label: 'Create Page',
      description: 'Creates a new page on your Dozuki site.'
   },
   operation: {
      inputFields: [
         {key: 'namespace', required: true, label: 'Page Type', choices: {CATEGORY: 'Category', WIKI: 'Wiki', INFO: 'Info', ITEM: 'Item'},
            helpText: "What type of page would you like to create?"},
         {key: 'title', required: true, type: 'string', label: 'Title'
            , helpText: 'Title for the wiki. This determines the URL of wiki and the default display_title. If the Page Title is a USER or TEAM, the title must be the userid or teamid as a string.'},
         {key: 'contents', required: true, type: 'string', label: 'Contents',
            helpText: 'Main contents for the wiki. This is a free form wiki text field that gets rendered into HTML. See Wiki Syntax Help docs (`https://www.dozuki.com/Help/Wiki_Syntax`).'},
         {key: 'displayTitle', required: false, type: 'string', label: 'Display Title',
            helpText: "Display title for the wiki. This does not change the wiki's title but does change the title used for display. Available to Authors and users with more than 500 reputation on the WIKI, INFO, CATEGORY, and ITEM Page Types."},
         {key: 'description', required: false, type: 'string', label: 'Description',
            helpText: 'A brief description of the page.'},
         {key: 'image', required: false, type: 'string', label: 'Image',
            helpText: "Imageid to set as the main image for this wiki. The image must be available in the user's media manager."},
         {key: 'tableOfContents', required: false, type: 'string', label: 'Table of Contents',
            helpText: 'Boolean flag to include a table of contents in the contents_rendered result.'},
         {key: 'repairabilityScore', required: false, type: 'string', label: 'Repairability Score',
            helpText: 'Repairability score for the wiki. Valid values are 0 through 10 -- 0 being least repairable and 10 being most repairable. null removes the score. Available to Admins on the CATEGORY namespace on iFixit.'},
         {key: 'sourceRevisionId', required: false, type: 'string', label: 'Source Revision ID',
            helpText: 'Revisionid for the wiki in the master langid that this wiki is up to date with. This field is required if the wiki being created is a translation of an existing wiki, otherwise it is forbidden.'},
         {key: 'flags', required: false, type: 'string', label: 'Description',
            helpText: 'List of flagids to apply to the wiki. See the Flags page for a list of acceptable values as well as our flags documentation for more information.'},
         {key: 'suppliers', required: false, type: 'string', label: 'Suppliers',
            helpText: 'Array of objects that define types of items and where they can be found. This can be used to populate the item database that can be referenced from guides. All of the fields are optional but there must be at least one. Available on the ITEM namespace. • part_# — Part number. • type — Type of item e.g. color. Can be referenced directly from a guide item. • supplier — Name of supplier/manufacturer. • url — URL of source.'},
      ],
      perform: createPage,
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