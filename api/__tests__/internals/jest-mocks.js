"use strict";

/* eslint-env jest */

jest.mock("@src/config");

jest.mock("@src/lib/Bitgo");
jest.mock("@src/lib/OpenIDConnect/jwks");
jest.mock("@src/lib/Mailgun");
jest.mock("@src/lib/S3");
jest.mock("@src/lib/Vonage");

jest.mock("@src/queue/trade");

jest.mock("@src/services/settings/SETTINGS");
