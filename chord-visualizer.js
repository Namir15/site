// chord-visualizer.js - VERSÃO COMPLETA E CORRIGIDA
class ChordVisualizer {
    constructor() {
        this.chordShapes = {
            // Acordes maiores
            "C":  [[], [2,3,"T"], [2,2], [], [1,1], []],
    "D":  [[], [], [0,0,"T"], [2,1], [3,3], [2,2]],
    "E":  [[,,"T"], [2,2], [2,3], [1,1], [], []],
    "F":  [[1,"B","T"], [3,4], [3,3], [2,2], [1,"B"], [1,"B",]],
    "G":  [[3,2,"T"], [2,1], [,], [,], [,], [3,3]],
    "A":  [[], [0,0,"T"], [2,1], [2,2], [2,3], [0,0]],
    "B":  [[2,"B"], [2,"B","T"], [4,4], [4,3], [3,2], [2,"B"]],
    
    // Acordes menores
    "Cm": [[3,"B"], [3,"B","T"], [5,5], [5,4], [4,3], [3,"B"]],
    "Dm": [[], [], [0,0,"T"], [2,1], [3,3], [1,1]],
    "Em": [[0,0,"T"], [2,2], [2,3], [0,0], [0,0], [0,0]],
    "Fm": [[1,"B"], [3,4], [3,3], [1,1], [1,"B"], [1,"B","T"]],
    "Gm": [[3,2,"T"], [3,3], [0,0], [0,0], [0,0], [3,4]],
    "Am": [[], [0,0,"T"], [2,2], [2,3], [1,1], [0,0]],
    "Bm": [[2,"B"], [2,"B","T"], [4,4], [4,3], [3,2], [2,"B"]],
    
    // Acordes com sétima
    "C7": [[0,0], [3,3], [2,2], [3,4], [1,1], [0,0,"T"]],
    "D7": [[], [], [0,0], [2,2], [1,1], [2,3,"T"]],
    "E7": [[0,0,"T"], [2,2], [0,0], [1,1], [0,0], [0,0]],
    "F7": [[1,"B"], [3,4], [1,1], [2,2], [1,"B"], [1,"B","T"]],
    "G7": [[3,2,"T"], [2,1], [0,0], [0,0], [0,0], [1,3]],
    "A7": [[], [0,0,"T"], [2,2], [0,0], [2,3], [0,0]],
    "B7": [[2,"B"], [2,"B","T"], [4,4], [3,2], [3,3], [2,"B"]],
    
    // Acordes maiores com sétima
    "Cmaj7": [[], [3,3,"T"], [2,2], [0,0], [0,0], [2,4]],
    "Dmaj7": [[], [], [0,0,"T"], [2,1], [2,2], [2,3]],
    "Emaj7": [[0,0,"T"], [2,2], [1,1], [1,1], [0,0], [1,4]],
    "Fmaj7": [[1,"B"], [3,4], [2,2], [0,0], [1,"B"], [1,"B","T"]],
    "Gmaj7": [[3,2,"T"], [2,1], [0,0], [0,0], [0,0], [2,3]],
    "Amaj7": [[], [0,0,"T"], [2,1], [1,1], [2,3], [0,0]],
    
    // Acordes menores com sétima
    "Cm7": [[3,"B"], [3,"B","T"], [5,5], [5,4], [3,3], [3,"B"]],
    "Dm7": [[], [], [0,0,"T"], [2,1], [1,1], [1,1]],
    "Em7": [[0,0,"T"], [2,2], [0,0], [0,0], [0,0], [0,0]],
    "Fm7": [[1,"B"], [3,4], [1,1], [1,1], [1,"B"], [1,"B","T"]],
    "Gm7": [[3,2,"T"], [3,3], [0,0], [0,0], [0,0], [1,4]],
    "Am7": [[], [0,0,"T"], [2,2], [0,0], [1,1], [0,0]],
    "Bm7": [[2,"B"], [2,"B","T"], [4,4], [2,2], [3,3], [2,"B"]],
    
    // Acordes suspendidos
    "Csus2": [[], [3,3,"T"], [2,2], [0,0], [3,4], [0,0,"T"]],
    "Dsus2": [[], [], [0,0,"T"], [2,1], [3,3], [0,0]],
    "Esus2": [[0,0,"T"], [2,2], [2,3], [2,4], [0,0], [0,0]],
    "Gsus2": [[3,2,"T"], [0,0], [0,0], [0,0], [1,1], [3,3]],
    "Asus2": [[], [0,0,"T"], [2,1], [2,2], [0,0], [0,0]],
    
    "Csus4": [[], [3,3,"T"], [3,4], [0,0], [1,1], [0,0,"T"]],
    "Dsus4": [[], [], [0,0,"T"], [2,1], [3,3], [3,4]],
    "Esus4": [[0,0,"T"], [2,2], [2,3], [2,4], [0,0], [0,0]],
    "Gsus4": [[3,2,"T"], [0,0], [0,0], [0,0], [1,1], [3,3]],
    "Asus4": [[], [0,0,"T"], [2,1], [2,2], [3,4], [0,0]],
    
    // Acordes com quinta diminuta/aumentada
    "C5":  [[], [3,3,"T"], [5,5], [5,5], [3,3], []],
    "D5":  [[], [], [0,0,"T"], [2,1], [3,3], []],
    "E5":  [[0,0,"T"], [2,2], [2,3], [], [], []],
    "G5":  [[3,2,"T"], [5,5], [5,5], [], [], []],
    "A5":  [[], [0,0,"T"], [2,1], [2,2], [], []],
    
    // Acordes com sexta
    "C6":  [[], [3,3,"T"], [2,2], [2,2], [1,1], [0,0,"T"]],
    "D6":  [[], [], [0,0,"T"], [2,1], [0,0], [2,2]],
    "E6":  [[0,0,"T"], [2,2], [2,3], [1,1], [2,4], [0,0]],
    "G6":  [[3,2,"T"], [2,1], [0,0], [0,0], [0,0], [0,0]],
    "A6":  [[], [0,0,"T"], [2,1], [2,2], [2,3], [2,4]],
    
    // Acordes com nona
    "C9":  [[3,3,"T"], [3,3], [2,2], [3,4], [3,3], [3,3]],
    "D9":  [[], [], [0,0,"T"], [2,1], [1,1], [2,3]],
    "E9":  [[0,0,"T"], [2,2], [0,0], [1,1], [2,4], [0,0]],
    "G9":  [[3,2,"T"], [2,1], [0,0], [0,0], [0,0], [1,3]],
    "A9":  [[], [0,0,"T"], [2,1], [1,1], [2,3], [0,0]]
        };
        
         

        this.init();
    }

