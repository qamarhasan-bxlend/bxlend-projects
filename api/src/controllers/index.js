"use strict";


// ------------------------- Exports -------------------------

module.exports = {
  get: require("./get"),
  ...require("./interaction"),
  ...require("./params"),
  ...require("./presale"),
  ...require("./v1"),
  ...require("./webhooks"),
  ...require("./bitstamp"),
  ...require("./auth"),
  ...require("./waiting_list"),
  ws: require("./ws"),
};

// ------------------------- Swagger -------------------------

/**
 * @swagger
 *
 * definitions:
 *
 *   Meta:
 *     type: object
 *     required:
 *       - page
 *       - limit
 *       - page_count
 *       - total_count
 *     properties:
 *       page:
 *         type: integer
 *         format: int64
 *         minimum: 1
 *         example: 10
 *       limit:
 *         type: integer
 *         format: int64
 *         minimum: 0
 *         maximum: 100
 *         example: 10
 *       page_count:
 *         type: integer
 *         format: int64
 *         minimum: 1
 *         example: 10
 *       total_count:
 *         type: integer
 *         format: int64
 *         minimum: 0
 *         example: 1000
 *
 * parameters:
 *
 *   page_query:
 *     description: "Pagination skip parameter"
 *     in: query
 *     name: page
 *     schema:
 *       type: integer
 *       format: int64
 *       minimum: 1
 *       default: 1
 *       example: 10
 *
 *   limit_query:
 *     description: "Pagination limit parameter"
 *     in: query
 *     name: limit
 *     schema:
 *       type: integer
 *       format: int64
 *       minimum: 1
 *       maximum: 100
 *       default: 10
 *       example: 25
 *
 * responses:
 *
 *   302:
 *     description: "Found"
 *     headers:
 *       Location:
 *         schema:
 *           type: string
 *
 *   400:
 *     description: "Bad Request"
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - error
 *             - details
 *           properties:
 *             error:
 *               type: string
 *               example: "bad-request"
 *             details:
 *               type: object
 *
 *   401:
 *     description: "Unauthorized"
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - error
 *           properties:
 *             error:
 *               type: string
 *               example: "unauthorized"
 *
 *   403:
 *     description: "Forbidden"
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - error
 *           properties:
 *             error:
 *               type: string
 *               example: "forbidden"
 *
 *   404:
 *     description: "Not Found"
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - error
 *           properties:
 *             error:
 *               type: string
 *               example: "not-found"
 *
 *   422:
 *     description: "Unprocessable Entity"
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - error
 *             - details
 *           properties:
 *             error:
 *               type: string
 *               example: "unprocessable-entity"
 *             details:
 *               type: object
 *
 *   429:
 *     description: "Too Many Requests"
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - error
 *           properties:
 *             error:
 *               type: string
 *               example: "too-many-requests"
 *
 *   500:
 *     description: "Internal Server Error"
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - error
 *           properties:
 *             error:
 *               type: string
 *               example: "internal-server-error"
 *
 */
