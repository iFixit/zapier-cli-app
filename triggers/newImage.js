const ListOptions     = require('../listOptions');

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
   let listOptions = new ListOptions(bundle.authData.siteName);

   listOptions.endpoint   = ['user', 'media', 'images'];
   listOptions.zidFields  = ['guid'];  // Use the guid instead of the id.
   listOptions.dataOffset = ['image'];

   return listOptions.getListFromEndpoint(z);
};

module.exports = {
   key: 'newImage',
   noun: 'new image',
   display: {
      label: 'New Image',
      description: 'Triggers when new images are added to the users media manager.'
   },
   operation: {
      sample: {
         "id": 12,
         "teamid": 12,
         "image": null,
         "name": "Super Team",
         "description": "A really super team.",
         "owner": 123,
         "location": null,
         "latitude": null,
         "longitude": null,
         "reputation": 1234,
         "member_count": 5,
         "new_member_since": 1512423833
      },
      outputFields: [
         {key: 'id', label: 'ID'},
         {key: 'teamid', label: 'Team ID'},
         {key: 'image', label: 'Image'},
         {key: 'name', label: 'Name'},
         {key: 'description', label: 'Description'},
         {key: 'owner', label: 'Owner'},
         {key: 'location', label: 'Location'},
         {key: 'latitude', label: 'Latitude'},
         {key: 'longitude', label: 'Longitude'},
         {key: 'reputation', label: 'Reputation'},
         {key: 'member_count', label: 'Member Count'},
         {key: 'new_member_since', label: 'New Member Since'}
      ],
      perform: checkForNewImages
   }
};
