const should         = require('should');
const zapier         = require('zapier-platform-core');
const App            = require('../index.js');
const authentication = require('../tools/authentication');

function makeid(idLength) {
   let text = "";
   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
   for (let i = 0; i < idLength; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
}

const appTester = zapier.createAppTester(App);

const exampleTestString = "Ex: $ USER_EMAIL=<useremail> USER_PASSWORD=<user password>  USER_SITE=<user site> zapier test";

describe('My App Tests...', () => {
   if (!(process.env.USER_EMAIL && process.env.USER_PASSWORD && process.env.USER_SITE)) {
      console.log("You must provide a user email and password!\n" + exampleTestString);
   } else {
      // doAuthTests can potentially change the token out from under a live zap if it is pointing at the same site and user.
      // Use a dedicated testing user if possible.
      doAuthTests(process.env.USER_EMAIL, process.env.USER_PASSWORD);
      doDozukiAPITests();
      doNewTeamTests();
      doNewTeamMemberTests(35, 55); // TODO: turn these a magic numbers into process.env variables?
      doNewUserTests();
      doNewWorkLogEntryTests();
      doNewPageTests();
      doNewGuideTests();
      doNewGuideReleaseTests();
      doNewImageTests();
      doNewVideoTests();
      doCreateCommentTests();
      doCreateStartedWorkLogEntryTests();
      doCreateDataCaptureInWorkLogEntryTests();
      doCreateFinishedWorkLogEntryTests();
      doCreateTeamMemberTests();
      doCreatePageTests();
// TODO: The commented out test are failing!
// TODO: Is something wrong with these endpoints?
// TODO: Issues have been opened. (#1 and #2)
      //doCreateUserTests();
      //doCreateImageTests();
   }
});

/**
 * getAuthData
 *
 * @returns {{email: *, password: *, siteName: *, sessionKey: (*|string)}}
 */
function getAuthData() {
   return {
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      siteName: process.env.USER_SITE,
      sessionKey: process.env.sessionKey
   };
}

/**
 * doAuthTests() will test getting a token.
 *
 * The resulting token is used by the remaining tests... so this test must
 * always be first.
 */
function doAuthTests() {
   /* First confirm we don't get a token without a password */
   it('Should NOT get auth key for the account', (done) => {
      const bundleFail = {
         authData: {
            email: process.env.USER_EMAIL,
            siteName: process.env.USER_SITE
            /* Password intentionally left out */
         }
      };

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

   /* Confirm we get a token... we will use this token for the remaining tests */
   it('Should get auth key for the account', (done) => {
      const bundle = {
         authData: {
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD,
            siteName: process.env.USER_SITE
         }
      };
      appTester(authentication.sessionConfig.perform, bundle)
       .then(results => {
          // check the token
          should(results.sessionKey).be.a.String();
          // Important: this value is used for the remaining tests
          process.env.sessionKey = results.sessionKey;
          done();
       })
       .catch(err => {
          done(err);
       });
   });

   it('Should get 401 for the account and call RefreshAuthError', (done) => {
      // Is nice to let an interactive tester know the key.
      // Log it here so the output looks nice.
      console.log("      SessionKey:", process.env.sessionKey);

      // Now run the test
      const bundle = {
         authData: {
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD,
            siteName: process.env.USER_SITE,
            sessionKey: 'aninvalidsessionkey'
         },
         inputData: {}
      };
      appTester(authentication.test, bundle)
       .then(results => {
          done(new Error("We did not fail with a bad token!)"));
       })
       .catch(err => {
          should(err.name).be.a.String();
          should(err.name).be.equal('RefreshAuthError');
          done();
       });
   });
}

function doDozukiAPITests() {
   /* Confirm we get a token... we will use this token for the remaining tests */
   it('Should do a GET', (done) => {
      const bundle = {
         authData: getAuthData(),
         inputData: {
            method: 'GET'
         }
      };
      // Will pull from the '/teams' endpoint
      appTester(App.resources.testAPI.list.operation.perform, bundle)
       .then(results => {
          // We should get an 'id' that we set to 1 in the 'perform'
          should(results[0].id).be.a.Number();
          should(results[0].id).be.equal(1);
          // We should get a teamid from the endpoint
          should(results[0].data.teamid).be.a.Number().above (1);
          // That should be good enough.
          done();
       })
       .catch(err => {
          done(err);
       });
   });

   /*
   TODO: These are a little harder to test... not sure what to do yet.
   it('Should do a PUT', (done) => {
      const bundle = {
         authData: getAuthData(),
         inputData: {
            method: 'PUT'
         }
      };
      appTester(App.resources.testAPI.list.operation.perform, bundle)
       .then(results => {
          console.log(results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });

   it('Should do a POST', (done) => {
      const bundle = {
         authData: getAuthData(),
         inputData: {
            method: 'POST'
         }
      };
      appTester(App.resources.testAPI.list.operation.perform, bundle)
       .then(results => {
          console.log(results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
   */
}

function doNewTeamTests() {
   it('should retrieve teams', (done) => {
      let bundle = {
         authData: getAuthData()
      };
      appTester(App.triggers.newTeam.operation.perform, bundle)
       .then(results => {
          // console.log('doNewTeamTests', results);
          // We should get an 'id'.
          should(results[0].id).be.a.Number().above(0);
          // We should get a 'teamid'.
          should(results[0].teamid).be.a.Number().above(0);
          // The 'teamid' should equal the 'id'.
          should(results[0].teamid).be.equal(results[0].id);
          // That should be good enough.
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doNewTeamMemberTests(teamId, badTeamId) {
   it('should retrieve team members', (done) => {
      let bundle = {
         authData: getAuthData(),
         inputData: {
            teamid: teamId
         }
      };
      appTester(App.triggers.newTeamMember.operation.perform, bundle)
       .then(results => {
          //console.log('doNewTeamMemberTests', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });

   it('should NOT retrieve new team members', (done) => {
      // Test NOT found
      let bundle2 = {
         authData: getAuthData(),
         inputData: {
            teamid: badTeamId
         }
      };
      appTester(App.triggers.newTeamMember.operation.perform, bundle2)
       .then(results => {
          done(new Error("We got a token without a password? (Test is broken, or we need to let someone on the API team know about this!)"));
       })
       .catch(err => {
          done();
       });
   });
}

function doNewUserTests() {
   it('should retrieve users', (done) => {
      let bundle = {
         authData: getAuthData()
      };
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

function doNewWorkLogEntryTests() {
   it('should retrieve new work logs', (done) => {
      let bundle = {
         authData: getAuthData(),
         inputData: {
            guideid: 416,
            userid: 5
         }
      };
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

function doNewPageTests() {
   it('should retrieve new WIKI pages', (done) => {
      let bundle = {
         authData: getAuthData(),
         inputData: {
            pageType: 'WIKI'
         }
      };
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

function doNewGuideTests() {
   it('should retrieve guides', (done) => {
      let bundle = {
         authData: getAuthData()
      };
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

function doNewGuideReleaseTests() {
   it('should retrieve released guides', (done) => {
      let bundle = {
         authData: getAuthData()
      };
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

function doNewImageTests() {
   it('should retrieve images', (done) => {
      let bundle = {
         authData: getAuthData()
      };
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

function doNewVideoTests() {
   it('should retrieve videos', (done) => {
      let bundle = {
         authData: getAuthData()
      };
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

function doCreateCommentTests() {
   it('should add a comment', (done) => {
      let randomData = Math.random().toString(36).substring(7);
      let bundle = {
         authData: getAuthData(),
         inputData: {
            parentId: 85,
            context: 'guide',
            contextId: 429,
            commentText: "This is a comment" + randomData
         }
      };
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

function doCreateStartedWorkLogEntryTests() {
   it('should start a work log entry', (done) => {
      let bundle = {
         authData: getAuthData(),
         inputData: {
            guideId: 429,
            workorderId: '1234'
         }
      };
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

function doCreateFinishedWorkLogEntryTests() {
   it('should finish a work log entry', (done) => {
      let bundle = {
         authData: getAuthData(),
         inputData: {
            entryId: 316
         }
      };
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

function doCreateDataCaptureInWorkLogEntryTests() {
   it('should add data to a work log entry', (done) => {
      let bundle = {
         authData: getAuthData(),
         inputData: {
            entryId: 315,
            fields: {
               "125": "example1",
               "126": true
            }
         }
      };
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

function doCreateTeamMemberTests() {
   it('should create a new team member', (done) => {
      let bundle = {
         authData: getAuthData(),
         inputData: {
            teamId: 35,
            userId: 232,
/*         joinCode: 55 */
         }
      };
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

function doCreatePageTests() {
   it('should create a new page', (done) => {
      let randomData = Math.random().toString(36).substring(7);
      let bundle = {
         authData: getAuthData(),
         inputData: {
            namespace: 'WIKI',
            title: 'A new page by API ' + randomData,
            contents: 'This is the page content.',
            displayTitle: 'Display Title' + randomData,
            description: 'This is a page description',
            image: 55,
            tableOfContents: true,
            // repairabilityScore: 3,
            // sourceRevisionId: 20,
            // flags
            // suppliers
         }
      };
      appTester(App.creates.createPage.operation.perform, bundle)
       .then(results => {
          // console.log('doCreatePageTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doCreateUserTests() {
   it('should create a user', (done) => {
      let randomData = makeid(10);

      let bundle = {
         authData: getAuthData(),
         inputData: {
            email: randomData + '@dozuki.com',
            username: randomData,
            password: 'thepassword',
            uniqueUsername: randomData
         }
      };

      appTester(App.creates.createUser.operation.perform, bundle)
       .then(results => {
          // console.log('doCreateUserTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   });
}

function doCreateImageTests() {
   it('should create a new image', (done) => {
      let bundle = {
         authData: getAuthData(),
         inputData: {
            file: 'https://wallpaperbrowse.com/media/images/colors_explosion_wallpaper_abstract_3d_45.jpg',
            cropToRatio: 'VARIABLE',
         }
      };
      appTester(App.creates.createImage.operation.perform, bundle)
       .then(results => {
          console.log('doCreateImageTests=', results);
          done();
       })
       .catch(err => {
          done(err);
       });
   }).timeout(5000); // Not sure if this is needed or not but this extends the
                     // time before the test framework aborts.
}
