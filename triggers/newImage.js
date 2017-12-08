/* TODO: This and the video trigger are not yet defined... this is just a stub. */

/**
 *
 * @param z
 * @param bundle
 * @returns {Promise|Promise.<TResult>}
 */
const checkForNewImages = (z, bundle) => {
   const promise = z.request('https://' + bundle.authData.siteName
    + '.dozuki.com/api/2.0/images', {
      params: {
         limit: 200,
         order: 'DESC'
      }
      , timeout: 5000
   });

   return promise.then((response) => {
      if (response.status !== httpCodes.success) {
         throw new Error('Bad login ' + response.message + " : " + response.status + " : " + JSON.stringify(response.json));
      } else {
         // Translate 'imageid' into the 'id' for Zapier
         for (let x in response.json) {
            response.json[x].id = response.json[x].imageid;
         }
         return response.json;
      }
   });
};

module.exports = {
   key: 'newImage',
   noun: 'New Image',
   display: {
      label: 'New Image',
      description: 'Trigger when a new image is added.'
   },
   operation: {
      perform: checkForNewImages
   }
};