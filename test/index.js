const should = require('should');
const zapier = require('zapier-platform-core');
const App    = require('../index.js');
const authentication = require('../tools/authentication');

const appTester = zapier.createAppTester(App);

describe('My App Tests...', () => {
   // doAuthTests can potentially change the token out from under a live zap if it is pointing at the same site and using the same user login.
// TODO: Take my email/password (admin!) out of this code and replace with two tests that use both admin & user 'test' accounts!
   // doAuthTests('shaun@dozuki.com', 'j1mgyWhy');
   // doNewTeamTests can potentially change the token out from under a live zap if it is pointing at the same site and using the same user login.
   //doGetAuthKeyAndNewTeamTests();

   let sessionKey = '5eebbd3a231a2c03a2eef68c7035fbb7';

   doNewTeamTests(sessionKey);
   doNewTeamMemberTests(sessionKey, 35, 55);
   doNewUserTests(sessionKey);
   doNewWorkLogEntryTests(sessionKey);
   doNewPageTests(sessionKey);
   doNewGuideTests(sessionKey);
   doNewGuideReleaseTests(sessionKey);
   doNewImageTests(sessionKey);
   doNewVideoTests(sessionKey);
   doCreateCommentTests(sessionKey);
   doCreateStartedWorkLogEntryTests(sessionKey);
   doCreateDataCaptureInWorkLogEntryTests(sessionKey);
   doCreateFinishedWorkLogEntryTests(sessionKey);
   doCreateUserTests(sessionKey);
   doCreateTeamMemberTests(sessionKey);
   doCreatePageTests(sessionKey);

});

function doAuthTests(email, password) {
   const bundle = {
      authData: {
         email: email,
         password: password,
         siteName: 'slo'
      }
   };

   it('Should get auth key for my account', (done) => {
      appTester(authentication.sessionConfig.perform, bundle)
       .then(results => {
          // check the token
          should(results.sessionKey).be.a.String();
          console.log(results.sessionKey);
          done();
       })
       .catch(err => {
          done(err);
       });
   });

   const bundleFail = {
      authData: {
         email: email,
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
          console.log('*******\n doNewVideoTests=', results);
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
         context: 'guide',
         contextId: 429,
         commentText: "This is a comment" + randomData
      }
   };

   it('should add a comment', (done) => {
      appTester(App.creates.createComment.operation.perform, bundle)
       .then(results => {
          console.log('doCreateCommentTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doCreateStartedWorkLogEntryTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         guideId: 429,
         workorderId: '1234'
      }
   };

   it('should start a work log entry', (done) => {
      appTester(App.creates.createStartedWorkLogEntry.operation.perform, bundle)
       .then(results => {
          //console.log('doCreateStartedWorkLogEntryTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doCreateFinishedWorkLogEntryTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         entryId: 316
      }
   };

   it('should finish a work log entry', (done) => {
      appTester(App.creates.createFinishedWorkLogEntry.operation.perform, bundle)
       .then(results => {
          //console.log('doCreateFinishedWorkLogEntryTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doCreateDataCaptureInWorkLogEntryTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         entryId: 315,
         fields: {
            "125": "example1",
            "126": true
         }
      }
   };

   it('should add data to a work log entry', (done) => {
      appTester(App.creates.createDataCaptureInWorkLogEntry.operation.perform, bundle)
       .then(results => {
          //console.log('doCreateDataCaptureInWorkLogEntryTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doCreateUserTests(sessionKey) {
   let randomData = Math.random().toString(36).substring(14);
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         email: randomData + '@testjunk.com',
         username: 'somename' + randomData,
         password: 'thepassword',
         uniqueUsername: randomData
      }
   };

   it('should create a user', (done) => {
      appTester(App.creates.createUser.operation.perform, bundle)
       .then(results => {
          //console.log('doCreateUserTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doCreateTeamMemberTests(sessionKey) {
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         teamId: 35,
         userId: 232,
/*         joinCode: 55 */
      }
   };

   it('should create a new team member', (done) => {
      appTester(App.creates.createTeamMember.operation.perform, bundle)
       .then(results => {
          //console.log('doCreateTeamMemberTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doCreatePageTests(sessionKey) {
   let randomData = Math.random().toString(36).substring(7);
   let bundle = {
      authData: {
         email: 'shaun@dozuki.com',
         password: 'j1mgyWhy',
         siteName: 'slo',
         sessionKey: sessionKey
      },
      inputData: {
         namespace: 'WIKI',
         title: 'A new page by API '  + randomData,
         contents: 'This is the page content.'
      }
   };

   it('should create a new page', (done) => {
      appTester(App.creates.createPage.operation.perform, bundle)
       .then(results => {
          console.log('doCreatePageTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}
