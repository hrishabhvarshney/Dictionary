const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById('result');
const sound = document.getElementById('sound');
const btn = document.getElementById('search-btn');
const inputWord = document.getElementById('input-word');

btn.addEventListener('click', searchWord);
inputWord.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchWord();
    }
});

async function searchWord() {
    const inWord = inputWord.value.trim();

    try {
        const response = await fetch(`${apiUrl}${inWord}`);
        const data = await response.json();

        if (data.length === 0) {
            result.innerHTML = `<h3 class="error">Couldn't find the word</h3>`;
            sound.removeAttribute('src');
            return;
        }

        // Clear previous results
        result.innerHTML = '';

        // Loop through each entry in the API response
        data.forEach(entry => {
            // Create elements to display word and phonetic pronunciation
            const wordDiv = document.createElement('div');
            wordDiv.classList.add('word');
            wordDiv.innerHTML = `
                <h3>${entry.word}</h3>
            `;
            // Add phonetic pronunciation if available
            if (entry.phonetics && entry.phonetics.length > 0) {
                wordDiv.innerHTML += `
                    <p class="phonetic">Pronunciation: ${entry.phonetics[0].text}</p>
                    <button onclick="playSound('${entry.phonetics[0].audio}')">
                        <i class="fas fa-volume-up"></i>
                    </button>
                `;
            }
            // Add origin if available
            if (entry.origin) {
                wordDiv.innerHTML += `<p>Origin: ${entry.origin}</p>`;
            }
            // Loop through meanings and definitions
            entry.meanings.forEach(meaning => {
                wordDiv.innerHTML += `
                    <div class="detail">
                        <p>${meaning.partOfSpeech}</p>
                        <p class="word-meaning">${meaning.definitions[0].definition}</p>
                        <p class="word-example">${meaning.definitions[0].example}</p>
                    </div>
                `;
            });
            // Append wordDiv to result
            result.appendChild(wordDiv);
        });
    } catch (error) {
        result.innerHTML = `<h3 class="error">An Error Occurred</h3>`;
        sound.removeAttribute("src");
    }
}

function playSound(audioUrl) {
    sound.src = audioUrl;
    sound.play();
}
