// ==========================
// Renderizador de acordes
// ==========================
function renderChord(containerId, chordName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ""; // limpar renderização anterior

  const svgNS = "http://www.w3.org/2000/svg";
  const width = 200;
  const height = 250;
  const numFrets = 5;
  const numStrings = 6;

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.style.border = "1px solid #ccc";
  svg.style.background = "#fafafa";

  const fretHeight = height / (numFrets + 1);
  const stringSpacing = width / (numStrings - 1);

  // Desenhar cordas
  for (let i = 0; i < numStrings; i++) {
    const x = i * stringSpacing;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", x);
    line.setAttribute("y2", height);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", i === 0 || i === numStrings - 1 ? "2" : "1");
    svg.appendChild(line);
  }

  // Desenhar trastes
  for (let i = 0; i <= numFrets; i++) {
    const y = i * fretHeight;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", i === 0 ? "4" : "2");
    svg.appendChild(line);
  }

  // Definições simplificadas de acordes (exemplo básico, pode expandir depois)
  const chordShapes = {
    "C":  [0, 3, 2, 0, 1, 0],
    "D":  [0, 0, 0, 2, 3, 2],
    "E":  [0, 2, 2, 1, 0, 0],
    "F":  [1, 3, 3, 2, 1, 1],
    "G":  [3, 2, 0, 0, 0, 3],
    "A":  [-1, 0, 2, 2, 2, 0],
    "B":  [-1, 2, 4, 4, 4, 2],

    "Cm": [3, 3, 5, 5, 4, 3],
    "Dm": [-1, -1, 0, 2, 3, 1],
    "Em": [0, 2, 2, 0, 0, 0],
    "Fm": [1, 3, 3, 1, 1, 1],
    "Gm": [3, 5, 5, 3, 3, 3],
    "Am": [-1, 0, 2, 2, 1, 0],
    "Bm": [2, 2, 4, 4, 3, 2],

    "C7": [0, 3, 2, 3, 1, 0],
    "D7": [0, 0, 0, 2, 1, 2],
    "E7": [0, 2, 0, 1, 0, 0],
    "F7":  [1, 3, 1, 2, 1, 1],
    "G7": [3, 2, 0, 0, 0, 1],
    "A7": [-1, 0, 2, 0, 2, 0],
    "B7":  [0, 2, 1, 2, 0, 2],
  };

  const shape = chordShapes[chordName] || [0, 0, 0, 0, 0, 0];

  // Desenhar bolinhas
  for (let i = 0; i < numStrings; i++) {
    const fret = shape[i];
    if (fret > 0) {
      const x = i * stringSpacing;
      // Centralizar no meio da casa (antes estava em cima do traste)
      const y = (fret - 0.5) * fretHeight;
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", 10);
      circle.setAttribute("class", "fret-dot");
      svg.appendChild(circle);
    }
  }

  container.appendChild(svg);
}
