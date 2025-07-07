let currentPhraseSet = jsonPhrases; // Default to original phrases
let currentPhraseSetName = 'original'; // Track current phrase set name

function updatePhraseSet() {
    const selectedSet = document.getElementById('phraseSet').value;
    currentPhraseSetName = selectedSet;
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

function getAllTitlesForLetter(letter) {
    const upperLetter = letter.toUpperCase();
    const titles = [];
    
    // Get title from original phrases
    if (jsonPhrases[upperLetter]) {
        titles.push({
            set: 'original',
            title: jsonPhrases[upperLetter].Title,
            data: jsonPhrases[upperLetter]
        });
    }
    
    // Get title from alternate phrases
    if (alternatePhrases[upperLetter]) {
        titles.push({
            set: 'alternate',
            title: alternatePhrases[upperLetter].Title,
            data: alternatePhrases[upperLetter]
        });
    }
    
    // Get title from scriptural phrases
    if (scripturalPhrases[upperLetter]) {
        titles.push({
            set: 'scriptural',
            title: scripturalPhrases[upperLetter].Title,
            data: scripturalPhrases[upperLetter]
        });
    }
    
    return titles;
}

function switchLetterPhrase(letter, selectedSet) {
    const upperLetter = letter.toUpperCase();
    let newData = null;
    
    if (selectedSet === 'original' && jsonPhrases[upperLetter]) {
        newData = jsonPhrases[upperLetter];
    } else if (selectedSet === 'alternate' && alternatePhrases[upperLetter]) {
        newData = alternatePhrases[upperLetter];
    } else if (selectedSet === 'scriptural' && scripturalPhrases[upperLetter]) {
        newData = scripturalPhrases[upperLetter];
    }
    
    if (newData) {
        // Find the phrase entry for this letter and update it
        const phraseEntries = document.querySelectorAll('.phrase-entry');
        phraseEntries.forEach(entry => {
            const letterSpan = entry.querySelector('.letter');
            if (letterSpan && letterSpan.textContent === upperLetter) {
                // Update title
                const titleDiv = entry.querySelector('.phrase-title');
                if (titleDiv) {
                    titleDiv.textContent = newData.Title;
                }
                
                // Update reference
                const referenceDiv = entry.querySelector('.phrase-reference');
                if (referenceDiv) {
                    if (newData.ReferenceURL) {
                        referenceDiv.innerHTML = `<a href="${newData.ReferenceURL}" target="_blank">${newData.Reference}</a>`;
                    } else {
                        referenceDiv.textContent = newData.Reference;
                    }
                }
                
                // Update phrase text
                const phraseDiv = entry.querySelector('.phrase-text');
                if (phraseDiv) {
                    phraseDiv.innerHTML = formatMarkdown(newData.Phrase);
                }
                
                // Update the dropdown to reflect the new selection
                const dropdown = entry.querySelector('.title-dropdown');
                if (dropdown) {
                    dropdown.value = selectedSet;
                }
            }
        });
    }
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
                        const allTitles = getAllTitlesForLetter(letter);
                        
                        output += `<div class="phrase-entry">`;
                        output += `<span class="letter">${phraseData.Letter}</span>`;
                        
                        if (phraseData.Title) {
                            output += `<div class="phrase-header">`;
                            output += `<div class="phrase-title">${phraseData.Title}</div>`;
                            
                            // Add dropdown if there are multiple titles available
                            if (allTitles.length > 1) {
                                output += `<select class="title-dropdown" onchange="switchLetterPhrase('${letter}', this.value)">`;
                                allTitles.forEach(titleInfo => {
                                    const selected = titleInfo.set === currentPhraseSetName ? 'selected' : '';
                                    const setLabel = titleInfo.set === 'original' ? 'Original' : 
                                                   titleInfo.set === 'alternate' ? 'Alternate' : 'Scriptural';
                                    output += `<option value="${titleInfo.set}" ${selected}>${titleInfo.title} (${setLabel})</option>`;
                                });
                                output += `</select>`;
                            }
                            
                            output += `</div>`;
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