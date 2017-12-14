const dozukiAPI = require('../tools/dozukiAPI');

const createImage = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.timeout   = 5000; // Image upload can take a while?
   dAPI.endpoint  = ['user', 'media', 'images'];

   dAPI.getParams.file = bundle.inputData.file;
   dAPI.getParams.cropToRatio = bundle.inputData.cropToRatio;
   dAPI.body = bundle.inputData.fileData;

   console.log(dAPI.getParams);
//   dAPI.callback  = extractDataFromResponse;
//   dAPI.body.file = encodeURI(bundle.inputData.file);
//   if (bundle.inputData.cropToRatio) {
//      dAPI.body.cropToRatio = bundle.inputData.cropToRatio;
//   }

   return dAPI.postDataOnEndpoint(z, bundle);
};

module.exports = {
   key: 'createImage',
   noun: 'create image',
   display: {
      label: 'Add Image',
      description: "Upload an image to the currently logged in user's media manager. The body of the request should be an image file of one of the following types: JPEG, JPG, GIF, PNG, BMP, TIFF, TIF."
   },
   operation: {
      inputFields: [
         {key: 'file', required: true, type: 'file', label: 'File',
            helpText: "File to be used.  Can be uploaded now, or you can use the result of a trigger."},
         {key: 'cropToRatio', required: true, label: 'Crop To Ratio'
            , choices: {ONE_ONE:'One One', FOUR_THREE:'Four Three', VARIABLE: 'Variable'}
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