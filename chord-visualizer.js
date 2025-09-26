// Conteúdo chord-visualizer.js fornecido anteriormente// chord-visualizer.js - Visualizador Interativo de Acordes

// Dicionário de acordes para o quiz
const chordLibrary = {
    'C-correct': {
        name: 'Dó Maior (C)',
        baseFret: 1,
        fingers: [
            { string: 5, fret: 3, finger: 3 },
            { string: 4, fret: 2, finger: 2 },
            { string: 2, fret: 1, finger: 1 }
        ],
        muted: [6],
        open: [1, 3]
    },
    'C-wrong1': {
        name: 'Posição Incorreta',
        baseFret: 2,
        fingers: [
            { string: 4, fret: 2, finger: 1 },
            { string: 3, fret: 2, finger: 2 },
            { string: 2, fret: 2, finger: 3 }
        ],
        muted: [6, 1],
        open: [5]
    },
    'C-wrong2': {
        name: 'Posição Incorreta',
        baseFret: 1,
        fingers: [
            { string: 6, fret: 1, finger: 1 },
            { string: 5, fret: 1, finger: 2 },
            { string: 4, fret: 1, finger: 3 },
            { string: 3, fret: 1, finger: 4 }
        ],
        muted: [],
        open: [2, 1]
    },
    'C-wrong3': {
        name: 'Posição Incorreta',
        baseFret: 3,
        fingers: [
            { string: 5, fret: 3, finger: 1 }
        ],
        muted: [6, 4, 3, 2, 1],
        open: []
    }
};

// Inicialização do visualizador
function initChordVisualizer() {
    const options = document.querySelectorAll('#quizTab .option');
    const changeAnswerBtn = document.getElementById('changeAnswer');
    const confirmBtn = document.getElementById('confirmQuiz');
    const skipBtn = document.getElementById('skipQuiz');
    
    // Check if elements exist
    if (options.length === 0) {
        console.log('Elementos do quiz não encontrados.');
        return;
    }
    
    let selectedOption = null;
    let answerConfirmed = false;
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            if (answerConfirmed) return;
            
            // Remove seleção anterior
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            selectedOption = option;
            const chordKey = option.getAttribute('data-chord');
            
            // Atualiza visualizador
            displayChord(chordKey);
            
            // Mostra botão de alterar resposta
            if (changeAnswerBtn) {
                changeAnswerBtn.style.display = 'inline-block';
            }
        });
    });
    
    // Botão de alterar resposta
    if (changeAnswerBtn) {
        changeAnswerBtn.addEventListener('click', () => {
            answerConfirmed = false;
            selectedOption = null;
            options.forEach(opt => opt.classList.remove('selected'));
            changeAnswerBtn.style.display = 'none';
            if (confirmBtn) confirmBtn.disabled = false;
            clearChordDisplay();
            updateHint('Selecione uma opção para visualizar o acorde');
        });
    }
    
    // Botão de confirmar
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (!selectedOption) {
                alert('Por favor, selecione uma opção antes de confirmar.');
                return;
            }
            
            answerConfirmed = true;
            const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
            
            // Feedback visual
            if (isCorrect) {
                selectedOption.style.borderColor = 'var(--success)';
                selectedOption.style.background = 'rgba(76, 175, 80, 0.1)';
                updateHint('✅ Correto! Esta é a digitação do acorde de Dó Maior.', 'success');
                
                // Anima os dedos corretos
                animateCorrectChord();
                
                // Atualiza progresso
                if (typeof updateProgress === 'function') {
                    updateProgress(10);
                }
            } else {
                selectedOption.style.borderColor = 'var(--danger)';
                selectedOption.style.background = 'rgba(244, 67, 54, 0.1)';
                updateHint('❌ Incorreto. Veja a digitação correta:', 'error');
                
                // Mostra o acorde correto após 1 segundo
                setTimeout(() => {
                    displayChord('C-correct', true);
                }, 1000);
            }
            
            // Desabilita interação
            options.forEach(opt => {
                opt.style.pointerEvents = 'none';
            });
            
            if (confirmBtn) confirmBtn.disabled = true;
            if (changeAnswerBtn) changeAnswerBtn.style.display = 'none';
        });
    }
    
    // Botão de pular
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja pular esta questão?')) {
                // Reset quiz for next time
                options.forEach(option => {
                    option.classList.remove('selected');
                    option.style.pointerEvents = 'auto';
                    option.style.borderColor = '';
                    option.style.background = '';
                });
                if (confirmBtn) confirmBtn.disabled = false;
                if (changeAnswerBtn) changeAnswerBtn.style.display = 'none';
                clearChordDisplay();
                answerConfirmed = false;
                selectedOption = null;
            }
        });
    }
    
    // Adiciona estilos de animação
    addAnimationStyles();
}

