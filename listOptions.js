const httpCodes = require('./httpCodes');

const MIN_TIMEOUT = 0;
const MAX_TIMEOUT = 5000; // five seconds
const MIN_RESULTS_LIMIT = 1; // at least one result
const MAX_RESULTS_LIMIT = 200; // our API won't allow more than 200 results in most cases

const DEFAULT_TIMEOUT = 2000;
const DEFAULT_RESULTS_LIMIT = 200;
const DEFAULT_ENDPOINT = 'guides';
const DEFAULT_ORDER = 'DESC';
const DEFAULT_ZID = 'guidid';

/**
 * ListOptions wraps some API endpoint GET calls with common options.
 *
 * Defaults to the '/guides' endpoint so it will work out of the box.
 */
class ListOptions {

   /**
    * getListFromEndpoint
    *
    * @param z
    * @returns {Promise|Promise.<TResult>}
    */
   getListFromEndpoint(z) {
      if (this.validOptions()) {
         let url = 'https://' + this.siteName + '.dozuki.com/api/2.0'
          + this.appendEndpoint();

         let myParams = {
            limit: this.limit,
            order: this.order,
            timeout: this.timeout,
            params: this.getGetParams()
         };

         const promise = z.request(url, myParams);

         return promise.then((response) => {
            if (response.status !== httpCodes.success) {
               // Usually a token went bad (401)... we will retry after fetching a new token.
               throw new Error('API call failed! ' + response.message + " : "
                + response.status + " : " + JSON.stringify(response.json));
            } else {
               // Sometimes we need to tunnel down to get to the data set.
               let responseToParse = this.getDataOffset(response.json);

               // We need to add an 'id' field for Zapier.
               // Sometimes we use a concatenation of multiple data points.
               for (let x in responseToParse) {
                  responseToParse[x].id = this.createZapId(responseToParse[x]);
               }
               return responseToParse;
            }
         });
      }
      // This should be an assert... is a programmer error... but javascript.
      throw new Error('ListOptions detected invalid options!');
   };

   /**
    * validOptions is a place to validate options to some extent
    *
    * @returns {boolean}
    */
   validOptions() {
      return this.siteName && this.siteName.length
       && (this.endpoint && this.endpoint.length)
       && (this.limit && this.limit >= MIN_RESULTS_LIMIT && this.limit <= MAX_RESULTS_LIMIT)
       && (this.order && (this.order === 'ASC' || this.order === 'DESC'))
       && (this.timeout && this.timeout >= MIN_TIMEOUT && this.timeout <= MAX_TIMEOUT)
       && (this.zidFields && this.zidFields.length)
       && (this.dataOffset);
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
    * createZapId supports concatenating fields for the Zapier id.
    *
    * @param resultItem
    * @param options
    */
   createZapId(resultItem) {
      // Support for IDs derived from concatenated values.
      let zapId = '';
      this.zidFields.forEach((item, index) => {
         zapId += resultItem[this.zidFields[index]];
      });

      return zapId;
   }

   /**
    * getDataOffset
    *
    * @param responseToParse
    * @returns {*}
    */
   getDataOffset(responseToParse) {
      if (this.dataOffset.length) {
         this.dataOffset.forEach(offset => {
            responseToParse = responseToParse[offset];
         });
      }
      return responseToParse;
   }

   /**
    *
    * @returns {Array}
    */
   getGetParams() {
      let myParams = [];
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
      this.zidFields     = [DEFAULT_ZID];
      this.limit         = DEFAULT_RESULTS_LIMIT;
      this.order         = DEFAULT_ORDER;
      this.timeout       = DEFAULT_TIMEOUT;
      this.dataOffset    = [];
      this.getParams     = [];
   }
}

module.exports = ListOptions;