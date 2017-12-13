/**
 * httpCodes defines status codes we care about.
 *
 * @type {{success: number, unauthorized: number, internalError: number}}
 */
const httpCodes = {
   success: 200,
   created: 201,
   unauthorized: 401,
   internalError: 500
};

module.exports = httpCodes;
