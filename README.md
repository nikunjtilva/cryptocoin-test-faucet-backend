# Bitcoin/Litecoin test faucet backend with bitgo sdk and serverless architecture (AWS Lambda)

This project consists of below microservices

1. balance: This service will check existing balance in donors wallet.
2. sendcoin: This service will send request to transfer coin to other wallet.

---

### Demo

A demo version of these services are hosted on AWS - [`https://pj24x5tb2a.execute-api.us-east-1.amazonaws.com/dev/balance/{cointype}`](https://pj24x5tb2a.execute-api.us-east-1.amazonaws.com/dev/balance/tbtc)

### Requirements

- [Install the Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/)
- [Configure your AWS CLI](https://serverless.com/framework/docs/providers/aws/guide/credentials/) It is required only if you want to deploy services to AWS.

### Installation

Install the Node.js packages

``` bash
$ npm install
```

### Usage

To simulate API Gateway locally using [serverless-offline](https://github.com/dherault/serverless-offline)

``` bash
$ serverless offline start
```

Run your tests

``` bash
$ npm test
```

Deploy this project

``` bash
$ serverless deploy
```
