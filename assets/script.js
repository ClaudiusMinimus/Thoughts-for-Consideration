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
    } else if (selectedSet === 'topicalVirtues') {
        currentPhraseSet = topicalVirtues;
    } else if (selectedSet === 'topicalPrinciples') {
        currentPhraseSet = topicalPrinciples;
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
    
    // Get title from topical virtues
    if (topicalVirtues[upperLetter]) {
        titles.push({
            set: 'topicalVirtues',
            title: topicalVirtues[upperLetter].Title,
            data: topicalVirtues[upperLetter]
        });
    }
    
    // Get title from topical principles
    if (topicalPrinciples[upperLetter]) {
        titles.push({
            set: 'topicalPrinciples',
            title: topicalPrinciples[upperLetter].Title,
            data: topicalPrinciples[upperLetter]
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
    } else if (selectedSet === 'topicalVirtues' && topicalVirtues[upperLetter]) {
        newData = topicalVirtues[upperLetter];
    } else if (selectedSet === 'topicalPrinciples' && topicalPrinciples[upperLetter]) {
        newData = topicalPrinciples[upperLetter];
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
    const inputElem = document.getElementById('wordInput');
    const input = inputElem.value.trim();
    // Validate: only letters A-Z and a-z allowed
    if (!/^[A-Za-z\s]+$/.test(input)) {
        document.getElementById('output').innerHTML = '<em>Please enter a name using only letters A-Z and spaces.</em>';
        document.getElementById('download-section-above').style.display = 'none';
        document.getElementById('download-section-below').style.display = 'none';
        inputElem.classList.add('input-error');
        return;
    }
    // Additional validation: at least one letter
    if (!/[A-Za-z]/.test(input)) {
        document.getElementById('output').innerHTML = '<em>Please enter a name with at least one letter.</em>';
        document.getElementById('download-section-above').style.display = 'none';
        document.getElementById('download-section-below').style.display = 'none';
        inputElem.classList.add('input-error');
        return;
    }
    inputElem.classList.remove('input-error');
    const words = input.split(' ');
    let output = '';
    words.forEach((word, index) => {
        for (let letter of word) {
            if (letter.match(/[a-zA-Z]/)) {
                const phraseData = getPhraseForLetter(letter);
                if (phraseData) {
                    const allTitles = getAllTitlesForLetter(letter);
                    
                    output += `<div class=\"phrase-entry\">`;
                    output += `<span class=\"letter\">${phraseData.Letter}</span>`;
                    
                    if (phraseData.Title) {
                        output += `<div class=\"phrase-header\">`;
                        output += `<div class=\"phrase-title\">${phraseData.Title}</div>`;
                        
                        // Add dropdown if there are multiple titles available
                        if (allTitles.length > 1) {
                            output += `<select class=\"title-dropdown\" onchange=\"switchLetterPhrase('${letter}', this.value)\">`;
                            allTitles.forEach(titleInfo => {
                                const selected = titleInfo.set === currentPhraseSetName ? 'selected' : '';
                                const setLabel = titleInfo.set === 'original' ? 'Original' : 
                                               titleInfo.set === 'alternate' ? 'Christlike Living' : 
                                               titleInfo.set === 'scriptural' ? 'Gospel Principles' :
                                               titleInfo.set === 'topicalVirtues' ? 'Topical Virtues' : 'Topical Principles';
                                output += `<option value=\"${titleInfo.set}\" ${selected}>${titleInfo.title} (${setLabel})</option>`;
                            });
                            output += `</select>`;
                        }
                        
                        output += `</div>`;
                    }
                    
                    if (phraseData.Reference) {
                        if (phraseData.ReferenceURL) {
                            output += `<div class=\"phrase-reference\"><a href=\"${phraseData.ReferenceURL}\" target=\"_blank\">${phraseData.Reference}</a></div>`;
                        } else {
                            output += `<div class=\"phrase-reference\">${phraseData.Reference}</div>`;
                        }
                    }
                    
                    output += `<div class=\"phrase-text\">${formatMarkdown(phraseData.Phrase)}</div>`;
                    output += `</div>`;
                } else {
                    output += `<div class=\"phrase-entry\">`;
                    output += `<span class=\"letter\">${letter.toUpperCase()}</span>`;
                    output += `<div class=\"phrase-text\"><em>No phrase found for '${letter.toUpperCase()}'</em></div>`;
                    output += `</div>`;
                }
            }
        }
        if (index < words.length - 1) {
            output += '<hr>';
        }
    });
    document.getElementById('output').innerHTML = output;
    document.getElementById('download-section-above').style.display = '';
    document.getElementById('download-section-below').style.display = '';
}

function clearInput() {
    document.getElementById('wordInput').value = ''; // Clear the input field
    document.getElementById('output').innerHTML = ''; // Clear the output area
    document.getElementById('download-section-above').style.display = 'none';
    document.getElementById('download-section-below').style.display = 'none';
    document.getElementById('wordInput').classList.remove('input-error');
}

function downloadPhrases(format) {
    if (format === 'csv') {
        // Get the entered name and format it for filename
        const inputName = document.getElementById('wordInput').value.trim();
        const filename = inputName
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters except letters, numbers, and spaces
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/_+/g, '_') // Replace multiple underscores with single underscore
            .replace(/^_|_$/g, '') // Remove leading/trailing underscores
            || 'phrases'; // Fallback if name is empty or only special characters
        
        // Gather the current phrase set (with per-letter overrides if any)
        // We'll use the currentPhraseSet and currentPhraseSetName
        // If the user has selected any per-letter overrides, those are reflected in the DOM
        // We'll extract the currently displayed phrases from the DOM for accuracy
        const phraseEntries = document.querySelectorAll('.phrase-entry');
        const rows = [['Letter', 'Title', 'Reference', 'Phrase', 'ReferenceURL']];
        phraseEntries.forEach(entry => {
            const letter = entry.querySelector('.letter')?.textContent || '';
            const title = entry.querySelector('.phrase-title')?.textContent || '';
            const referenceLink = entry.querySelector('.phrase-reference a');
            let reference = '';
            let referenceURL = '';
            if (referenceLink) {
                reference = referenceLink.textContent;
                referenceURL = referenceLink.getAttribute('href');
            } else {
                // If not a link, get the plain text
                reference = entry.querySelector('.phrase-reference')?.textContent || '';
                referenceURL = '';
            }
            const phrase = entry.querySelector('.phrase-text')?.textContent || '';
            rows.push([letter, title, reference, phrase, referenceURL]);
        });
        // Convert to CSV
        const csvContent = rows.map(row => row.map(cell => '"' + (cell || '').replace(/"/g, '""') + '"').join(',')).join('\r\n');
        // Download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    // TXT, ODT, DOCX: not implemented yet
}