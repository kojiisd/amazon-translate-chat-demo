var body = {};
var srcLang = "";
var targetLang = "";

const TOPIC = "translate_chat";

$(document).ready(function () {
  $("#sendData").click(function () {
    var message = $('#message').val();

    if (body.name == "" || message == "") {
      alert("Please fill each input boxes.");
      return;
    }


    body.message = message;
    body.timestamp = new Date().toISOString();

    send(JSON.stringify(body));
  });

  $("#startChat").click(function () {
    srcLang = $('[name=srcLang]').val();
    targetLang = $('[name=targetLang]').val();

    var name = $('#name').val();

    if (name == "") {
      alert("Please input name.");
      return;
    }

    body.name = name;
    $('#startArea>button').attr('disabled', 'true');
    $('#buttonArea>button').removeAttr('disabled');

    $('#startMessage').text("Starting...");

    client.connect(connectOptions);
    client.onMessageArrived = onMessage;
    client.onConnectionLost = function (e) { console.log(e) };


  });
});

// Credential
cred = {
  awsAccessKeyId: "ACCESS_KEY",
  awsSecretAccessKey: "SECRET_KEY"
};

// Region, Endpoint
AWS.config.region = 'REGION';
tlsEp = new AWS.Endpoint('TRANSLATE_ENDPOINT');
iotEp = 'IOT_ENDPOINT';

AWS.config.credentials = new AWS.Credentials(cred.awsAccessKeyId, cred.awsSecretAccessKey);
window.translator = new AWS.Translate({endpoint: tlsEp, region: AWS.config.region});

function SigV4Utils() { }

SigV4Utils.sign = function (key, msg) {
  var hash = CryptoJS.HmacSHA256(msg, key);
  return hash.toString(CryptoJS.enc.Hex);
};

SigV4Utils.sha256 = function (msg) {
  var hash = CryptoJS.SHA256(msg);
  return hash.toString(CryptoJS.enc.Hex);
};

SigV4Utils.getSignatureKey = function (key, dateStamp, regionName, serviceName) {
  var kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
  var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
  var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
  var kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
  return kSigning;
};

function createEndpoint(regionName, awsIotEndpoint, accessKey, secretKey) {
  var time = moment.utc();
  var dateStamp = time.format('YYYYMMDD');
  var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
  var service = 'iotdevicegateway';
  var region = regionName;
  var secretKey = secretKey;
  var accessKey = accessKey;
  var algorithm = 'AWS4-HMAC-SHA256';
  var method = 'GET';
  var canonicalUri = '/mqtt';
  var host = awsIotEndpoint;

  var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
  var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
  canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
  canonicalQuerystring += '&X-Amz-Date=' + amzdate;
  canonicalQuerystring += '&X-Amz-SignedHeaders=host';

  var canonicalHeaders = 'host:' + host + '\n';
  var payloadHash = SigV4Utils.sha256('');
  var canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;

  var stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + SigV4Utils.sha256(canonicalRequest);
  var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
  var signature = SigV4Utils.sign(signingKey, stringToSign);

  canonicalQuerystring += '&X-Amz-Signature=' + signature;
  return 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
}

var endpoint = createEndpoint(
  AWS.config.region,
  iotEp, 
  cred.awsAccessKeyId,
  cred.awsSecretAccessKey);
var clientId = Math.random().toString(36).substring(7);
var client = new Paho.MQTT.Client(endpoint, clientId);
var connectOptions = {
  useSSL: true,
  timeout: 3,
  mqttVersion: 4,
  onSuccess: subscribe
};

function send(content) {
  var message = new Paho.MQTT.Message(content);
  message.destinationName = TOPIC + "/" + content.name;
  client.send(message);
  console.log("sent");
}

function subscribe() {
  client.subscribe(TOPIC + "/#");
  $('#startMessage').text("Start Chat.");
  console.log("subscribed");
}

function onMessage(message) {
  var msgJson = JSON.parse(message.payloadString);
  var addingHtml = "<tr><td>" + msgJson.name + ": </td><td>" + msgJson.message + "</td>";
  if (msgJson.name == body.name) {
    addingHtml += "<td></td><td></td></tr>"
    $("#chatArea").prepend(addingHtml);
  }
  else {
    translate(msgJson.message).then(function (result) {
      addingHtml += "<td>" + msgJson.name + ": </td><td>" + result + "</td></tr>"
      $("#chatArea").prepend(addingHtml);
    }).catch(function(error){
      alert(error);
    });
  }

}

function translate(message) {

  var params = {
    Text: message,
    SourceLanguageCode: srcLang,
    TargetLanguageCode: targetLang
  };

  var syncProc = new Promise(
    function (resolve, reject) {
      window.translator.translateText(params, function onIncomingMessageTranslate(err, data) {
        if (err) {
          reject("Error calling Translate. " + err.message + err.stack);
      }
        if (data) {
          resolve(data.TranslatedText);
        }
      });
    }
  );

  return syncProc;
}