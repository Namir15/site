const fs = require('fs');
const path = require('path');

// Caminho da pasta de MIDIs
const midiFolder = path.join(__dirname, 'midis');

// Lê todos os arquivos .mid
const files = fs.readdirSync(midiFolder).filter(f => f.endsWith('.mid'));

// Cria o array de músicas
const songs = files.map(f => {
  return {
    name: f.replace('.mid', ''),           // Nome da música
    file: 'midis/' + encodeURIComponent(f) // Caminho com URL encode
  };
});

// Gera o arquivo songs.js
const content = 'const songs = ' + JSON.stringify(songs, null, 2) + ';';

fs.writeFileSync(path.join(__dirname, 'js', 'songs.js'), content);

console.log('Arquivo js/songs.js gerado com sucesso!');

