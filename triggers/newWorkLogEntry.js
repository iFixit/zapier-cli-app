const dozukiAPI = require('../tools/dozukiAPI');

/**
 * extractDataFromResponse will pull the work log entry data out of a response.
 *
 * An 'id' key/value pair (for Zapier) is added to each result, using the
 * result's 'entryid'.
 *
 * Result data is found in the 'results' node.
 *
 * @param response
 * @returns {JSONReporter|*}
 */
const extractDataFromResponse = (response) => {
   let responseReleases = response.json.results;

   for (let x in responseReleases) {
      if (responseReleases.hasOwnProperty(x)) {
         responseReleases[x].id = responseReleases[x].entryid;
      }
   }
   return responseReleases;
};

/**
 * checkForNewWorkLogEntries
 *
 * @param z
 * @param bundle
 * @returns {Promise|Promise.<TResult>}
 */
const checkForNewWorkLogEntries = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.endpoint = ['work_log'];
   dAPI.callback = extractDataFromResponse;

   if (bundle.inputData.guideid) {
      dAPI.getParams.guideid = bundle.inputData.guideid;
   }

   if (bundle.inputData.userid) {
      dAPI.getParams.userid = bundle.inputData.userid;
   }

   if (bundle.inputData.workorderid) {
      dAPI.getParams.workorderid = bundle.inputData.workorderid;
   }

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newWorkLogEntry',
   noun: 'New Work Log Entry',
   display: {
      label: 'New Work Log Entry',
      description: 'Triggers when new work logs are added to the site.'
   },
   operation: {
      inputFields: [
         {
            key: 'guideid',
            required: false,
            label: 'Guide ID',
            helpText: 'Enter a specific guide ID to trigger on. (e.g. 406). You can find the guide ID at the end of a guide URL.',
            type: 'string'
         },
         {
            key: 'userid',
            required: false,
            label: 'User ID',
            helpText: 'Enter a specific user ID to trigger on. (e.g. 55). You can find the user ID within a user profile URL.',
            type: 'string'
         },
         {
            key: 'workorderid',
            required: false,
            label: 'Work Order Number',
            helpText: 'Enter a specific work order number to trigger on. (e.g. SH-001). Work order numbers are defined by the operators.  You can find a list of previously defined work order numbers in the Timing and Data Capture report.',
            type: 'string'
         },
      ],
      sample: {
         "id":309,
         "entryid":309,
         "guideid":380,
         "userid":228,
         "workorderid":"sh-003",
         "starttime":1512658808,
         "endtime":1512658831,
         "max_form_revisionid":128,
         "cancelled":0,
         "guide_revisionid":5769,
         "duration":23,
         "status":"complete",
         "work_data":[{"label":"What animal shelter did you go to? ","value":"SM Humane","field_revisionid":238,"stepid":1752},
             {"label":"How many kittens did you love?","value":"all","field_revisionid":239,"stepid":1754},
             {"label":"Did you find the kittens? ","value":"yes","field_revisionid":242,"stepid":1753},
             {"label":"Are you happy? ","value":"yes","field_revisionid":243,"stepid":1755}]},
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'entryid', label: 'Entry ID'},
         {key: 'guideid', label: 'Guide ID'},
         {key: 'userid', label: 'User ID'},
         {key: 'workorderid', label: 'Work Order Number'},
         {key: 'starttime', label: 'Start Time'},
         {key: 'endtime', label: 'End Time'},
         {key: 'max_form_revisionid', label:  'Max_Form_Revision ID'},
         {key: 'cancelled', label: 'Cancelled'},
         {key: 'guide_revisionid', label: 'Guide Revision ID'},
         {key: 'duration', label: 'Duration'},
         {key: 'status', label: 'Status'},
         {key: 'work_data', label: 'Work Data'}
      ],
      perform: checkForNewWorkLogEntries
   }
};