const should = require('should');
const zapier = require('zapier-platform-core');
const App    = require('../index.js');

const authentication = require('../tools/authentication');

const appTester = zapier.createAppTester(App);

describe('My App Tests...', () => {
   // doAuthTests can potentially change the token out from under a live zap if it is pointing at the same site and using the same user login.
   //doAuthTests();
   // doNewTeamTests can potentially change the token out from under a live zap if it is pointing at the same site and using the same user login.
   //doGetAuthKeyAndNewTeamTests();

   let sessionKey = '69843dc989fe2450ae3bd7d1caf5cf11';
   doNewTeamTests(sessionKey);
   doNewTeamMemberTests(sessionKey, 35, 55);
   doNewUserTests(sessionKey);
   doNewWorkLogEntryTests(sessionKey);
   doNewPageTests(sessionKey);
   doNewGuideTests(sessionKey);
   doNewGuideReleaseTests(sessionKey);
   doNewImageTests(sessionKey);
   //doNewVideoTests(sessionKey);
   doCreateCommentTests(sessionKey);
});

function doAuthTests() {
   // TODO: Take my email/password (admin!) out of this code and replace with a test account!!!
   const bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo'
      }
   };

   it('Should get auth key for my account', (done) => {
      appTester(authentication.sessionConfig.perform, bundle)
       .then(results => {
          // check the token
          should(results.sessionKey).be.a.String();
          done();
       })
       .catch(err => {
          done(err);
       });
   });

   const bundleFail = {
      authData: {
         email: 'shaun@dozuki.com',
         siteName: 'slo'
      }
   };

   it('Should NOT get auth key for my account', (done) => {
      appTester(authentication.sessionConfig.perform, bundleFail)
       .then(results => {
          // Let someone on the API team know?
          done(new Error("We got a token without a password? (Test is broken, or we need to let someone on the API team know about this!)"));
       })
       .catch(err => {
          // We expect a "bad login" to be thrown... this is a success
          done();
       });
   });
}

function doGetAuthKeyAndNewTeamTests() {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo'
      }
   };

   it('Should get auth key for my account', (done) => {
      appTester(authentication.sessionConfig.perform, bundle)
       .then(results => {
          // check the token
          should(results.sessionKey).be.a.String();

          bundle.authData.sessionKey = results.sessionKey;

          done();
       })
       .catch(err => {
          done(err);
       });
   });

   bundle.inputData = {};
   bundle.inputData.maxMemberSince = 0;

   describe('should retrieve teams waiting', function(){
      // Polls `someCondition` every 1s
      const check = function(done) {
         if (bundle.authData.sessionKey) done();
         else setTimeout( function(){ check(done) }, 1000 );
      };

      before(function( done ){
         check( done );
      });

      it('should retrieve teams', (done2) => {
         appTester(App.triggers.newTeam.operation.perform, bundle)
          .then(results => {
             console.log('new Team test 1 results', results);
             bundle.inputData.maxMemberSince = results['maxMemberSince'] + 1;
             /*
                       should(results.length).above(1);

                       results.forEach((result) => {
                          console.log('test result: ', result);
                       });
                       const firstResult = results[0];

                       console.log('test result: ', firstResult);
                       should(firstResult.name).eql('name 1');
                       should(firstResult.directions).eql('directions 1');
             */

             done2();
          })
          .catch(err => {
             console.log('catch bogus', err);
          });
      });
   });
}

function doNewTeamTests(sessionKey) {

   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      }
   };

   it('should retrieve teams', (done) => {
      appTester(App.triggers.newTeam.operation.perform, bundle)
       .then(results => {
//          console.log('doNewTeamTests', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doNewTeamMemberTests(sessionKey, teamId, badTeamId) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         teamid: teamId
      }
   };

   it('should retrieve team members', (done) => {
      appTester(App.triggers.newTeamMember.operation.perform, bundle)
       .then(results => {
          //console.log('doNewTeamMemberTests', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });

   // Test NOT found
   let bundle2 = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         teamid: badTeamId
      }
   };

   it('should NOT retrieve new team members', (done) => {
      appTester(App.triggers.newTeamMember.operation.perform, bundle2)
       .then(results => {
          done(new Error("We got a token without a password? (Test is broken, or we need to let someone on the API team know about this!)"));
       })
       .catch(err => {
          done();
       });
   });
}

function doNewUserTests(sessionKey) {

   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      }
   };

   it('should retrieve users', (done) => {
      appTester(App.triggers.newUser.operation.perform, bundle)
       .then(results => {
          // console.log('doNewUserTests', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doNewPageTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         pageType: 'WIKI'
      }
   };
   it('should retrieve new WIKI pages', (done) => {
      appTester(App.triggers.newPage.operation.perform, bundle)
       .then(results => {
          //console.log('doNewPageTests', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doNewWorkLogEntryTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         guideid: 416,
         userid: 5
      }
   };
   it('should retrieve new work logs', (done) => {
      appTester(App.triggers.newWorkLogEntry.operation.perform, bundle)
       .then(results => {
          // console.log('doNewWorkLogEntryTests', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });

}

function doNewGuideTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      }
   };

   it('should retrieve teams', (done) => {
      appTester(App.triggers.newGuide.operation.perform, bundle)
       .then(results => {
          //console.log('doNewGuideTestsResults=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doNewGuideReleaseTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      }
   };

   it('should retrieve released guides', (done) => {
      appTester(App.triggers.newGuideReleased.operation.perform, bundle)
       .then(results => {
          //console.log('doNewGuideTestsResults=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doNewImageTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      }
   };

   it('should retrieve images', (done) => {
      appTester(App.triggers.newImage.operation.perform, bundle)
       .then(results => {
          // Visual check of final bloats output...
          //console.log('doNewImageTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doNewVideoTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      }
   };

   it('should retrieve videos', (done) => {
      appTester(App.triggers.newVideo.operation.perform, bundle)
       .then(results => {
          // console.log('doNewVideoTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doCreateCommentTests(sessionKey) {
   let randomData = Math.random().toString(36).substring(7);
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         parentId: 85,
         commentText: "This is a comment" + randomData
      }
   };

   it('should retrieve videos', (done) => {
      appTester(App.creates.createComment.operation.perform, bundle)
       .then(results => {
          // console.log('doCreateCommentTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}