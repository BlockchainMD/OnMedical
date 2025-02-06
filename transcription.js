const express = require("express");
const bodyParser = require("body-parser");
const speechSdk = require("microsoft-cognitiveservices-speech-sdk");

const app = express();

// Expect raw audio data from Azure Communication Services in WAV format
app.use(bodyParser.raw({ type: "audio/wav" }));

const speechConfig = speechSdk.SpeechConfig.fromSubscription("<YourSpeechKey>", "<YourServiceRegion>");

app.post("/transcribe", (req, res) => {
  const pushStream = speechSdk.AudioInputStream.createPushStream();
  pushStream.write(req.body);
  pushStream.close();

  const audioConfig = speechSdk.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new speechSdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizeOnceAsync(result => {
    res.send({ transcription: result.text });
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000 for ACS audio streams...");
});
