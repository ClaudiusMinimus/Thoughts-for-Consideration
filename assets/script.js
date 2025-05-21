function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\"(.*?)\"/g, '"$1"')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function getPhraseForLetter(letter) {
    const upperLetter = letter.toUpperCase();
    return jsonPhrases[upperLetter] || `No phrase found for '${upperLetter}'`;
}
/* 
function showPhrases() {
    const input = document.getElementById('wordInput').value.trim();
    if (input.length > 0) {
        const words = input.split(' ');
        let output = '';
        words.forEach((word, index) => {
            for (let letter of word) {
                if (letter.match(/[a-zA-Z]/)) {
                    const upperLetter = letter.toUpperCase();
                    const phrase = getPhraseForLetter(letter);
                    output += `<span class="letter">${upperLetter}</span> ${formatMarkdown(phrase)}<br><br>`;
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
} */
    function showPhrases(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const input = document.getElementById('wordInput').value.trim();
        if (input.length > 0) {
            const words = input.split(' ');
            let output = '';
            words.forEach((word, index) => {
                for (let letter of word) {
                    if (letter.match(/[a-zA-Z]/)) {
                        const upperLetter = letter.toUpperCase();
                        const phrase = getPhraseForLetter(letter);
                        output += `<span class="letter">${upperLetter}</span> ${formatMarkdown(phrase)}<br><br>`;
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