/**
 * httpCodes defines status codes we care about.
 *
 * @type {{success: number, unauthorized: number, internalError: number}}
 */
const httpCodes = {
   success: 200,
   unauthorized: 401,
   internalError: 500
};

module.exports = httpCodes;
