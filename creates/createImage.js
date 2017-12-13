const dozukiAPI = require('../tools/dozukiAPI');

const createImage = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.timeout   = 5000; // Image upload can take a while?
   dAPI.endpoint  = ['user', 'media', 'images'];
//   dAPI.callback  = extractDataFromResponse;
   dAPI.body.file = encodeURI(bundle.inputData.file);
   if (bundle.inputData.cropToRatio) {
      dAPI.body.cropToRatio = bundle.inputData.cropToRatio;
   }

   return dAPI.postDataOnEndpoint(z, bundle);
};

module.exports = {
   key: 'createImage',
   noun: 'create image',
   display: {
      label: 'Create Image',
      description: 'Creates a new image.'
   },
   operation: {
      inputFields: [
         {key: 'file', required: true, type: 'string', label: 'File',
            helpText: "Filename of the image being uploaded."},
         {key: 'cropToRatio', required: false, type: 'string', label: 'Crop To Ratio'
            , helpText: 'If necessary, crops the image to the specified ratio.'},
      ],
      perform: createImage,
      // TODO: This is wrong
      sample: {
         imageid: 1234,
      },
      // TODO: this is wrong
      outputFields: [
         {key: 'imageid', label: 'Image ID'},
      ]
   }
};