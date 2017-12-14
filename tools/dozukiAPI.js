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
 * TESTING ISSUES:
 *
 * I can't hit the cominor sites. (ex: slo.sharrington.cominor.com)
 * I get CERT errors. (ex. 'reason: unable to verify the first certificate')
 *
 * I tried...
 *    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
 *
 * and I also tried adding these options on the 'request'...
 *    rejectUnauthorized: false,
 *    insecure: true,
 *
 * to no avail.
 *
 * If someone has some insight here I would greatly appreciate it.
 */

/**
 * dozukiAPI wraps some API endpoint GET calls with common options.
 *
 * Defaults to the '/guides' endpoint so it will work out of the box.
 */
class dozukiAPI {

   /**
    * putDataOnEndpoint
    *
    * @param z
    * @param bundle
    * @returns {Promise|Promise.<TResult>}
    */
   putDataOnEndpoint(z, bundle) {
//    if (this.validPutOptions()) {
         const promise = z.request({
            url: this.getEndPoint(),
            params: this.getPostParams(),
            method: 'PUT',
            timeout: this.timeout,
            body: JSON.stringify(this.body),
            headers: {
               'content-type': 'application/json'
            }
         });

         return promise.then((response) => {
            if (response.status !== httpCodes.success) {
               // Usually a token went bad (401)... we will retry after fetching a new token.
               throw new Error('API (PUT) call failed! ' + response.message + " : "
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
    * postDataOnEndpoint
    *
    * @param z
    * @param bundle
    * @returns {Promise|Promise.<TResult>}
    */
   postDataOnEndpoint(z, bundle) {
//   if (this.validPostOptions()) {
         const promise = z.request({
            url: this.getEndPoint(),
            params: this.getPostParams(),
            method: 'POST',
            timeout: this.timeout,
            body: JSON.stringify(this.body),
            headers: {
               'content-type': 'application/json'
            }
         });

         return promise.then((response) => {
            if (response.status !== httpCodes.created && response.status !== httpCodes.success) {
               // Usually a token went bad (401)... we will retry after fetching a new token.
               throw new Error('API (POST) call failed! ' + response.message + " : "
                + response.status + " : " + JSON.stringify(response.json));// + " : " + JSON.stringify(response));
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
         const promise = z.request({
            url: this.getEndPoint(),
            params: this.getGetParams(),
            timeout: this.timeout
         });

         return promise.then((response) => {
            if (response.status !== httpCodes.success) {
               // Usually a token went bad (401)... we will retry after fetching a new token.
               throw new Error('API (GET) call failed! ' + response.message + " : "
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

   /**
    * getEndPoint
    *
    * @returns {string}
    */
   getEndPoint() {
      return 'https://' + this.siteName + '/api/2.0'
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
    * getGetParams
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

      return myParams;
   }

   /**
    * getPostParams
    *
    * @returns {{}}
    */
   getPostParams() {
      let myParams = {};
      Object.keys(this.getParams).forEach(key => {
         myParams[key] = this.getParams[key];
      });

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
