module.exports = {
   key: 'createUser',
   noun: 'create user',
   display: {
      label: 'Create User',
      description: 'Creates a new user.'
   },
   operation: {
      inputFields: [
         {key: 'email', required: true, type: 'string', label: 'Email Address',
            helpText: "User's email address. Must be unique amongst users."},
         {key: 'username', required: true, type: 'string', label: 'Username'
            , helpText: 'Display name that is used throughout the site. Many users choose to use their real names.'},
         {key: 'password', required: true, type: 'string', label: 'Password',
            helpText: 'Account password.'},
         {key: 'uniqueUsername', required: true, type: 'string', label: 'Unique Username',
            helpText: 'A unique username name for this user.'},
      ],
      perform: (z, bundle) => {
         let myBody = {
            email: bundle.inputData.email,
            username: bundle.inputData.username,
            password: bundle.inputData.password,
            unique_username: bundle.inputData.uniqueUsername
         };

         const promise = z.request({
            url: 'https://' + bundle.authData.siteName + '.dozuki.com/api/2.0/users',
            method: 'POST',
            body: JSON.stringify(myBody),
            headers: {
               'content-type': 'application/json'
            }
         });

         return promise.then((response) => JSON.parse(response.content));
      },
      sample: { userid: 232,
         username: 'newusername',
         unique_username: 'newuniqueusername',
         image: null,
         teams: [],
         reputation: 1,
         join_date: 1513105512,
         location: null,
         latitude: null,
         longitude: null,
         certification_count: 0,
         badge_counts: { bronze: 0, silver: 0, gold: 0, total: 0 },
         summary: null,
         about_raw: false,
         about_rendered: false,
         privileges: [],
         authToken: '1a78487be466fade9bb1d9d597982dc9'
      },
      outputFields: [
         {key: 'userid', label: 'User ID'},
      ]
   }
};