    init() {
        console.log('ChordVisualizer inicializado');
        this.setupChordSelector();
        this.setupQuiz();
        this.setupEventListeners();
    }

    setupChordSelector() {
        const chordSelect = document.getElementById('chord-select');
        if (!chordSelect) {
            console.warn('Elemento chord-select não encontrado');
            return;
        }

        chordSelect.innerHTML = '<option value="">Selecione um acorde</option>';
        
        Object.keys(this.chordShapes).forEach(chordName => {
            const option = document.createElement('option');
            option.value = chordName;
            option.textContent = chordName;
            chordSelect.appendChild(option);
        });

        chordSelect.addEventListener('change', (e) => {
            this.displayChord(e.target.value);
        });

        // Inicializa com o primeiro acorde
        setTimeout(() => {
            if (Object.keys(this.chordShapes).length > 0) {
                chordSelect.value = Object.keys(this.chordShapes)[0];
                this.displayChord(Object.keys(this.chordShapes)[0]);
            }
        }, 100);
    }

    setupQuiz() {
        const newQuizBtn = document.getElementById('new-quiz-btn');
        if (newQuizBtn) {
            newQuizBtn.addEventListener('click', () => {
                this.generateQuiz();
            });
            
            // Inicia o quiz automaticamente
            setTimeout(() => {
                newQuizBtn.click();
            }, 1500);
        }
    }

