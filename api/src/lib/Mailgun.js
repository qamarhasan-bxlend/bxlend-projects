"use strict";
// Importing Libraries
var Mailgun = require("mailgun.js");
var formData = require("form-data");
const asyncRetry = require('async-retry'); 
const {
  MAILGUN_PRIVATE_API_KEY,
  MAILGUN_FROM,
  WEBSITE_URI,
  API_URI,
  MAILGUN_DOMAIN,
  MAILGUN_SENDING_DOMAIN
} = require("@src/config");
  
const {
  MAILGUN_SUBJECT,
  MAILGUN_TEMPLATE,
  BRAND,
} = require("@src/constants");
const catchError = require("../utils/catchError");
// ------------------------- Library -------------------------

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: "api", key: MAILGUN_PRIVATE_API_KEY });

/**
 * Send email to user's email address, notifying them of a successful transaction
 * 
 * @param {import("mongoose").Document} user
 * @param {import("mongoose").Document} transaction
 * @returns {Promise<string>}
 */


// Function to send mail 
async function sendOrderCreationEmail(user, transaction) {
  const variables = {
    Username: user.name.first,
    Transaction_id: transaction.id,
    Quantity: transaction.quantity,
    Currency_code: transaction.currency_code,
    Fee: transaction.fee,
    Direction: transaction.direction,
    Created_at: transaction.created_at,
    Status: transaction.status,
    subject_status: transaction.status == "FULFILLED" ? "successful" : transaction.status.toLower()
  };

  const data = {
    from: MAILGUN_FROM.NO_REPLY,
    to: user.email,
    subject: MAILGUN_SUBJECT.ORDER_CONFIRMATION,
    template: MAILGUN_TEMPLATE.ORDER_CREATION,
    "h:X-Mailgun-Variables": JSON.stringify(variables),
  };
  const id = await sendMail(data)
  return id
}
async function sendMail(data) {
  const maxRetries = 3;
  let retryCount = 0;
  while (retryCount < maxRetries) {
    try {
      const res = await client.messages.create(MAILGUN_SENDING_DOMAIN, data);
      return res.id;
    } catch (err) {
      console.error(err);
      retryCount++;
    }
  }
  throw new Error("Max retries reached, email delivery failed.");
}

async function sendTransactionConfirmationEmail(user, transaction) {
  const variables = {
    Username: user.name.first,
    Transaction_id: transaction.id,
    Quantity: transaction.amount,
    Currency_code: transaction.symbol,
    Fee: transaction.fee,
    Direction: transaction.direction,
    Created_at: transaction.created_at,
    Status: transaction.status,
    Type: transaction.type,
    subject_status: transaction.status == "SUCCESS" ? "confirmed" : "unconfirmed"
  };

  const data = {
    from: MAILGUN_FROM.NO_REPLY,
    to: user.email,
    subject: `${variables.Direction} ${variables.Type} ${MAILGUN_SUBJECT.TRANSACTION_CONFIRMATION}`,
    template: MAILGUN_TEMPLATE.TRANSACTION_CONFIRMATION,
    "h:X-Mailgun-Variables": JSON.stringify(variables),
  };
  const id = await sendMail(data)
  return id
}


// /**
//  * Ensures the authenticity of event request
//  *
//  * @param {number} timestamp
//  * @param {string} token
//  * @param {string} signature
//  * @returns {boolean}
//  */
// function validateWebhook(timestamp, token, signature) {
//   return mailgun.validateWebhook(timestamp, token, signature);
// }

/**
 * Send email verification code to provided user's email address
 *
 * @param {import("mongoose").Document} user
 * @param {import("mongoose").Document} verification
 * @returns {Promise<string>}
 */
