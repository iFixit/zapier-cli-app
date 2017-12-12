module.exports = {
   key: 'createDataCaptureInWorkLogEntry',
   noun: 'comment',
   display: {
      label: 'Add Data to Work Log Entry',
      description: "Adds data to a 'in-progress' Work Log entry."
   },
   operation: {
      inputFields: [
         {key: 'entryId', required: true, type: 'string',
            helpText: 'Unique Work log entry identifier.'},
         {key: 'fields', required: true, type: 'string',
            helpText: "List of values keyed on field_revisionid from the Step Form. In the example below, the field with field_revisionid '123' has received input from the user of string 'example', and the field with field_revisionid '124' has received input of a checked checkbox."},
         {key: 'lastTimingId', required: false, type: 'string', helpText: "The most recent timingid from a previous request. This prevents multiple sessions from getting out of sync."},
      ],
      perform: (z, bundle) => {
         let myBody = {
            fields: bundle.inputData.fields
         };
         const promise = z.request({
            url: 'https://' + bundle.authData.siteName + '.dozuki.com/api/2.0/work_log/' + bundle.inputData.entryId + '/stepData',
            method: 'PUT',
            body: JSON.stringify(myBody),
            headers: {
               'content-type': 'application/json'
            }
         });

         // The API does not return a response... not sure if this is a bug.
         // TODO: Find out if this is a bug!
         return promise.then((response) => JSON.parse("{}"));
      },
//      sample: {},
//      outputFields: []
   }
};