    setupEventListeners() {
        // Event listeners adicionais podem ser adicionados aqui
    }

    displayChord(chordName) {
        const visualizer = document.getElementById('chord-visualizer');
        if (!visualizer) {
            console.warn('Elemento chord-visualizer não encontrado');
            return;
        }

        if (!chordName || !this.chordShapes[chordName]) {
            visualizer.innerHTML = this.createPlaceholder('Selecione um acorde para visualizar');
            return;
        }

        const chord = this.chordShapes[chordName];
        visualizer.innerHTML = this.createChordDiagram(chordName, chord);
    }

    createPlaceholder(message) {
        return `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-guitar" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <p>${message}</p>
            </div>
        `;
    }

    createChordDiagram(chordName, chord) {
        const width = 220;
        const height = 300;
        const numFrets = 5;
        const numStrings = 6;

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.style.border = "1px solid #ccc";
        svg.style.background = "#fafafa";
        svg.style.borderRadius = "8px";

        // Margens
        const marginLeft = 30;
        const marginRight = 30;
        const marginTop = 40;
        const marginBottom = 60;

        // Área útil
        const usableWidth = width - marginLeft - marginRight;
        const usableHeight = height - marginTop - marginBottom;

        // Espaçamentos
        const stringSpacing = usableWidth / (numStrings - 1);
        const fretSpacing = usableHeight / numFrets;

        // Cordas (linhas verticais)
        const stringNames = ["E", "A", "D", "G", "B", "E"];
        for (let i = 0; i < numStrings; i++) {
            const x = marginLeft + i * stringSpacing;
            
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", marginTop);
            line.setAttribute("x2", x);
            line.setAttribute("y2", marginTop + usableHeight);
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", i === 0 || i === numStrings - 1 ? "2" : "1");
            svg.appendChild(line);

            // Nome da corda
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", x);
            text.setAttribute("y", marginTop - 10);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("font-size", "12");
            text.setAttribute("font-weight", "bold");
            text.textContent = stringNames[i];
            svg.appendChild(text);
        }

        // Trastes (linhas horizontais)
        for (let i = 0; i <= numFrets; i++) {
            const y = marginTop + i * fretSpacing;
            
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", marginLeft);
            line.setAttribute("y1", y);
            line.setAttribute("x2", marginLeft + usableWidth);
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", i === 0 ? "3" : "1");
            svg.appendChild(line);

            // Número do traste
            if (i > 0) {
                const text = document.createElementNS(svgNS, "text");
                text.setAttribute("x", marginLeft - 10);
                text.setAttribute("y", y - (fretSpacing / 2) + 4);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("font-size", "10");
                text.textContent = i;
                svg.appendChild(text);
            }
        }

        // Pestana (barre)
        if (chord.some(pos => pos[1] === "B")) {
            const fret = chord.find(pos => pos[1] === "B")[0];
            const y = marginTop + (fret - 0.5) * fretSpacing;
            
            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("x", marginLeft);
            rect.setAttribute("y", y - 8);
            rect.setAttribute("width", usableWidth);
            rect.setAttribute("height", 16);
            rect.setAttribute("rx", 8);
            rect.setAttribute("fill", "#444");
            rect.setAttribute("opacity", "0.6");
            svg.appendChild(rect);
        }

        // Marcações das notas
        for (let i = 0; i < numStrings; i++) {
            const pos = chord[i];
            if (!pos || pos.length === 0) continue;

            const [fret, finger, tonicFlag] = pos;
            const x = marginLeft + i * stringSpacing;

            // Notas pressionadas (casa > 0)
            if (fret > 0 && finger !== "B") {
                const y = marginTop + (fret - 0.5) * fretSpacing;

                const circle = document.createElementNS(svgNS, "circle");
                circle.setAttribute("cx", x);
                circle.setAttribute("cy", y);
                circle.setAttribute("r", 8);
                circle.setAttribute("fill", tonicFlag === "T" ? "#6C63FF" : "white");
                circle.setAttribute("stroke", "#333");
                circle.setAttribute("stroke-width", "2");
                svg.appendChild(circle);

                const text = document.createElementNS(svgNS, "text");
                text.setAttribute("x", x);
                text.setAttribute("y", y + 4);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("font-size", "10");
                text.setAttribute("font-weight", "bold");
                text.setAttribute("fill", tonicFlag === "T" ? "white" : "black");
                text.textContent = finger;
                svg.appendChild(text);
            }

            // Cordas soltas (casa 0)
            if (fret === 0) {
                const y = marginTop - 20;

                const text = document.createElementNS(svgNS, "text");
                text.setAttribute("x", x);
                text.setAttribute("y", y);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("font-size", "14");
                text.setAttribute("font-weight", "bold");
                text.setAttribute("fill", "green");
                text.textContent = "○";
                svg.appendChild(text);
            }

            // "X" para cordas não tocadas
            if (pos.length === 0) {
                const y = marginTop - 20;
                
                const text = document.createElementNS(svgNS, "text");
                text.setAttribute("x", x);
                text.setAttribute("y", y);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("font-size", "14");
                text.setAttribute("font-weight", "bold");
                text.setAttribute("fill", "red");
                text.textContent = "X";
                svg.appendChild(text);
            }
        }
              
              
        // Nome do acorde
        const chordText = document.createElementNS(svgNS, "text");
        chordText.setAttribute("x", width / 2);
        chordText.setAttribute("y", height - 15);
        chordText.setAttribute("text-anchor", "middle");
        chordText.setAttribute("font-size", "16");
        chordText.setAttribute("font-weight", "bold");
        chordText.setAttribute("fill", "#6C63FF");
        chordText.textContent = chordName;
        svg.appendChild(chordText);

        return svg.outerHTML;
    }

