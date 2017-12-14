const dozukiAPI = require('../tools/dozukiAPI');

const createFinishedWorkLogEntry = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.timeout  = 3000; // Creates seem to take a little longer?
   dAPI.endpoint = ['work_log', bundle.inputData.entryId, 'finish'];

   return dAPI.postDataOnEndpoint(z, bundle);
};

module.exports = {
   key: 'createFinishedWorkLogEntry',
   noun: 'comment',
   display: {
      label: 'Finish A Work Log Entry',
      description: 'Finishes a Work Log entry and ends timing capture.'
   },
   operation: {
      inputFields: [
         {key: 'entryId', required: true, type: 'string',
            helpText: 'Set the end time of an entry to the current time, marking the entry as complete.'}
      ],
      perform: createFinishedWorkLogEntry,
      sample: {
         endtime: 1513094744,
         max_form_revisionid: 128,
         guide_revisionid: 6040
      },
      outputFields: [
         {key: 'endtime', label: 'End Time'},
         {key: 'max_form_revisionid', label: 'Max Form Revision ID'},
         {key: 'guide_revisionid', label: 'Guide Revision ID'}
      ]
   }
};