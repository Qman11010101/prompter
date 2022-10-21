var wordCount = 0;
const ph_word = "word_";

function update() {
    const output = document.getElementById("output");
    const words = document.getElementsByClassName("word");
    let string = "";
    for (let i = 0; i < words.length; i++) {
        string += words[i].innerText;
        if (i - 1 !== words.length) string += ", ";
    }
    output.innerText = string;
}

function addWord(objID) {
    const word = document.getElementById(objID + "_input").value.replaceAll("{", "").replaceAll("}", "");
    if (word === "") return;
    const wordList = document.getElementById(objID);
    const wordBlock = wordList.appendChild(document.createElement("div"));
    wordBlock.id = ph_word + String(wordCount);
    wordBlock.innerHTML =
        `<button class="inner" onclick="wordIncrement('${ph_word + String(wordCount)}')">＋</button>` +
        `<button class="inner" onclick="wordDecrement('${ph_word + String(wordCount)}')">－</button>` +
        `<span class="word">${word}</span>`;
    document.getElementById(objID + "_input").value = "";
    wordCount++;
    update();
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

function copyOutput() {
    const output = document.getElementById("output");
    if (navigator.clipboard) {
        navigator.clipboard.writeText(output.innerText);
    }
}