    generateQuiz() {
        const quizVisualizer = document.getElementById('quiz-chord-visualizer');
        const quizOptions = document.getElementById('quiz-options');
        const quizFeedback = document.getElementById('quiz-feedback');

        if (!quizVisualizer || !quizOptions) {
            console.warn('Elementos do quiz não encontrados');
            return;
        }

        // Seleciona acordes básicos para o quiz
        const quizChords = ["C", "G", "D", "Am", "Em", "F"];
        const correctChord = quizChords[Math.floor(Math.random() * quizChords.length)];
        const chord = this.chordShapes[correctChord];

        // Mostra o diagrama do acorde (sem o nome)
        quizVisualizer.innerHTML = this.createChordDiagram("?", chord);

        // Remove o nome do acorde do visualizador do quiz
        setTimeout(() => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = quizVisualizer.innerHTML;
            const textElements = tempDiv.querySelectorAll('text');
            textElements.forEach(text => {
                if (text.textContent === "?") {
                    text.textContent = "?";
                }
            });
            quizVisualizer.innerHTML = tempDiv.innerHTML;
        }, 100);

        // Gera opções (incluindo a correta)
        quizOptions.innerHTML = '';
        const options = this.shuffleArray([...quizChords.filter(name => name !== correctChord).slice(0, 3), correctChord]);
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.addEventListener('click', () => {
                this.checkQuizAnswer(option, correctChord, quizFeedback, button);
            });
            quizOptions.appendChild(button);
        });

        if (quizFeedback) {
            quizFeedback.textContent = 'Qual é este acorde?';
            quizFeedback.className = '';
            quizFeedback.style.color = '#333';
        }
    }

    checkQuizAnswer(selected, correct, feedbackElement, button) {
        const allButtons = document.querySelectorAll('#quiz-options .quiz-option');
        
        // Desabilita todos os botões
        allButtons.forEach(btn => {
            btn.disabled = true;
        });

        // Remove classes anteriores
        allButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
        });

        if (selected === correct) {
            button.classList.add('correct');
            if (feedbackElement) {
                feedbackElement.textContent = '🎉 Correto! Parabéns!';
                feedbackElement.style.color = '#4CAF50';
                feedbackElement.className = 'correct-feedback';
            }
        } else {
            button.classList.add('incorrect');
            // Mostra qual era a resposta correta
            allButtons.forEach(btn => {
                if (btn.textContent === correct) {
                    btn.classList.add('correct');
                }
            });
            if (feedbackElement) {
                feedbackElement.textContent = `❌ Resposta correta: ${correct}`;
                feedbackElement.style.color = '#F44336';
                feedbackElement.className = 'incorrect-feedback';
            }
        }
    } 

    

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Método para renderizar todos os acordes (se necessário)
    renderAllChords(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }

        container.innerHTML = '';

        Object.keys(this.chordShapes).forEach(chordName => {
            const chordDiv = document.createElement('div');
            chordDiv.style.display = 'inline-block';
            chordDiv.style.margin = '10px';
            chordDiv.style.textAlign = 'center';
            chordDiv.style.verticalAlign = 'top';
            
            const label = document.createElement('div');
            label.textContent = chordName;
            label.style.fontWeight = 'bold';
            label.style.marginBottom = '5px';
            label.style.color = '#6C63FF';
            
            const visualizer = document.createElement('div');
            visualizer.innerHTML = this.createChordDiagram(chordName, this.chordShapes[chordName]);
            
            chordDiv.appendChild(label);
            chordDiv.appendChild(visualizer);
            container.appendChild(chordDiv);
        });
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.chordVisualizer = new ChordVisualizer();
    
    // Adiciona alguns estilos para o quiz
    const style = document.createElement('style');
    style.textContent = `
        .quiz-option {
            background: var(--primary, #6C63FF);
            color: white;
            border: none;
            padding: 10px 18px;
            margin: 5px;
            font-size: 1em;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 80px;
        }
        
        .quiz-option:hover:not(:disabled) {
            background: var(--primary-dark, #5a52e0);
            transform: translateY(-2px);
        }
        
        .quiz-option:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        .quiz-option.correct {
            background: var(--success, #4CAF50) !important;
        }
        
        .quiz-option.incorrect {
            background: var(--danger, #F44336) !important;
        }
        
        #quiz-options {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }
        
        #quiz-feedback {
            margin-top: 15px;
            font-weight: bold;
            font-size: 1.2em;
            min-height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .correct-feedback {
            color: var(--success, #4CAF50) !important;
        }
        
        .incorrect-feedback {
            color: var(--danger, #F44336) !important;
        }
        
        #new-quiz-btn {
            background: var(--primary, #6C63FF);
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 1em;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s ease;
            margin-top: 10px;
        }
        
        #new-quiz-btn:hover {
            background: var(--primary-dark, #5a52e0);
        }
        
        #chord-select {
            padding: 10px;
            font-size: 1em;
            border: 2px solid var(--primary, #6C63FF);
            border-radius: 8px;
            background: white;
            color: #333;
            margin-bottom: 15px;
            width: 200px;
        }
        
        #quiz-chord-visualizer, #chord-visualizer {
            margin: 20px auto;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 320px;
        }
    `;
    document.head.appendChild(style);
});

// Funções globais para compatibilidade (se necessário)
function renderChord(containerId, chordName) {
    if (window.chordVisualizer && window.chordVisualizer.chordShapes[chordName]) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = window.chordVisualizer.createChordDiagram(chordName, window.chordVisualizer.chordShapes[chordName]);
        }
    }
}

function generateQuiz() {
    if (window.chordVisualizer) {
        window.chordVisualizer.generateQuiz();
    }
}

// Exemplo: Tocar acorde quando clicar no diagrama
function playChordFromVisualizer(chordNotes) {
    if (window.playChord) {
        window.playChord(chordNotes);
    }
}

// Exemplo: Tocar nota individual
function playNoteFromFret(note) {
    if (window.playNote) {
        window.playNote(note);
    }
}

