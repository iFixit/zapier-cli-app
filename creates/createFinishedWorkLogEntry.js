module.exports = {
   key: 'createFinishedWorkLogEntry',
   noun: 'comment',
   display: {
      label: 'Finish Work Log Entry',
      description: 'Finishes a Work Log entry and ends timing capture.'
   },
   operation: {
      inputFields: [
         {key: 'entryId', required: true, type: 'string',
            helpText: 'Set the end time of an entry to the current time, marking the entry as complete.'}
      ],
      perform: (z, bundle) => {
         const promise = z.request({
            // guide, step, wiki, info or post
            url: 'https://' + bundle.authData.siteName + '.dozuki.com/api/2.0/work_log/' + bundle.inputData.entryId + '/finish',
            method: 'POST',
            headers: {
               'content-type': 'application/json'
            }
         });

         return promise.then((response) => JSON.parse(response.content));
      },
      sample: {
         endtime: 1513094744,
         max_form_revisionid: 128,
         guide_revisionid: 6040
      },
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