async function sendVerificationEmail(user, verification) {
  const variables = {
    verification_url: `${API_URI}/v1/verifications/email/verify/${verification.token}`,
    brand: BRAND,
    website_uri: WEBSITE_URI,
    year: new Date().getFullYear().toString(),
  };

  const data = {
    from: MAILGUN_FROM.NO_REPLY,
    to: user.email,
    subject: MAILGUN_SUBJECT.EMAIL_VERIFICATION,
    template: MAILGUN_TEMPLATE.EMAIL_VERIFICATION,
    "h:X-Mailgun-Variables": JSON.stringify(variables),
  };
  try {
    const id = await sendMail(data)
    return id
  }
  catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

async function sendWaitingListUsersVerificationEmail(email, token) {

  const variables = {
    verification_url: `${API_URI}/v1/verifications/waiting-list-users/verify/${token}`,
    brand: BRAND,
    website_uri: WEBSITE_URI,
    year: new Date().getFullYear().toString(),
  };

  const data = {
    from: MAILGUN_FROM.NO_REPLY,
    to: email,
    subject: MAILGUN_SUBJECT.WAITING_LIST_USERS_CONFIRMATION,
    template: MAILGUN_TEMPLATE.WAITING_LIST_USERS_CONFIRMATION,
    "h:X-Mailgun-Variables": JSON.stringify(variables),
  };
  try {
    const id = await sendMail(data)
    return id
  }
  catch (error) {
    throw new Error(error.messages)
  }
}

async function sendPasswordResetOTP(user, OTP) {
  const variables = {
    OTP: OTP,
    brand: BRAND,
    website_uri: WEBSITE_URI,
    year: new Date().getFullYear().toString(),
 
  };

  const data = {
    from: MAILGUN_FROM.NO_REPLY,
    to: user.email,
    subject: MAILGUN_SUBJECT.PASSWORD_RESET_OTP,
    template: MAILGUN_TEMPLATE.PASSWORD_RESET_OTP,
    "h:X-Mailgun-Variables": JSON.stringify(variables),
  };
  const id = await sendMail(data)
  return id

}

async function sendPasswordResetConfirmation(user, OTP) {
  const variables = {
    userName: user.name.first,
  };

  const data = {
    from: MAILGUN_FROM.NO_REPLY,
    to: user.email,
    subject: MAILGUN_SUBJECT.PASSWORD_RESET_CONFIRMATION,
    template: MAILGUN_TEMPLATE.PASSWORD_RESET_CONFIRMATION,
    "h:X-Mailgun-Variables": JSON.stringify(variables),
  };
  const id = await sendMail(data)
  return id
}



/**
 * Ensures the authenticity of event request
 *
 * @param {number} timestamp
 * @param {string} token
 * @param {string} signature
 * @returns {boolean}
 */
function validateWebhook(timestamp, token, signature) {
  return mailgun.validateWebhook(timestamp, token, signature);
}
// ------------------------- Exports -------------------------

module.exports = {
  sendOrderCreationEmail,
  sendVerificationEmail,
  sendTransactionConfirmationEmail,
  validateWebhook,
  sendPasswordResetOTP,
  sendPasswordResetConfirmation,
  sendWaitingListUsersVerificationEmail,
};


// ------------------------ OLD CODE --------------------------

// "use strict";

// /* istanbul ignore file */

// const {
//   MAILGUN_PRIVATE_API_KEY,
//   MAILGUN_PUBLIC_VALIDATION_KEY,
//   API_URI,
//   NODE_ENV,
//   WEBSITE_URI,
//   MAILGUN_DOMAIN,
//   MAILGUN_FROM,
// } = require("@src/config");
// const {
//   MAILGUN_SUBJECT,
//   MAILGUN_TEMPLATE,
//   BRAND,
//   ENV,
// } = require("@src/constants");
// const Mailgun = require("mailgun-js");

// // ------------------------- Library -------------------------

// const mailgun = Mailgun({
//   domain: MAILGUN_DOMAIN,
//   apiKey: MAILGUN_PRIVATE_API_KEY,
//   publicApiKey: MAILGUN_PUBLIC_VALIDATION_KEY,
//   mute: NODE_ENV === ENV.PRODUCTION,
// });

// /**
//  * Send email verification code to provided user's email address
//  *
//  * @param {import("mongoose").Document} user
//  * @param {import("mongoose").Document} verification
//  * @returns {Promise<string>}
//  */
// async function sendVerificationEmail(user, verification) {
//   const variables = {
//     verification_url: `${ API_URI }/v1/verifications/email/verify/${ verification.token }`,
//     brand: BRAND,
//     website_uri: WEBSITE_URI,
//     year: new Date().getFullYear().toString(),
//   };

//   const result = await mailgun.messages().send({
//     from: MAILGUN_FROM.NO_REPLY,
//     to: user.email,
//     subject: MAILGUN_SUBJECT.EMAIL_VERIFICATION,
//     template: MAILGUN_TEMPLATE.EMAIL_VERIFICATION,
//     "h:X-Mailgun-Variables": JSON.stringify(variables),
//   });

//   return result.id;
// }

// /**
//  * Ensures the authenticity of event request
//  *
//  * @param {number} timestamp
//  * @param {string} token
//  * @param {string} signature
//  * @returns {boolean}
//  */
// function validateWebhook(timestamp, token, signature) {
//   return mailgun.validateWebhook(timestamp, token, signature);
// }

// // ------------------------- Exports -------------------------

// module.exports = {
//   sendVerificationEmail,
//   validateWebhook,
// };
