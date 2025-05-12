"use strict";

const { BRAND } = require("@src/constants");
const API_URI = require("./API_URI");
const WEBSITE_DOMAIN = require("./WEBSITE_DOMAIN");

const MAILGUN_DOMAIN = `mg.${ WEBSITE_DOMAIN }`;

const MAILGUN_LOGO_URI = `${ API_URI }/static/logo.png`;
const MAILGUN_EMAIL_ICON_URI = `${ API_URI }/static/email_icon.png`;

const MAILGUN_EMAIL = {
  INFO: `info@${ WEBSITE_DOMAIN }`,
  NO_REPLY: `no-reply@${ WEBSITE_DOMAIN }`,
};

const MAILGUN_FROM = {
  NO_REPLY: `${ BRAND } | no-reply <${ MAILGUN_EMAIL.NO_REPLY }>`,
};

module.exports = {
  MAILGUN_DOMAIN,
  MAILGUN_LOGO_URI,
  MAILGUN_EMAIL_ICON_URI,
  MAILGUN_EMAIL,
  MAILGUN_FROM,
};
