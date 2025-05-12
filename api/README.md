# BtcEx API

[![Test][test_badge]][test_url]
[![codecov][codecov_badge]][codecov_url]

BtcEx API

## Table of Contents

- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Generate keys](#generate-keys)
  - [API](#api)
  - [Docker](#docker)
- [Documents](#documents)
- [Database](#database)
  - [Migrations](#migrations)
  - [Seeds](#seeds)
- [Lint](#lint)
- [Tests](#tests)
- [Config](#config)
  - [S3](#s3-config)
- [Directory Layout](#directory-layout)

## Getting Started

### Requirements

- MongoDB (`^4.4.5`) - Persistent Database
- S3 (or Minio/Digitalocean Spaces) - Object storage

### Generate keys

```shell
cd keys && ssh-keygen -t rsa -b 4096 -m PEM -f jwks-rsa.key
```

### API

Install dependencies

```shell
npm i
```

Start the API

```shell
npm start
```

### Docker

Start the services

```shell
docker-compose up -d --build --remove-orphans
```

Stop the services

```shell
docker-compose down
```
## Swagger Document
Uncomment swagger.js which is in root directory, follow the steps written on that file to know about the routes of API Repo
```shell
node swagger.js
```

## Documents

Run documents locally (after running the command open the url shared in terminal)

```shell
npm run docs
```

Generate swagger config for static documents

```shell
npm run docs:swagger
```

## Database

### Migrations

Create new migration

```shell
npm run migration:create createUsersCollection
```

> Change the `createUsersCollection` to the correct name

Run migrations

```shell
npm run migrate
```

Rollback previous migrations

```shell
npm run migrate:rollback
```

```shell
npm run migrate:rollback -- --step 2
```

> `--step` option is `1` by default, `0` means rollback all migrations

Refresh previous migrations

```shell
npm run migrate:refresh
```

```shell
npm run migrate:refresh -- --step 2
```

> `--step` option is `0` by default, same functionality as `npm run migrate:rollback`

### Seeds

Create new seeder

```shell
npm run seeder:create users
```

> Change the `users` to the correct name

Run seeders

```shell
npm run seed
```

## Lint

```shell
npm run lint
```

Fix linter errors

```shell
npm run lint:fix
```

## Tests

```shell
npm test
```

Code coverage

```shell
npm run test:coverage
```

Run in CI

```shell
npm run test:ci
```

## Config

Set the environment variables (config)

```shell
cp .env.example .env
```

| Variable | Type | Description |
|:--------:|:----:|:-----------:|
| `NODE_ENV` | `development`,`production`,`test` | Node.js environment |
| `RELEASE_ENV` | `production`,`staging` | API release environment |
| `API_URI` | valid uri | API address |
| `API_PORT` | non-negative integer | Express API port |
| `AUTH_URI` | valid uri | AUTH (OIDC) address |
| `STORAGE_URI` | valid uri | S3 storage public address |
| `WEBSITE_DOMAIN` | `btcexnet.xyz`, `btcex.pro` | Website domain |
| `MONGODB_URI` | valid MongoDB uri | MongoDB URI |
| `MONGODB_DATABASE` | MongoDB database name | MongoDB database name (Used only in docker-compose) |
| `SENTRY_DSN` | valid url | Sentry project DSN |
| `VONAGE_APPLICATION_ID` | string | Vonage application id |
| `VONAGE_API_KEY` | string | Vonage API key |
| `VONAGE_API_SECRET` | string | Vonage API secret |
| `MAILGUN_PRIVATE_API_KEY` | string | Mailgun Private API key |
| `MAILGUN_PUBLIC_VALIDATION_KEY` | string | Mailgun Public validation key |
| `MAILGUN_WEBHOOK_SIGNING_KEY` | string | Mailgun HTTP webhook signing key |

### OAUTH2.0 Clients Config

#### Website Client Config

| Variable | Type | Description |
|:--------:|:----:|:-----------:|
| `WEBSITE_CLIENT_ID` | uuid/v4 | OAuth2.0 website client id |
| `WEBSITE_CLIENT_SECRET` | random string | OAuth2.0 website client secret |
| `WEBSITE_CLIENT_REDIRECT_URI` | valid uri | OAuth2.0 website client redirect uri |
| `WEB_SOCKET_SERVER_PORT` | valid port number | WebSocket API port |

#### Admin Client Config

| Variable | Type | Description |
|:--------:|:----:|:-----------:|
| `ADMIN_CLIENT_ID` | uuid/v4 | OAuth2.0 admin client id |
| `ADMIN_CLIENT_SECRET` | random string | OAuth2.0 admin client secret |
| `ADMIN_CLIENT_REDIRECT_URI` | valid uri | OAuth2.0 admin client redirect uri |

### S3 Config

| Variable | Type | Description |
|:--------:|:----:|:-----------:|
| `S3_ENDPOINT` | valid S3 endpoint | S3 endpoint |
| `S3_BUCKET` | string | S3 bucket |
| `S3_REGION` | string | S3 region |
| `S3_ACCESS_KEY_ID` | string | S3 access key |
| `S3_SECRET_ACCESS_KEY` | string | S3 secret key |

### Bitgo Configs

| Variable | Type | Description |
|:--------:|:----:|:-----------:|
| `BITGO_ACCESS_TOKEN` | Valid Bitgo access token ( Contains numbers and alphabetical characters) | Bitgo wallet access token |
| `BITGO_API_URI` | valid http/https url | Bitgo api base uri |

## Directory Layout

```
.
├── __tests__        # Unit tests
│   ├── internals    # Unit test internal utilities
│   ├── lib          # `@src/lib` unit test
│   ├── routes       # `@src/routes` unit test
│   └── utils        # `@src/utils` unit test
├── database         # Database scripts
│   ├── migrations   # Database migrations
│   └── seeds        # Database seeders
├── docs             # Static documents
├── keys             # Private/Public keys (currently only used for OAuth2.0)
├── public           # Public server files
├── scripts          # Internal scripts
├── src              # Source files
│   ├── config       # Internal config
│   ├── constants    # Internal constants
│   ├── controllers  # Express controllers
│   ├── errors       # Error classes
│   ├── lib          # Internal/3rd party libraries/services
│   ├── middlewares  # Express middlewares
│   ├── models       # Database models
│   ├── routes       # Express routes
│   └── utils        # Internal utilities
└── views            # EJS views
    └── screens      # HTML screen views
```

[test_badge]: https://github.com/btcex-pro/api/actions/workflows/test.yml/badge.svg

[test_url]: https://github.com/btcex-pro/api/actions/workflows/test.yml

[codecov_badge]: https://codecov.io/gh/btcex-pro/api/branch/main/graph/badge.svg?token=GCiXFTed70

[codecov_url]: https://codecov.io/gh/btcex-pro/api
