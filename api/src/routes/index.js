"use strict";

const { NODE_ENV } = require("@src/config");
const { ENV, ERROR, STATUS_CODE } = require("@src/constants");
const { get } = require("@src/controllers");
const { HTTPError, NotFound } = require("@src/errors");
const { OpenIDConnect } = require("@src/lib");
const Sentry = require("@sentry/node");
const cors = require("cors");
const { Router, ...express } = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const authRoutes = require("./auth");
const v1Routes = require("./v1");
const waitingList = require('./waiting_List')
const presale = require('./presale')

// const bitstampRoutes = require("./bitstamp")
// const swaggerUi = require('swagger-ui-express')
// const swaggerDocument = require('@root/swaggerOutput')


const router = Router();


// ------------------------- Middlewares ----------------------------

/* istanbul ignore next */
if (NODE_ENV === ENV.DEVELOPMENT)
  router.use(morgan("dev"));

/* istanbul ignore next */
if (NODE_ENV === ENV.PRODUCTION) {
  router
    .use(Sentry.Handlers.requestHandler({
      user: ["id"],
      ip: true,
    }))
    .use(Sentry.Handlers.tracingHandler())
    .use(Sentry.Handlers.errorHandler());

}

router
  .use(cors())
  .use(helmet())
  .use(express.static(
    path.resolve(__dirname, "..", "..", "public"),
    {
      index: false,
    },
  ));

// ------------------------- Routes ---------------------------------

router.route("/")
  .get(get);

// router.route("/api-docs")
// .get(swaggerUi.setup(swaggerDocument))

router
  .use(authRoutes)
  .use(v1Routes)
  .use(waitingList)
  .use(presale)

// .use(bitstampRoutes);
  // .use('/api-docs', swaggerUi.serve);


// ------------------------- OIDC callback / catch-all -------------------------

router.use(OpenIDConnect.callback());

// ------------------------- Error Handlers -------------------------

/* istanbul ignore next */
if (NODE_ENV === ENV.PRODUCTION) {
  router.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      return !(error instanceof HTTPError);
    },
  }));
}

/**
 * Handle not found [404]
 */
router.use((req, res, next) => next(new NotFound()));

// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => {
  if (error instanceof HTTPError) return error.handle(req, res);

  res.status(STATUS_CODE.INTERNAL_SERVER_ERROR);

  /* istanbul ignore next */
  if (NODE_ENV === ENV.PRODUCTION) return res.json({ error: error.message });

  return res.json({ error: error.message });
});

// ------------------------- Exports --------------------------------

module.exports = router;
