let currentPhraseSet = jsonPhrases; // Default to original phrases

function updatePhraseSet() {
    const selectedSet = document.getElementById('phraseSet').value;
    if (selectedSet === 'original') {
        currentPhraseSet = jsonPhrases;
    } else if (selectedSet === 'alternate') {
        currentPhraseSet = alternatePhrases;
    } else if (selectedSet === 'scriptural') {
        currentPhraseSet = scripturalPhrases;
    }
    // Clear output when switching phrase sets
    document.getElementById('output').innerHTML = '';
}

function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\"(.*?)\"/g, '"$1"')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function getPhraseForLetter(letter) {
    const upperLetter = letter.toUpperCase();
    return currentPhraseSet[upperLetter] || null;
}

function showPhrases(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const input = document.getElementById('wordInput').value.trim();
    if (input.length > 0) {
        const words = input.split(' ');
        let output = '';
        words.forEach((word, index) => {
            for (let letter of word) {
                if (letter.match(/[a-zA-Z]/)) {
                    const phraseData = getPhraseForLetter(letter);
                    if (phraseData) {
                        output += `<div class="phrase-entry">`;
                        output += `<span class="letter">${phraseData.Letter}</span>`;
                        
                        if (phraseData.Title) {
                            output += `<div class="phrase-title">${phraseData.Title}</div>`;
                        }
                        
                        if (phraseData.Reference) {
                            if (phraseData.ReferenceURL) {
                                output += `<div class="phrase-reference"><a href="${phraseData.ReferenceURL}" target="_blank">${phraseData.Reference}</a></div>`;
                            } else {
                                output += `<div class="phrase-reference">${phraseData.Reference}</div>`;
                            }
                        }
                        
                        output += `<div class="phrase-text">${formatMarkdown(phraseData.Phrase)}</div>`;
                        output += `</div>`;
                    } else {
                        output += `<div class="phrase-entry">`;
                        output += `<span class="letter">${letter.toUpperCase()}</span>`;
                        output += `<div class="phrase-text"><em>No phrase found for '${letter.toUpperCase()}'</em></div>`;
                        output += `</div>`;
                    }
                }
            }
            if (index < words.length - 1) {
                output += '<hr>';
            }
        });
        document.getElementById('output').innerHTML = output;
    } else {
        document.getElementById('output').innerHTML = '<em>Please enter a name.</em>';
    }
}

function clearInput() {
    document.getElementById('wordInput').value = ''; // Clear the input field
    document.getElementById('output').innerHTML = ''; // Clear the output area
}