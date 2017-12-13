const dozukiAPI = require('../tools/dozukiAPI');

/**
 * extractDataFromResponse will pull the image data out of a response.
 *
 * An 'id' key/value pair (for Zapier) is added to each result, using the 'id'
 * of the result's 'image' node.
 *
 * @param response
 * @returns {Array}
 */
const extractDataFromResponse = (response) => {
   for (let x in response.json) {
      if (response.json.hasOwnProperty(x)) {
         response.json[x].id = response.json[x].image.id;
      }
   }
   return response.json;
};

/**
 * checkForNewImages will pull the image list for the logged in user.
 *
 * Note: Is an unique case in that this record already has an 'id' field.  We
 *  overwrite it with the guid field for Zapier to use.
 *
 * @param z
 * @param bundle
 * @returns {*}
 */
const checkForNewImages = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.endpoint = ['user', 'media', 'images'];
   dAPI.callback = extractDataFromResponse;

   return dAPI.getListFromEndpoint(z);
};

module.exports = {
   key: 'newImage',
   noun: 'new image',
   display: {
      label: 'New Image',
      description: "Triggers when new images are added to the user's media manager."
   },
   operation: {
      sample: {
         "id": "1234",
         "guid": "usEHfArMSHXJvOaR",
         "image": {
            "id": 1234,
            "guid": "usEHfArMSHXJvOaR",
            "mini": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/usEHfArMSHXJvOaR.mini",
            "thumbnail": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/usEHfArMSHXJvOaR.thumbnail",
            "standard": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/usEHfArMSHXJvOaR.standard",
            "medium": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/usEHfArMSHXJvOaR.medium",
            "large": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/usEHfArMSHXJvOaR.large",
            "huge": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/usEHfArMSHXJvOaR.huge",
            "original": "https://d17kynu4zpq5hy.cloudfront.net/igi/slo/usEHfArMSHXJvOaR"
         },
         "srcid": null,
         "width": 800,
         "height": 600,
         "ratio": "VARIABLE",
         "markup": null,
         "exif": {
            "FileName": "buddy flag.jpg"
         }
      },
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'image', label: 'Image'},
         {key: 'srcid', label: 'Source ID'},
         {key: 'exif', label: 'Exif'}
      ],
      perform: checkForNewImages
   }
};
