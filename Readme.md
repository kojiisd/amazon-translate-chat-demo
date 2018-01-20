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
AWS.config.region = 'REGION';
tlsEp = new AWS.Endpoint('TRANSLATE_ENDPOINT');
iotEp = 'IOT_ENDPOINT';
```

## AWS IoT setting
For sending and receiving data, this program is using AWS IoT service for WebSocket connection. You need to parpare AWS IoT conifguration.


# How to use
Just open `chat-demo.html`.

1. Input your name
2. Select "Source Language"
3. Select "Traget Language"
4. Press "Start Chat" button

When connecting to AWS IoT, you can start to use this chat.
Any message you can input Message part and press "Send Message" button.

After that at bottom of the page, you can see your messages and your receiving messages.
Your sending message will not be translated but your receiving message sent from not you will be translated with your language setting.