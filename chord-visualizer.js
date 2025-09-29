// ==========================
// Renderizador de acordes COMPLETO
// ==========================
function renderChord(containerId, chordName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const svgNS = "http://www.w3.org/2000/svg";
  const width = 220;
  const height = 300;
  const numFrets = 5;
  const numStrings = 6;

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.style.border = "1px solid #ccc";
  svg.style.background = "#fafafa";

  // Margens
  const marginLeft = 30;
  const marginRight = 30;
  const marginTop = 40;
  const marginBottom = 80;

  // Área útil
  const usableWidth = width - marginLeft - marginRight;
  const usableHeight = height - marginTop - marginBottom;

  // Espaçamentos
  const stringSpacing = usableWidth / (numStrings - 1);
  const fretSpacing = usableHeight / numFrets;

  // ==========================
  // DEFINIÇÕES DE TODOS OS ACORDES
  // ==========================
  const chordShapes = {
    // Acordes maiores
    "C":  [[], [3,3,"T"], [2,2], [], [1,1], []],
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

  const shape = chordShapes[chordName] || [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];

  // ==========================
  // Cordas (linhas verticais)
  // ==========================
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

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", marginTop - 10);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "12");
    text.setAttribute("font-weight", "bold");
    text.textContent = stringNames[i];
    svg.appendChild(text);
  }

  // ==========================
  // Trastes (linhas horizontais)
  // ==========================
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

  // ==========================
  // Pestana (barre)
  // ==========================
  if (shape.some(pos => pos[1] === "B")) {
    const fret = shape.find(pos => pos[1] === "B")[0];
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

  // ==========================
  // MARCAÇÕES NO BRAÇO
  // ==========================
  for (let i = 0; i < numStrings; i++) {
    const pos = shape[i];
    if (!pos || pos.length === 0) continue;

    const [fret, finger, tonicFlag] = pos;
    const x = marginLeft + i * stringSpacing;

    // Notas pressionadas (casa > 0)
    if (fret > 0 && finger !== "B") {
      const y = marginTop + (fret - 0.5) * fretSpacing;

      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y + 5);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "16");
      text.setAttribute("font-weight", "bold");
      text.setAttribute("fill", "black");
      text.textContent = finger;
      svg.appendChild(text);
    }

    // Cordas soltas (casa 0)
    if (fret === 0) {
      const y = marginTop - 15;

      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y + 3);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "14");
      text.setAttribute("font-weight", "bold");
      text.textContent = "O";
      svg.appendChild(text);
    }

    // "X" para cordas não tocadas
    if (pos.length === 0) {
      const y = marginTop - 15;
      
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y + 3);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "14");
      text.setAttribute("font-weight", "bold");
      text.textContent = "X";
      svg.appendChild(text);
    }
  }

  // ==========================
  // BOLINHAS ABAIXO DO BRAÇO
  // ==========================
  const legendY = marginTop + usableHeight + 30;

  for (let i = 0; i < numStrings; i++) {
    const pos = shape[i];
    if (!pos || pos.length === 0) continue;

    const [fret, finger, tonicFlag] = pos;
    const x = marginLeft + i * stringSpacing;

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", legendY);
    circle.setAttribute("r", 6);
    circle.setAttribute("fill", tonicFlag === "T" ? "darkblue" : "black");
    svg.appendChild(circle);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", legendY + 15);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "9");
    text.textContent = fret === 0 ? "solta" : `casa ${fret}`;
    svg.appendChild(text);
  }

  /*/ ==========================
  // Nome do acorde
  // ==========================
  const chordText = document.createElementNS(svgNS, "text");
  chordText.setAttribute("x", width / 2);
  chordText.setAttribute("y", height - 10);
  chordText.setAttribute("text-anchor", "middle");
  chordText.setAttribute("font-size", "16");
  chordText.setAttribute("font-weight", "bold");
  chordText.textContent = chordName;
  svg.appendChild(chordText);
*/
  container.appendChild(svg);
}

// ==========================
// Função para mostrar lista de acordes
// ==========================
function renderAllChords() {
  const chords = [
    "C", "D", "E", "F", "G", "A", "B",
    "Cm", "Dm", "Em", "Fm", "Gm", "Am", "Bm",
    "C7", "D7", "E7", "F7", "G7", "A7", "B7",
    "Cmaj7", "Dmaj7", "Emaj7", "Fmaj7", "Gmaj7", "Amaj7",
    "Cm7", "Dm7", "Em7", "Fm7", "Gm7", "Am7", "Bm7",
    "Csus2", "Dsus2", "Esus2", "Gsus2", "Asus2",
    "Csus4", "Dsus4", "Esus4", "Gsus4", "Asus4",
    "C5", "D5", "E5", "G5", "A5",
    "C6", "D6", "E6", "G6", "A6",
    "C9", "D9", "E9", "G9", "A9"
  ];

  const container = document.getElementById('chordsContainer');
  container.innerHTML = '';

  chords.forEach(chord => {
    const chordDiv = document.createElement('div');
    chordDiv.style.display = 'inline-block';
    chordDiv.style.margin = '10px';
    chordDiv.style.textAlign = 'center';
    chordDiv.id = `chord-${chord}`;
    
    const label = document.createElement('div');
    label.textContent = chord;
    label.style.fontWeight = 'bold';
    label.style.marginBottom = '5px';
    
    chordDiv.appendChild(label);
    container.appendChild(chordDiv);
    
    renderChord(`chord-${chord}`, chord);
  });
}

// Inicializar quando a página carregar
window.onload = renderAllChords;