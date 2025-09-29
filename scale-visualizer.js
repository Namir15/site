// scale-visualizer.js
const STRING_COUNT = 6;
const FRET_COUNT = 24;
const STRING_TUNINGS = ['E', 'A', 'D', 'G', 'B', 'E']; // 6ª para 1ª corda
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALE_PATTERNS = {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10],
    'pentatonic-major': [0, 2, 4, 7, 9],
    'pentatonic-minor': [0, 3, 5, 7, 10],
    'blues': [0, 3, 5, 6, 7, 10],
    'harmonic-minor': [0, 2, 3, 5, 7, 8, 11]
};

// Variáveis para margens (declaradas no escopo global)
const topMargin = 10; // Margem superior em %
const bottomMargin = 8; // Margem inferior em %
const usableHeight = 100 - topMargin - bottomMargin;

function createFretboard() {
    const fretboard = document.getElementById('fretboard');
    if (!fretboard) return;
    
    fretboard.innerHTML = '';
    
    const stringSpacing = 100 / (STRING_COUNT - 1);
    const fretWidth = 80;
    
    // Cordas (linhas horizontais) - DE BAIXO PRA CIMA COM MARGENS
    for (let i = 0; i < STRING_COUNT; i++) {
        const string = document.createElement('div');
        string.style.position = 'absolute';
        string.style.left = '0';
        // INVERTENDO com margens: i=0 fica embaixo (6ª), i=5 fica em cima (1ª)
        string.style.top = `${topMargin + (STRING_COUNT - 1 - i) * (usableHeight / (STRING_COUNT - 1))}%`;
        string.style.width = '100%';
        string.style.height = i === 0 || i === STRING_COUNT - 1 ? '3px' : '2px';
        string.style.background = i === 0 || i === STRING_COUNT - 1 ? '#666' : '#ddd';
        string.style.zIndex = '1';
        fretboard.appendChild(string);
    }
    
    // Trastes (linhas verticais)
    for (let i = 0; i <= FRET_COUNT; i++) {
        const fret = document.createElement('div');
        fret.style.position = 'absolute';
        fret.style.left = `${i * fretWidth}px`;
        fret.style.top = '0';
        fret.style.width = i === 0 ? '5px' : '2px';
        fret.style.height = '100%';
        fret.style.background = i === 0 ? '#333' : '#666';
        fret.style.zIndex = '1';
        fretboard.appendChild(fret);
        
        // Número do traste
        if (i > 0) {
            const fretNumber = document.createElement('div');
            fretNumber.className = 'fret-number';
            fretNumber.style.left = `${(i - 0.5) * fretWidth}px`;
            fretNumber.textContent = i;
            fretboard.appendChild(fretNumber);
        }
    }
    
    // Notas em cada casa - CORRIGIDO: cordas de baixo pra cima COM MARGENS
    for (let string = 0; string < STRING_COUNT; string++) {
        const openNoteIndex = getNoteIndex(STRING_TUNINGS[string]);
        
        for (let fret = 0; fret <= FRET_COUNT; fret++) {
            const noteIndex = (openNoteIndex + fret + 1) % 12;
            const noteName = NOTE_NAMES[noteIndex];
            
            const noteLabel = document.createElement('div');
            noteLabel.className = 'note-label';
            noteLabel.style.left = `${fret * fretWidth + (fret === 0 ? 10 : fretWidth / 2)}px`;
            // INVERTENDO com margens: string 0 (6ª) fica embaixo, string 5 (1ª) fica em cima
            noteLabel.style.top = `${topMargin + (STRING_COUNT - 1 - string) * (usableHeight / (STRING_COUNT - 1))}%`;
            noteLabel.textContent = noteName;
            noteLabel.style.zIndex = '2';
            fretboard.appendChild(noteLabel);
        }
    }
    
    fretboard.style.width = `${FRET_COUNT * fretWidth}px`;

    // ADICIONAR NOMES DAS CORDAS SOLTAS
    for (let string = 0; string < STRING_COUNT; string++) {
        const openStringLabel = document.createElement('div');
        openStringLabel.className = 'open-string-label';
        openStringLabel.textContent = STRING_TUNINGS[string];
        openStringLabel.style.left = `-40px`;
        // CORRIGIDO: usar a mesma lógica de margens para os labels
        openStringLabel.style.top = `${topMargin + (STRING_COUNT - 1 - string) * (usableHeight / (STRING_COUNT - 1))}%`;
        openStringLabel.style.transform = 'translateY(-50%)';
        fretboard.appendChild(openStringLabel);
    }

    // Marcadores de casas (pontos de referência)
    const markerPositions = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
    
    markerPositions.forEach(fret => {
        if (fret <= FRET_COUNT) {
            // Marcador simples (ponto)
            const marker = document.createElement('div');
            marker.className = 'fret-marker';
            marker.style.left = `${fret * fretWidth - fretWidth/2}px`;
            marker.style.top = '50%';
            fretboard.appendChild(marker);
            
            // Marcador duplo na casa 12
            if (fret === 12) {
                const markerTop = document.createElement('div');
                markerTop.className = 'fret-marker double';
                markerTop.style.left = `${fret * fretWidth - fretWidth/2}px`;
                markerTop.style.top = '30%';
                fretboard.appendChild(markerTop);
                
                const markerBottom = document.createElement('div');
                markerBottom.className = 'fret-marker double';
                markerBottom.style.left = `${fret * fretWidth - fretWidth/2}px`;
                markerBottom.style.top = '70%';
                fretboard.appendChild(markerBottom);
            }
        }
    });
}

