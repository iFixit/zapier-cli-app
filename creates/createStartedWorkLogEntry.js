const dozukiAPI = require('../tools/dozukiAPI');

const createStartedWorkLogEntry = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.timeout  = 3000; // Creates seem to take a little longer?
   dAPI.endpoint = ['work_log'];

   /* required */
   dAPI.body.guideid     = bundle.inputData.guideId;
   dAPI.body.workorderid = bundle.inputData.workorderId;

   /* optional */
   if (bundle.inputData.joinCode) {
      dAPI.body.join_code = bundle.inputData.joinCode;
   }

   return dAPI.postDataOnEndpoint(z, bundle);
};

module.exports = {
   key: 'createStartedWorkLogEntry',
   noun: 'comment',
   display: {
      label: 'Start a Work Log Entry',
      description: 'Begins a Work Log entry. After Work Log entry is created, data can be added or it can be finished to end time capture.'
   },
   operation: {
      inputFields: [
         {key: 'guideId', required: true, type: 'string',
            helpText: 'Guide to start an entry for.'},
         {key: 'workorderId', required: true, type: 'string',
            helpText: 'Work order number to tie multiple entries together.'},
      ],
      perform: createStartedWorkLogEntry,
      sample: { entryid: 310,
         guideid: 429,
         userid: 228,
         workorderid: '1234',
         starttime: 1513093959,
         endtime: null,
         max_form_revisionid: 128,
         cancelled: 0,
         duration: 0,
         status: 'started',
         work_data: [],
         timingid: null },
      outputFields: [
         {key: 'guideid', label: 'Guide ID'},
         {key: 'userid', label: 'User ID'},
         {key: 'workorderid', label: 'Work Order ID'},
         {key: 'starttime', label: 'Start Time'},
         {key: 'endtime', label: 'End Time'},
         {key: 'max_form_revisionid', label: 'Max Form Revision ID'},
         {key: 'work_data', label: 'Work Data'},
         {key: 'timingid', label: 'Timing ID'},
      ]
   }
};