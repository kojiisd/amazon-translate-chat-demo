# Amazon Translate Chat Demo
Amazon Translate Chat Demo with v2.184.0 aws-sdk

# Preparation
## aws-sdk build
Full build for aws-sdk is needed.

```sh
$ git clone git://github.com/aws/aws-sdk-js
$ cd aws-sdk-js
$ npm install
$ node dist-tools/browser-builder.js all > aws-sdk-full.js
```

See https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/building-sdk-for-browsers.html

## Account information input
For access to AWS, input following parts

```js
// Credential
cred = {
  awsAccessKeyId: "ACCESS_KEY",
  awsSecretAccessKey: "SECRET_KEY"
};

// Region, Endpoint
AWS.config.region = 'YOUR REGION';
tls_ep = new AWS.Endpoint('TRANSLATE ENDPOINT');
iot_ep = 'AWS IoT ENDPOINT';
```


# How to use