function updateScale() {
    const scaleType = document.getElementById('scale-type').value;
    const baseString = parseInt(document.getElementById('base-string').value);
    const rootNote = parseInt(document.getElementById('root-note').value);
    
    const scaleOverlay = document.getElementById('scale-overlay');
    if (!scaleOverlay) return;
    
    scaleOverlay.innerHTML = '';
    
    const scalePattern = SCALE_PATTERNS[scaleType];
    const fretWidth = 80;
    
    // Encontrar a posição da tônica na corda base
    const baseStringOpenNote = getNoteIndex(STRING_TUNINGS[baseString - 1]);
    let tonicFret = (rootNote - baseStringOpenNote + 12) % 12;
    if (tonicFret < 0) tonicFret += 12;
    
    // Marcar todas as notas da escala no braço inteiro - CORRIGIDO: cordas de baixo pra cima COM MARGENS
    for (let string = 0; string < STRING_COUNT; string++) {
        const stringOpenNote = getNoteIndex(STRING_TUNINGS[string]);
        
        for (let fret = 0; fret <= FRET_COUNT; fret++) {
            const noteIndex = (stringOpenNote + fret) % 12;
            
            // Verificar se esta nota pertence à escala
            const scaleDegree = scalePattern.indexOf((noteIndex - rootNote + 12) % 12);
            if (scaleDegree !== -1) {
                const dot = document.createElement('div');
                dot.className = `scale-dot ${getScaleDegreeClass(scaleDegree)}`;
                dot.style.left = `${fret * fretWidth + (fret === 0 ? 10 : fretWidth / 2)}px`;
                // INVERTENDO com margens: string 0 (6ª) fica embaixo, string 5 (1ª) fica em cima
                dot.style.top = `${topMargin + (STRING_COUNT - 1 - string) * (usableHeight / (STRING_COUNT - 1))}%`;
                scaleOverlay.appendChild(dot);
                
                dot.title = `${NOTE_NAMES[noteIndex]} - ${getScaleDegreeName(scaleDegree)} (Corda ${6-string}ª)`;
            }
        }
    }
    
    // Centralizar na tônica
    const container = document.getElementById('fretboard-container');
    if (container) {
        container.scrollLeft = (tonicFret * fretWidth) - (container.clientWidth / 2);
    }
}

function getNoteIndex(noteName) {
    return NOTE_NAMES.indexOf(noteName);
}

function getScaleDegreeClass(degree) {
    const classes = ['tonic', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
    return classes[degree] || 'tonic';
}

function getScaleDegreeName(degree) {
    const names = ['Tônica', '2ª Maior', '3ª Maior', '4ª Justa', '5ª Justa', '6ª Maior', '7ª Maior'];
    return names[degree] || 'Tônica';
}

function resetPosition() {
    const container = document.getElementById('fretboard-container');
    if (container) {
        container.scrollLeft = 0;
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    createFretboard();
    updateScale();
});