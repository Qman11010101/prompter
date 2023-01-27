var wordCount = 0;
const phWord = "word_";
const promptGenres = ["quality", "scene", "body", "cloth", "misc"];
var promptGlobal = [];
var promptFirstWord = "";

function readFromImage() {

}

function update() {
    const output = document.getElementById("prompt_output");
    const words = document.getElementsByClassName("word");
    let string = "";
    for (let i = 0; i < words.length; i++) {
        string += words[i].innerText;
        if (i - 1 !== words.length) string += ", ";
    }
    output.innerText = string;
}

function addWord(objID, textobj) {
    let word;
    if (textobj === null) {
        word = document.getElementById(objID + "_input").value.replaceAll("{", "[")
                                                              .replaceAll("}", "]")
                                                              .replaceAll("(", "{")
                                                              .replaceAll(")", "}");
    } else {
        word = textobj;
    }
    if (word === "") return;
    const wordList = document.getElementById(objID);
    const wordBlock = wordList.appendChild(document.createElement("div"));
    wordBlock.id = phWord + String(wordCount);
    wordBlock.innerHTML =
        `<button class="inner" onclick="wordIncrement('${phWord + String(wordCount)}')">＋</button>` +
        `<button class="inner" onclick="wordDecrement('${phWord + String(wordCount)}')">－</button>` +
        `<span class="word">${word}</span>`;
    document.getElementById(objID + "_input").value = "";
    wordCount++;
    update();
}

function analyzePrompt() {
    document.getElementById("classificationArea").style.display = "none";
    const errtxt = document.getElementById("errtxt");
    errtxt.innerText = "";

    let prompt = document.getElementById("prompt_import_input").value.trim();
    if (prompt === "") return;
    if (prompt.endsWith(",")) {prompt = prompt.slice(0, prompt.length - 1)};
    console.log(prompt)
    let promptArray = prompt.split(",");
    if (promptArray.length === 0) return;
    for (let i = 0; i < promptArray.length; i++) {
        if (promptArray[i].match(/[^\x01-\x7E]/)) {
            errtxt.innerText = "Error: ASCII範囲外の文字が検出されました。/ Invalid letter detected (Out of ASCII.)";
            return
        }
        promptArray[i] = promptArray[i].replaceAll("{", "[")
                                       .replaceAll("}", "]")
                                       .replaceAll("(", "{")
                                       .replaceAll(")", "}");
        let left = (promptArray[i].match(/{/g) || []).length;
        let right = (promptArray[i].match(/}/g) || []).length;
        if (left > right) {
            for (let j = 0; j < (left - right); j++) {
                promptArray[i] += "}";
            }
        } else if (left < right) {
            let appendBracket = "";
            for (let j = 0; j < (left - right); j++) {
                appendBracket += "{";
            }
            promptArray[i] = appendBracket + promptArray[i];
        }
    }

    document.getElementById("checktxt").innerText = `単語 「${promptArray[0].trim()}」 を分類してください。/ Classify the word "${promptArray[0].trim()}".`;
    document.getElementById("classificationArea").style.display = "block";

    promptFirstWord = promptArray.shift();
    promptGlobal = promptArray;
}

function classify(genre) {
    if (promptFirstWord !== "") {
        // 最初
        addWord(genre, promptFirstWord.trim());
        promptFirstWord = "";
    } else {
        addWord(genre, promptGlobal.shift().trim());
    }
    if (promptGlobal.length === 0) {
        document.getElementById("classificationArea").style.display = "none";
        document.getElementById("prompt_import_input").value = "";
        promptGlobal = [];
        return;
    }
    const word = promptGlobal[0];
    document.getElementById("checktxt").innerText = `単語 「${word.trim()}」 を分類してください。/ Classify the word "${word.trim()}".`;
}

function wordIncrement(objID) {
    const wordBlock = document.getElementById(objID).getElementsByClassName("word")[0];
    wordBlock.innerText = `{${wordBlock.innerText}}`;
    update();
}

function wordDecrement(objID) {
    const wordBlock = document.getElementById(objID).getElementsByClassName("word")[0];
    if ((wordBlock.innerText.match(/\{/g) || []).length === 0) {
        document.getElementById(objID).remove();
    } else {
        wordBlock.innerText = wordBlock.innerText.replace("{", "").replace("}", "");
    }
    update();
}

function copyOutput(objID) {
    const output = document.getElementById(objID);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(output.value);
        document.getElementById(objID + "");
    }
}

function convertPrompt(prompt, action) {
    if (action === "n2b") {
        return prompt.replaceAll("{", "[").replaceAll("}", "]").replaceAll("(", "{").replaceAll(")", "}");
    } else if (action === "b2n") {
        return prompt.replaceAll("{", "(").replaceAll("}", ")").replaceAll("[", "{").replaceAll("]", "}");
    }
}

function convertPromptController(action) {
    const normal = document.getElementById("prompt_normal");
    const brace  = document.getElementById("prompt_brace");
    if (action === "n2b") {
        // Normal to Brace
        brace.value = convertPrompt(normal.value, action);
    } else if (action === "b2n") {
        // Brace to Normal
        normal.value = convertPrompt(brace.value, action);
    }
}

// window.addEventListener('DOMContentLoaded', () => {
//     document.getElementById("prompt_normal").addEventListener("input", () => {
//         document.getElementById("prompt_brace").innerText = document.getElementById("prompt_normal").value.replaceAll("(", "{").replaceAll(")", "}");
//     });
//     promptGenres.forEach(g => { document.getElementById(`${g}_input`).addEventListener("keydown", e => { if (e.code === "Enter") { addWord(g) } }) });
// });