// Função para exibir acorde no visualizador
function displayChord(chordKey, isCorrectAnswer = false) {
    const chord = chordLibrary[chordKey];
    if (!chord) {
        console.error('Acorde não encontrado:', chordKey);
        return;
    }
    
    const fingersContainer = document.getElementById('fingersContainer');
    const mutedStringsContainer = document.getElementById('mutedStrings');
    const chordNameDisplay = document.getElementById('currentChordName');
    const currentFretDisplay = document.getElementById('currentFret');
    
    // Verifica se os elementos existem
    if (!fingersContainer || !mutedStringsContainer || !chordNameDisplay || !currentFretDisplay) {
        console.error('Elementos do visualizador não encontrados.');
        return;
    }
    
    // Limpa visualização anterior
    fingersContainer.innerHTML = '';
    mutedStringsContainer.innerHTML = '';
    
    // Atualiza informações
    chordNameDisplay.textContent = chord.name;
    currentFretDisplay.textContent = chord.baseFret;
    
    // Posiciona os dedos
    chord.fingers.forEach(fingerPos => {
        const fingerElement = document.createElement('div');
        fingerElement.className = `finger finger-${fingerPos.finger}`;
        fingerElement.textContent = fingerPos.finger;
        
        // Calcula posição
        const stringPosition = getStringPosition(fingerPos.string);
        const fretPosition = getFretPosition(fingerPos.fret - chord.baseFret + 1);
        
        fingerElement.style.left = `${fretPosition}%`;
        fingerElement.style.top = `${stringPosition}%`;
        
        if (isCorrectAnswer) {
            fingerElement.style.animation = 'chordPulse 0.5s ease-in-out';
        }
        
        fingersContainer.appendChild(fingerElement);
    });
    
    // Adiciona indicadores de cordas abafadas
    chord.muted.forEach(stringNum => {
        const mutedElement = document.createElement('div');
        mutedElement.className = 'muted-string';
        mutedElement.textContent = 'X';
        mutedElement.style.order = 7 - stringNum;
        mutedStringsContainer.appendChild(mutedElement);
    });
    
    // Dica contextual
    if (!isCorrectAnswer) {
        updateHint(`Visualizando: ${chord.fingers.length} dedo(s) na casa ${chord.baseFret}`);
    }
}

// Funções auxiliares para posicionamento
function getStringPosition(stringNum) {
    // 6 cordas, posições equidistantes (16.67% entre cada)
    return (stringNum - 0.5) * (100 / 6);
}

function getFretPosition(fretOffset) {
    // Posições aproximadas dos trastes
    const fretPositions = [10, 25, 40, 55, 70, 85];
    return fretPositions[fretOffset] || 50;
}

function clearChordDisplay() {
    const fingersContainer = document.getElementById('fingersContainer');
    const mutedStringsContainer = document.getElementById('mutedStrings');
    const chordNameDisplay = document.getElementById('currentChordName');
    const currentFretDisplay = document.getElementById('currentFret');
    
    if (fingersContainer) fingersContainer.innerHTML = '';
    if (mutedStringsContainer) mutedStringsContainer.innerHTML = '';
    if (chordNameDisplay) chordNameDisplay.textContent = '-';
    if (currentFretDisplay) currentFretDisplay.textContent = '-';
    
    updateHint('Selecione uma opção para visualizar o acorde');
}

function animateCorrectChord() {
    const fingers = document.querySelectorAll('.finger');
    fingers.forEach((finger, index) => {
        finger.style.animationDelay = `${index * 0.2}s`;
        finger.style.animation = 'chordBounce 0.5s ease-in-out';
    });
}

function updateHint(message, type = '') {
    const hintElement = document.getElementById('chordHint');
    if (hintElement) {
        hintElement.textContent = message;
        hintElement.style.color = type === 'success' ? 'var(--success)' : 
                                type === 'error' ? 'var(--danger)' : '';
    }
}

function addAnimationStyles() {
    // Verifica se os estilos já foram adicionados
    if (document.getElementById('chord-visualizer-styles')) return;
    
    const styles = `
        @keyframes chordBounce {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.2); }
        }
        
        @keyframes chordPulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'chord-visualizer-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda um pouco para garantir que todos os elementos estejam carregados
    setTimeout(initChordVisualizer, 100);
});

// Exporta funções para uso global (se necessário)
window.chordVisualizer = {
    init: initChordVisualizer,
    displayChord: displayChord,
    clearDisplay: clearChordDisplay
};