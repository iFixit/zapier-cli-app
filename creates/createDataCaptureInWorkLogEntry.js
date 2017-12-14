const dozukiAPI = require('../tools/dozukiAPI');

const extractDataFromResponse = (response, bundle) => {
   // Special case:
   // The API does not return a response... not sure if this is a bug.
   // TODO: Find out if this is a bug!
   return {};
};

const createDataCaptureInWorkLogEntry = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.timeout  = 3000; // Creates seem to take a little longer?
   dAPI.endpoint = ['work_log', bundle.inputData.entryId, 'stepData'];
   dAPI.callback = extractDataFromResponse;

   dAPI.body.fields =  bundle.inputData.fields;

   if (bundle.inputData.lastTimingId) {
      dAPI.body.lasttimingid = bundle.inputData.lastTimingId;
   }

   return dAPI.putDataOnEndpoint(z, bundle);
};

module.exports = {
   key: 'createDataCaptureInWorkLogEntry',
   noun: 'comment',
   display: {
      label: 'Capture Data in Work Log',
      description: "Adds data to in progress Work Log entry."
   },
   operation: {
      inputFields: [
         {key: 'entryId', required: true, type: 'string',
            helpText: 'Unique Work log entry identifier.'},
         {key: 'fields', required: true, type: 'string',
            helpText: "List of values keyed on field_revisionid from the Step Form. In the example below, the field with field_revisionid '123' has received input from the user of string 'example', and the field with field_revisionid '124' has received input of a checked checkbox."},
         {key: 'lastTimingId', required: false, type: 'string', helpText: "The most recent timingid from a previous request. This prevents multiple sessions from getting out of sync."},
      ],
      perform: createDataCaptureInWorkLogEntry,
// The API does not return a response so there is no sample or outputFields.
// We may need to revisit this if it turns out to be a bug and it gets fixed.
//      sample: {},
//      outputFields: []
   }
};