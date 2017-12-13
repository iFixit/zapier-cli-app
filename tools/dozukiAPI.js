const httpCodes = require('./httpCodes');

const MIN_TIMEOUT       = 0;
const MAX_TIMEOUT       = 5000; // five seconds
const MIN_RESULTS_LIMIT = 1; // at least one result
const MAX_RESULTS_LIMIT = 200; // our API won't allow more than 200 results in most cases

const DEFAULT_TIMEOUT       = 2000;
const DEFAULT_RESULTS_LIMIT = 200;
const DEFAULT_ENDPOINT      = 'guides';
const DEFAULT_ORDER         = 'DESC';

/**
 * dozukiAPI wraps some API endpoint GET calls with common options.
 *
 * Defaults to the '/guides' endpoint so it will work out of the box.
 */
class dozukiAPI {

   putDataOnEndpoint(z, bundle) {
//    if (this.validPutOptions()) {
         const promise = z.request(this.getEndPoint(), {
            method: 'PUT',
            body: JSON.stringify(this.body),
            headers: {
               'content-type': 'application/json'
            }
         });

         return promise.then((response) => {
            if (response.status !== httpCodes.success) {
               // Usually a token went bad (401)... we will retry after fetching a new token.
               throw new Error('API call failed! ' + response.message + " : "
                + response.status + " : " + JSON.stringify(response.json));
            } else {
               if (this.callback) {
                  return this.callback(response, bundle);
               } else {
                  return response.json;
               }
            }
         });
//    }
   }

   postDataOnEndpoint(z, bundle) {
//   if (this.validPostOptions()) {
         const promise = z.request(this.getEndPoint(), {
            method: 'POST',
            body: JSON.stringify(this.body),
            headers: {
               'content-type': 'application/json'
            }
         });

         return promise.then((response) => {
            if (response.status !== httpCodes.created && response.status !== httpCodes.success) {
               // Usually a token went bad (401)... we will retry after fetching a new token.
               throw new Error('API call failed! ' + response.message + " : "
                + response.status + " : " + JSON.stringify(response.json));
            } else {
               if (this.callback) {
                  return this.callback(response, bundle);
               } else {
                  return response.json;
               }
            }
         });
//    }
   }

   /**
    * getListFromEndpoint
    *
    * @param z
    * @param callback
    * @returns {Promise|Promise.<TResult>}
    */
   getListFromEndpoint(z) {
      if (this.validGetOptions()) {
         const promise = z.request(this.getEndPoint(), {params: this.getGetParams()});

         return promise.then((response) => {
            if (response.status !== httpCodes.success) {
               // Usually a token went bad (401)... we will retry after fetching a new token.
               throw new Error('API call failed! ' + response.message + " : "
                + response.status + " : " + JSON.stringify(response.json));
            } else {
               if (this.callback) {
                  return this.callback(response);
               } else {
                  return response.json;
               }
            }
         });
      }
      // This should be an assert... is a programmer error... but javascript.
      throw new Error('dozukiAPI detected invalid options!');
   };

   /**
    * validOptions is a place to validate options to some extent
    *
    * @returns {boolean}
    */
   validGetOptions() {
      return this.siteName && this.siteName.length
       && (this.endpoint && this.endpoint.length)
       && (this.limit && this.limit >= MIN_RESULTS_LIMIT && this.limit <= MAX_RESULTS_LIMIT)
       && (this.order && (this.order === 'ASC' || this.order === 'DESC'))
       && (this.timeout && this.timeout >= MIN_TIMEOUT && this.timeout <= MAX_TIMEOUT);
   }

   getEndPoint() {
      return 'https://' + this.siteName + '.dozuki.com/api/2.0'
       + this.appendEndpoint();
   }

   /**
    * appendEndpoint
    *
    * @returns {string}
    */
   appendEndpoint() {
      let components = '';
      if (this.endpoint.length) {
         this.endpoint.forEach(component => {
            components += ('/' + component);
         });
      }
      return components;
   }

   /**
    *
    * @returns {Object}
    */
   getGetParams() {
      let myParams = {};
      Object.keys(this.getParams).forEach(key => {
         myParams[key] = this.getParams[key];
      });

      /* These are always set to something */
      myParams.limit = this.limit;
      myParams.order = this.order;
      myParams.timeout = this.timeout;

      return myParams;
   }

   /**
    * constructor just sets up some defaults.
    *
    * @param siteName
    */
   constructor(siteName) {
      this.siteName      = siteName;
      this.endpoint      = [DEFAULT_ENDPOINT];
      this.limit         = DEFAULT_RESULTS_LIMIT;
      this.order         = DEFAULT_ORDER;
      this.timeout       = DEFAULT_TIMEOUT;
      this.getParams     = [];
      this.callback      = null;
      this.body          = {};
   }
}

module.exports = dozukiAPI;
