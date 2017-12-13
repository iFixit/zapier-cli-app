const dozukiAPI = require('../tools/dozukiAPI');

const createComment = (z, bundle) => {
   let dAPI = new dozukiAPI(bundle.authData.siteName);

   dAPI.timeout  = 3000; // Creates seem to take a little longer?
   dAPI.endpoint = ['comments', bundle.inputData.context, bundle.inputData.contextId];

   dAPI.body.text = bundle.inputData.commentText;

   if (bundle.inputData.parentId) {
      dAPI.body.parentid = bundle.inputData.parentId;
   }

   if (bundle.inputData.langId) {
      dAPI.body.langId = bundle.inputData.langId;
   }

   return dAPI.postDataOnEndpoint(z, bundle);
};

module.exports = {
   key: 'createComment',
   noun: 'comment',
   display: {
      label: 'Create Comment',
      description: 'Creates a new comment.'
   },
   operation: {
      inputFields: [
         {key: 'context', label: 'Context', required: true,
            choices: {
               'guide': 'Guide',
               'step': 'Step',
               'wiki': 'Wiki',
               'info': 'Info',
               'post': 'Post'}},
         {key: 'contextId', required: true, type: 'string',
            helpText: 'The docid where the comment will be added.'},
         {key: 'commentText', required: true, type: 'string'
            , helpText: 'Body of the comment. For sites with public registration, the text length must be at least 12 characters and no more than 1024 characters.'},
         {key: 'parentId', required: false, type: 'string', helpText: 'If the comment is a reply, this is the commentid of the parent comment.'}
      ],
      perform: createComment,
      sample: {
         "commentid":87,
         "locale":null,
         "context":"guide",
         "contextid":429,
         "parentid":null,
         "author":{"userid":228,"username":"hackalot805","unique_username":null,"join_date":1512087908,"image":{"id":-32,"guid":"default_avatar_placeholder_guid","original":"https:\/\/d1ulmmr4d4i8j4.cloudfront.net\/static\/images\/avatars\/User\/Dozuki\/single-avatar-2-12","mini":"https:\/\/d1ulmmr4d4i8j4.cloudfront.net\/static\/images\/avatars\/User\/Dozuki\/single-avatar-2-12.mini","thumbnail":"https:\/\/d1ulmmr4d4i8j4.cloudfront.net\/static\/images\/avatars\/User\/Dozuki\/single-avatar-2-12.thumbnail","standard":"https:\/\/d1ulmmr4d4i8j4.cloudfront.net\/static\/images\/avatars\/User\/Dozuki\/single-avatar-2-12.standard","medium":"https:\/\/d1ulmmr4d4i8j4.cloudfront.net\/static\/images\/avatars\/User\/Dozuki\/single-avatar-2-12.medium","large":"https:\/\/d1ulmmr4d4i8j4.cloudfront.net\/static\/images\/avatars\/User\/Dozuki\/single-avatar-2-12.large"},"reputation":101,"url":"https:\/\/slo.dozuki.com\/User\/228\/hackalot805","teams":[35],"privileges":["Admin"]},
         "title":"How to turn a loop.","text_raw":"This is a test through Zapier.","text_rendered":"<p>This is a test through Zapier.<\/p>",
         "rating":0,
         "date":1513010019,
         "modified_date":1513010019,
         "replied_date":0,
         "status":"public",
         "replies":[]},
      outputFields: [
         {key: 'commentid', label: 'Comment ID'},
         {key: 'contextid', label: 'Context ID'},
         {key: 'parentid', label: 'Parent ID'},
         {key: 'authorId', label: 'Author ID'},
      ]
   }
};