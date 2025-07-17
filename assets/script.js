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

function switchLetterPhrase(letter, selectedSet, index) {
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
        // Find the phrase entry for this index and update it
        const entry = document.querySelector(`.phrase-entry[data-index='${index}']`);
        if (entry) {
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
            // Update phrase textarea value
            const phraseTextarea = entry.querySelector('.phrase-edit');
            if (phraseTextarea) {
                phraseTextarea.value = newData.Phrase;
                autoResizeTextarea(phraseTextarea);
                initPhraseHistory(index, newData.Phrase);
                updateUndoRedoButtons(index);
            }
            // Update the dropdown to reflect the new selection
            const dropdown = entry.querySelector('.title-dropdown');
            if (dropdown) {
                dropdown.value = selectedSet;
            }
            // Disable the reset button after switching
            const resetBtn = document.getElementById(`reset-btn-${index}`);
            if (resetBtn) resetBtn.disabled = true;
        }
    }
}

function resetPhrase(letter, index) {
    const upperLetter = letter.toUpperCase();
    let phraseData = getPhraseForLetter(letter);
    // If the dropdown was changed, get the selected set for this entry
    const entry = document.querySelector(`.phrase-entry[data-index='${index}']`);
    if (entry) {
        const dropdown = entry.querySelector('.title-dropdown');
        let set = currentPhraseSetName;
        if (dropdown) {
            set = dropdown.value;
        }
        if (set === 'original' && jsonPhrases[upperLetter]) {
            phraseData = jsonPhrases[upperLetter];
        } else if (set === 'alternate' && alternatePhrases[upperLetter]) {
            phraseData = alternatePhrases[upperLetter];
        } else if (set === 'scriptural' && scripturalPhrases[upperLetter]) {
            phraseData = scripturalPhrases[upperLetter];
        } else if (set === 'topicalVirtues' && topicalVirtues[upperLetter]) {
            phraseData = topicalVirtues[upperLetter];
        } else if (set === 'topicalPrinciples' && topicalPrinciples[upperLetter]) {
            phraseData = topicalPrinciples[upperLetter];
        }
        const textarea = entry.querySelector('.phrase-edit');
        if (textarea && phraseData) {
            textarea.value = phraseData.Phrase;
            autoResizeTextarea(textarea);
            initPhraseHistory(index, phraseData.Phrase);
            updateUndoRedoButtons(index);
            const resetBtn = document.getElementById(`reset-btn-${index}`);
            if (resetBtn) resetBtn.disabled = true;
        }
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
    let phraseEntryIndex = 0;
    const loadOverrides = window._acronymLoadOverrides || [];
    words.forEach((word, index) => {
        for (let letter of word) {
            if (letter.match(/[a-zA-Z]/)) {
                const phraseData = getPhraseForLetter(letter);
                if (phraseData) {
                    const allTitles = getAllTitlesForLetter(letter);
                    const override = loadOverrides[phraseEntryIndex];
                    let selectedSet = override ? override.set : currentPhraseSetName;
                    let phraseValue = override ? override.phrase : phraseData.Phrase;
                    output += `<div class=\"phrase-entry\" data-index=\"${phraseEntryIndex}\">`;
                    output += `<div class=\"phrase-entry-content\">`;
                    output += `<span class=\"letter\">${phraseData.Letter}</span>`;
                    if (phraseData.Title) {
                        output += `<div class=\"phrase-header\">`;
                        output += `<div class=\"phrase-title\">${phraseData.Title}</div>`;
                        if (allTitles.length > 1) {
                            output += `<select class=\"title-dropdown\" data-index=\"${phraseEntryIndex}\" onchange=\"switchLetterPhrase('${letter}', this.value, ${phraseEntryIndex})\" aria-label=\"Select phrase set for letter ${phraseData.Letter}\">`;
                            allTitles.forEach(titleInfo => {
                                const selected = titleInfo.set === selectedSet ? 'selected' : '';
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
                    output += `<textarea class=\"phrase-edit\" data-index=\"${phraseEntryIndex}\" data-letter=\"${phraseData.Letter}\" rows=\"3\" style=\"width:100%;resize:vertical;\" oninput=\"checkResetButton(${phraseEntryIndex}, '${letter}');autoResizeTextarea(this);pushUndo(${phraseEntryIndex}, this.value);updateUndoRedoButtons(${phraseEntryIndex})\" aria-label=\"Phrase for letter ${phraseData.Letter}\" onkeydown=\"handleUndoRedoKey(event, ${phraseEntryIndex})\">${phraseValue.replace(/\"/g, '&quot;')}</textarea>`;
                    output += `<button type=\"button\" class=\"undo-phrase-btn\" id=\"undo-btn-${phraseEntryIndex}\" onclick=\"undoPhrase(${phraseEntryIndex})\" title=\"Undo\" disabled aria-label=\"Undo for letter ${phraseData.Letter}\">⎌</button>`;
                    output += `<button type=\"button\" class=\"redo-phrase-btn\" id=\"redo-btn-${phraseEntryIndex}\" onclick=\"redoPhrase(${phraseEntryIndex})\" title=\"Redo\" disabled aria-label=\"Redo for letter ${phraseData.Letter}\">↻</button>`;
                    output += `</div>`; // close phrase-entry-content
                    output += `<button type=\"button\" class=\"reset-phrase-btn\" id=\"reset-btn-${phraseEntryIndex}\" onmouseover=\"highlightPhraseEntry(${phraseEntryIndex}, true)\" onmouseout=\"highlightPhraseEntry(${phraseEntryIndex}, false)\" onclick=\"resetPhrase('${letter}', ${phraseEntryIndex})\" disabled aria-label=\"Reset phrase for letter ${phraseData.Letter}\">Reset</button>`;
                    output += `</div>`;
                    phraseEntryIndex++;
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
    // After rendering, initialize history and auto-resize all textareas
    setTimeout(() => {
        document.querySelectorAll('.phrase-edit').forEach((ta, i) => {
            autoResizeTextarea(ta);
            initPhraseHistory(ta.getAttribute('data-index'), ta.value);
            updateUndoRedoButtons(ta.getAttribute('data-index'));
        });
    }, 0);
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
            // Get the edited phrase from the textarea
            const phrase = entry.querySelector('.phrase-edit')?.value || '';
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
    else if (format === 'txt') {
        // Get the entered name and format it for filename
        const inputName = document.getElementById('wordInput').value.trim();
        const filename = inputName
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '')
            || 'phrases';
        // Gather the current phrase set (with per-letter overrides if any)
        const phraseEntries = document.querySelectorAll('.phrase-entry');
        let txtContent = '';
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
                reference = entry.querySelector('.phrase-reference')?.textContent || '';
                referenceURL = '';
            }
            const phrase = entry.querySelector('.phrase-edit')?.value || '';
            txtContent += `Letter: ${letter}\nTitle: ${title}\nReference: ${reference}\nPhrase: ${phrase}\nReferenceURL: ${referenceURL}\n\n`;
        });
        // Download
        const blob = new Blob([txtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    else if (format === 'odt') {
        // ODT: Minimal OpenDocument Text export (with valid structure)
        const inputName = document.getElementById('wordInput').value.trim();
        const filename = (inputName || 'phrases').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || 'phrases';
        const phraseEntries = document.querySelectorAll('.phrase-entry');
        let odtBody = '';
        phraseEntries.forEach(entry => {
            const letter = escapeXml(entry.querySelector('.letter')?.textContent || '');
            const title = escapeXml(entry.querySelector('.phrase-title')?.textContent || '');
            const referenceLink = entry.querySelector('.phrase-reference a');
            let reference = '';
            let referenceURL = '';
            if (referenceLink) {
                reference = escapeXml(referenceLink.textContent);
                referenceURL = escapeXml(referenceLink.getAttribute('href'));
            } else {
                reference = escapeXml(entry.querySelector('.phrase-reference')?.textContent || '');
                referenceURL = '';
            }
            const phrase = escapeXml(entry.querySelector('.phrase-edit')?.value || '');
            odtBody += `<text:p><text:span text:style-name="Bold">Letter:</text:span> ${letter}</text:p>`;
            odtBody += `<text:p><text:span text:style-name="Bold">Title:</text:span> ${title}</text:p>`;
            odtBody += `<text:p><text:span text:style-name="Bold">Reference:</text:span> ${reference}</text:p>`;
            odtBody += `<text:p><text:span text:style-name="Bold">Phrase:</text:span> ${phrase}</text:p>`;
            odtBody += `<text:p><text:span text:style-name="Bold">ReferenceURL:</text:span> ${referenceURL}</text:p>`;
            odtBody += `<text:p/>`;
        });
        const contentXml = `<?xml version="1.0" encoding="UTF-8"?>\n<office:document-content\n  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"\n  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"\n  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"\n  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"\n  office:version="1.2">\n  <office:automatic-styles>\n    <style:style style:name="Bold" style:family="text">\n      <style:text-properties fo:font-weight="bold" style:font-weight-asian="bold" style:font-weight-complex="bold"/>\n    </style:style>\n  </office:automatic-styles>\n  <office:body>\n    <office:text>\n      ${odtBody}\n    </office:text>\n  </office:body>\n</office:document-content>`;
        const mimetype = 'application/vnd.oasis.opendocument.text';
        const manifestXml = `<?xml version="1.0" encoding="UTF-8"?><manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"><manifest:file-entry manifest:media-type="application/vnd.oasis.opendocument.text" manifest:full-path="/"/><manifest:file-entry manifest:media-type="text/xml" manifest:full-path="content.xml"/></manifest:manifest>`;
        const zip = new JSZip();
        zip.file('mimetype', mimetype, { binary: true });
        zip.file('content.xml', contentXml);
        zip.file('META-INF/manifest.xml', manifestXml);
        zip.generateAsync({ type: 'blob', mimeType: mimetype }).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.odt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
    else if (format === 'docx') {
        // DOCX: Minimal WordprocessingML export (with valid structure and escaping)
        const inputName = document.getElementById('wordInput').value.trim();
        const filename = (inputName || 'phrases').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || 'phrases';
        const phraseEntries = document.querySelectorAll('.phrase-entry');
        let docxBody = '';
        phraseEntries.forEach(entry => {
            const letter = escapeXml(entry.querySelector('.letter')?.textContent || '');
            const title = escapeXml(entry.querySelector('.phrase-title')?.textContent || '');
            const referenceLink = entry.querySelector('.phrase-reference a');
            let reference = '';
            let referenceURL = '';
            if (referenceLink) {
                reference = escapeXml(referenceLink.textContent);
                referenceURL = escapeXml(referenceLink.getAttribute('href'));
            } else {
                reference = escapeXml(entry.querySelector('.phrase-reference')?.textContent || '');
                referenceURL = '';
            }
            const phrase = escapeXml(entry.querySelector('.phrase-edit')?.value || '');
            docxBody += `<w:p><w:r><w:t>Letter: ${letter}</w:t></w:r></w:p>`;
            docxBody += `<w:p><w:r><w:t>Title: ${title}</w:t></w:r></w:p>`;
            docxBody += `<w:p><w:r><w:t>Reference: ${reference}</w:t></w:r></w:p>`;
            docxBody += `<w:p><w:r><w:t>Phrase: ${phrase}</w:t></w:r></w:p>`;
            docxBody += `<w:p><w:r><w:t>ReferenceURL: ${referenceURL}</w:t></w:r></w:p>`;
            docxBody += `<w:p/>`;
        });
        const docxXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n<w:body>\n${docxBody}\n</w:body>\n</w:document>`;
        // Minimal [Content_Types].xml and _rels/.rels for DOCX
        const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
        const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
        const zip = new JSZip();
        zip.file('[Content_Types].xml', contentTypes);
        zip.folder('_rels').file('.rels', rels);
        zip.folder('word').file('document.xml', docxXml);
        zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
    // TXT, ODT, DOCX: not implemented yet
}

function highlightPhraseEntry(index, highlight) {
    const entry = document.querySelector(`.phrase-entry[data-index='${index}'] .phrase-entry-content`);
    if (entry) {
        if (highlight) {
            entry.classList.add('highlight-phrase-entry');
        } else {
            entry.classList.remove('highlight-phrase-entry');
        }
    }
}

function checkResetButton(index, letter) {
    const entry = document.querySelector(`.phrase-entry[data-index='${index}']`);
    if (entry) {
        const textarea = entry.querySelector('.phrase-edit');
        const dropdown = entry.querySelector('.title-dropdown');
        let set = currentPhraseSetName;
        if (dropdown) {
            set = dropdown.value;
        }
        const upperLetter = letter.toUpperCase();
        let originalPhrase = '';
        if (set === 'original' && jsonPhrases[upperLetter]) {
            originalPhrase = jsonPhrases[upperLetter].Phrase;
        } else if (set === 'alternate' && alternatePhrases[upperLetter]) {
            originalPhrase = alternatePhrases[upperLetter].Phrase;
        } else if (set === 'scriptural' && scripturalPhrases[upperLetter]) {
            originalPhrase = scripturalPhrases[upperLetter].Phrase;
        } else if (set === 'topicalVirtues' && topicalVirtues[upperLetter]) {
            originalPhrase = topicalVirtues[upperLetter].Phrase;
        } else if (set === 'topicalPrinciples' && topicalPrinciples[upperLetter]) {
            originalPhrase = topicalPrinciples[upperLetter].Phrase;
        }
        const resetBtn = document.getElementById(`reset-btn-${index}`);
        if (resetBtn && textarea) {
            if (textarea.value !== originalPhrase) {
                resetBtn.disabled = false;
            } else {
                resetBtn.disabled = true;
            }
        }
    }
}

function autoResizeTextarea(textarea) {
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
}

// Undo/Redo history for each phrase entry
const phraseHistory = new Map(); // key: index, value: {undo: [], redo: []}

function initPhraseHistory(index, initialValue) {
    phraseHistory.set(index, { undo: [], redo: [], lastValue: initialValue });
}

function pushUndo(index, value) {
    const hist = phraseHistory.get(index);
    if (hist) {
        hist.undo.push(hist.lastValue);
        hist.lastValue = value;
        hist.redo = [];
    }
}

function doUndo(index, textarea) {
    const hist = phraseHistory.get(index);
    if (hist && hist.undo.length > 0) {
        hist.redo.push(hist.lastValue);
        const prev = hist.undo.pop();
        hist.lastValue = prev;
        textarea.value = prev;
        autoResizeTextarea(textarea);
        updateUndoRedoButtons(index);
        checkResetButton(index, textarea.getAttribute('data-letter'));
    }
}

function doRedo(index, textarea) {
    const hist = phraseHistory.get(index);
    if (hist && hist.redo.length > 0) {
        hist.undo.push(hist.lastValue);
        const next = hist.redo.pop();
        hist.lastValue = next;
        textarea.value = next;
        autoResizeTextarea(textarea);
        updateUndoRedoButtons(index);
        checkResetButton(index, textarea.getAttribute('data-letter'));
    }
}

function updateUndoRedoButtons(index) {
    const undoBtn = document.getElementById(`undo-btn-${index}`);
    const redoBtn = document.getElementById(`redo-btn-${index}`);
    const hist = phraseHistory.get(index);
    if (undoBtn && hist) undoBtn.disabled = hist.undo.length === 0;
    if (redoBtn && hist) redoBtn.disabled = hist.redo.length === 0;
}

// Add undo/redo handlers
function undoPhrase(index) {
    const textarea = document.querySelector(`.phrase-edit[data-index='${index}']`);
    if (textarea) doUndo(index, textarea);
}
function redoPhrase(index) {
    const textarea = document.querySelector(`.phrase-edit[data-index='${index}']`);
    if (textarea) doRedo(index, textarea);
}
function handleUndoRedoKey(e, index) {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoPhrase(index);
    } else if (((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z')))) {
        e.preventDefault();
        redoPhrase(index);
    }
}

// Save/Load functionality
function getCurrentAcronymState() {
    const inputName = document.getElementById('wordInput').value.trim();
    const phraseEntries = document.querySelectorAll('.phrase-entry');
    const entries = [];
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
            reference = entry.querySelector('.phrase-reference')?.textContent || '';
            referenceURL = '';
        }
        const phrase = entry.querySelector('.phrase-edit')?.value || '';
        const setDropdown = entry.querySelector('.title-dropdown');
        const set = setDropdown ? setDropdown.value : currentPhraseSetName;
        entries.push({ letter, title, reference, referenceURL, phrase, set });
    });
    return {
        name: inputName,
        entries: entries
    };
}

function setAcronymState(state) {
    document.getElementById('wordInput').value = state.name || '';
    // Re-generate output with the saved name and phrase sets
    if (state.name) {
        // Temporarily store per-letter set overrides
        window._acronymLoadOverrides = state.entries;
        showPhrases({ preventDefault: () => {} });
        setTimeout(() => {
            // After rendering, set dropdowns and textareas to saved values
            const phraseEntries = document.querySelectorAll('.phrase-entry');
            phraseEntries.forEach((entry, i) => {
                const override = state.entries[i];
                if (!override) return;
                const dropdown = entry.querySelector('.title-dropdown');
                if (dropdown) dropdown.value = override.set;
                // Trigger phrase set change if needed
                if (dropdown && dropdown.value !== currentPhraseSetName) {
                    switchLetterPhrase(override.letter, override.set, i);
                }
                // Set phrase text
                const textarea = entry.querySelector('.phrase-edit');
                if (textarea) {
                    textarea.value = override.phrase;
                    autoResizeTextarea(textarea);
                    // Update undo/redo history
                    initPhraseHistory(i, override.phrase);
                    updateUndoRedoButtons(i);
                }
            });
            window._acronymLoadOverrides = undefined;
        }, 0);
    }
}

function showSaveLoadMessage(msg) {
    const el = document.getElementById('save-load-message');
    if (el) {
        el.textContent = msg;
        setTimeout(() => { el.textContent = ''; }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const state = getCurrentAcronymState();
            localStorage.setItem('acronymBuilderSaved', JSON.stringify(state));
            showSaveLoadMessage('Acronym saved!');
        });
    }
    if (loadBtn) {
        loadBtn.addEventListener('click', function() {
            const state = localStorage.getItem('acronymBuilderSaved');
            if (state) {
                setAcronymState(JSON.parse(state));
                showSaveLoadMessage('Acronym loaded!');
            } else {
                showSaveLoadMessage('No saved acronym found.');
            }
        });
    }
});

function escapeXml(str) {
    return str.replace(/[&<>"']/g, function (c) {
        switch (c) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&apos;';
        }
    });
}