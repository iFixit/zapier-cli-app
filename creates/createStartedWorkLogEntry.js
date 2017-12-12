module.exports = {
   key: 'createStartedWorkLogEntry',
   noun: 'comment',
   display: {
      label: 'Start Work Log Entry',
      description: 'Begins a Work Log entry. After Work Log entry is created, data can be added or it can be finished to end time capture.'
   },
   operation: {
      inputFields: [
         {key: 'guideId', required: true, type: 'string',
            helpText: 'Guide to start an entry for.'},
         {key: 'workorderId', required: true, type: 'string',
            helpText: 'Work order number to tie multiple entries together.'},
      ],
      perform: (z, bundle) => {
         let myBody = {
            guideid: bundle.inputData.guideId,
            workorderid: bundle.inputData.workorderId
         };

         const promise = z.request({
            url: 'https://' + bundle.authData.siteName + '.dozuki.com/api/2.0/work_log',
            method: 'POST',
            body: JSON.stringify(myBody),
            headers: {
               'content-type': 'application/json'
            }
         });

         return promise.then((response) => JSON.parse(response.content));
      },
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