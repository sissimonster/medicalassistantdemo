export async function SpeechToTextFromMic() {
    var subscriptionKey = "bc18941081ac479c90e9203ce9a3422e", serviceRegion = "eastus";
    var SpeechSDK;
    var playbutton;
    var resultText;
    var phraseDiv;
    var resultadoDiv;
    var recognizer;

    playbutton = document.getElementById("playbutton");
    phraseDiv = document.getElementById("txtPrompt");
    resultadoDiv = document.getElementById("txtRespuestaPaciente");    

    if (!!window.SpeechSDK) {
        SpeechSDK = window.SpeechSDK;
        playbutton.disabled = false;

    }

    window.console.log('CLIC!!!');
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

    speechConfig.speechRecognitionLanguage = "zh-Hans";
    
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    phraseDiv.value = "Escuchando...";
    playbutton.disabled = true;
    
    recognizer.recognizeOnceAsync(
        function (result) {
            playbutton.disabled = false;
            if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                let translation = result.text;
                window.console.log(translation);
                phraseDiv.value = translation;
                resultText = translation;
            }
            DotNet.invokeMethodAsync('BlazorWAQnAOpenAI', 'ReturnPromptAsync', resultText)
                .then(data => {
                    console.log(data);
                    resultadoDiv.value = data;
                });
            recognizer.close();
            recognizer = undefined;
        },
        function (err) {
            playbutton.disabled = false;
            phraseDiv.value = err;
            window.console.log(err);

            recognizer.close();
            recognizer = undefined;
        });

    return resultText;
}
