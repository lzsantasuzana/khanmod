const ver = "V3.0.5";

// Configurações de atraso para as funcionalidades
const featureConfigs = {
    initialDelay: 1500,
    subsequentDelays: [150, 750, 250, 1000]
};

// Configurações das funcionalidades
window.features = {
    autoAnswer: false,
    questionSpoof: true
};

// Função para criar um delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Função para reproduzir áudio
const playAudio = url => {
    const audio = new Audio(url);
    audio.play();
};

// Função para exibir um toast (notificação)
function sendToast(text, duration = 5000) {
    alert(text); // Usando alert como substituto simples para o toast
}

// Função para encontrar e clicar em um elemento por classe
function findAndClickByClass(className) {
    const element = document.getElementsByClassName(className)[0];
    if (element) {
        element.click();
        if (element.textContent === 'Mostrar resumo') {
            sendToast("🎉 Exercício concluido!", 3000);
            playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav');
        }
    }
    return !!element;
}

// Função para modificar as questões (spoof)
function spoofQuestion() {
    const phrases = [
        "🎮💣 Games Destroyer On Top!",
        "❓ Made by @iUnknownBr.",
        "🏂 Made by Snow"
    ];

    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
        let body;
        if (input instanceof Request) body = await input.clone().text();
        else if (init && init.body) body = init.body;

        const originalResponse = await originalFetch.apply(this, arguments);
        const clonedResponse = originalResponse.clone();

        try {
            const responseBody = await clonedResponse.text();
            let responseObj = JSON.parse(responseBody);

            if (responseObj?.data?.assessmentItem?.item?.itemData) {
                let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);

                if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                    itemData.answerArea = {
                        "calculator": false,
                        "chi2Table": false,
                        "periodicTable": false,
                        "tTable": false,
                        "zTable": false
                    };

                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                    itemData.question.widgets = {
                        "radio 1": {
                            options: {
                                choices: [
                                    { content: "Resposta correta.", correct: true },
                                    { content: "Resposta Errada.", correct: false }
                                ]
                            }
                        }
                    };

                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    sendToast("🔓 Questão Bypased.", 1000);

                    return new Response(JSON.stringify(responseObj), {
                        status: originalResponse.status,
                        statusText: originalResponse.statusText,
                        headers: originalResponse.headers
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }

        return originalResponse;
    };
}

// Função para responder automaticamente às questões
function autoAnswer() {
    (async () => {
        const baseClasses = ["_s6zfc1u", "_ssxvf9l", "_4i5p5ae", "_1r8cd7xe", "_1yok8f4"];

        while (true) {
            if (window.features.autoAnswer && window.features.questionSpoof) {
                await delay(featureConfigs.initialDelay);

                for (let i = 0; i < baseClasses.length; i++) {
                    const clicked = findAndClickByClass(baseClasses[i]);
                    if (clicked && i < baseClasses.length - 1) {
                        const nextDelay = featureConfigs.subsequentDelays[i % featureConfigs.subsequentDelays.length];
                        await delay(nextDelay);
                    }
                }
            } else {
                await delay(1000);
            }
        }
    })();
}

// Verifica se o script está sendo executado no site correto
if (!/^https?:\/\/pt\.khanacademy\.org/.test(window.location.href)) {
    alert("❌ Khan Destroyer Failed to Injected!\n\nVocê precisa executar o Khan Destroyer no site do Khan Academy! (https://pt.khan
