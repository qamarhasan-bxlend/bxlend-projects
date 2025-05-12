"use strict";

const {
  userParam,
  showUserV1,
  updateUserV1,
  removeUserV1,
  updateUserPasswordV1,
  updateUserPhoneNumberV1,
  resendUserPhoneNumberVerificationCodeV1,
  verifyUserPhoneNumberV1,
  updateUserEmailV1,
  resendVerificationEmailV1,
  get2FA,
  post2FA,
  currencyPairParam,
  addCurrencyPairToFavouritesV1,
  listMyReferralsV1Controller,
  addMyReferralV1Controller,
} = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params ------------------------------------

router.param("user", wrapController(userParam));
router.param("currency_pair", wrapController(currencyPairParam));



// ------------------------- User --------------------------------------

router.route("/:user")
  .get(wrapController(showUserV1))
  .patch(wrapController(updateUserV1))
  .delete(wrapController(removeUserV1));

// ------------------------- Referrals --------------------------------

router.route("/:user/referral")
  .get(wrapController(listMyReferralsV1Controller));

  router.route("/add-referral")
  .post(wrapController(addMyReferralV1Controller));



// ------------------------- User Password --------------------------------

router.route("/:user/password")
  .patch(wrapController(updateUserPasswordV1));

// ------------------------- User Phone Number -------------------------

router.route("/:user/phone-number")
  .patch(wrapController(updateUserPhoneNumberV1));

router.route("/:user/phone-number/verification/resend")
  .post(wrapController(resendUserPhoneNumberVerificationCodeV1));

router.route("/:user/phone-number/verify")
  .post(wrapController(verifyUserPhoneNumberV1));

// ------------------------- User Email --------------------------------

router.route("/:user/email")
  .patch(wrapController(updateUserEmailV1));

router.route("/:user/email/verification/resend")
  .post(wrapController(resendVerificationEmailV1));


//-------------------------- User 2FA ----------------------------------

router.route("/:user/add-2fa")
  .get(wrapController(get2FA));

router.route("/:user/add-2fa")
  .post(wrapController(post2FA));

//---------------------------Add to Favorites---------------------------

router.route('/add-to-fav/:currency_pair')
  .put(wrapController(addCurrencyPairToFavouritesV1))

// ------------------------- Exports -----------------------------------

module.exports = Router().use("/users", router);
