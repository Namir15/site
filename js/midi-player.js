document.addEventListener("DOMContentLoaded", function () {
  const midiList = document.getElementById("midi-list");
  const playBtn = document.getElementById("play-midi");
  const pauseBtn = document.getElementById("pause-midi");
  const stopBtn = document.getElementById("stop-midi");
  const volumeSlider = document.getElementById("midi-volume");
  const currentTrack = document.getElementById("current-track");
  const statusMsg = document.getElementById("player-status");
  const searchInput = document.getElementById("midi-search");

  // 🎶 Lista de músicas
  const songs = [
    { name: "Michael", file: "midis/midis/Michael Jackson - Beat It.mid" },
    { name: "Canon in D - Pachelbel", file: "midis/canon-d.mid" },
    { name: "Yesterday - Beatles", file: "midis/yesterday.mid" }
  ];

  let currentFile = null;
  let currentLi = null;

  // 🔎 Renderiza a lista de músicas
  function renderList(filter = "") {
    midiList.innerHTML = "";
    const filteredSongs = songs.filter(song =>
      song.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredSongs.length === 0) {
      midiList.innerHTML = `<li class="loading-item">Nenhuma música encontrada</li>`;
      return;
    }

    filteredSongs.forEach(song => {
      const li = document.createElement("li");
      li.textContent = song.name;
      li.classList.add("midi-item");
      li.addEventListener("click", () => selectSong(song, li));
      midiList.appendChild(li);
    });
  }

  renderList();

  // 🔍 Busca de músicas
  searchInput.addEventListener("input", e => renderList(e.target.value));

  // 🎼 Seleciona uma música
  function selectSong(song, li) {
    currentFile = song.file;
    currentTrack.textContent = "🎶 " + song.name;
    statusMsg.className = "status-message success";
    statusMsg.textContent = "Música selecionada";

    playBtn.disabled = false;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;

    // Destaca a música selecionada
    if (currentLi) currentLi.classList.remove("active");
    li.classList.add("active");
    currentLi = li;
  }

  // ▶ Play
  playBtn.addEventListener("click", () => {
    if (!currentFile) return;
    MIDIjs.play(currentFile);
    statusMsg.className = "status-message playing";
    statusMsg.textContent = "▶ Tocando...";
    // Destaca a música
    if (currentLi) currentLi.classList.add("active");
  });

  // ⏸ Pause
  pauseBtn.addEventListener("click", () => {
    MIDIjs.pause();
    statusMsg.className = "status-message success";
    statusMsg.textContent = "⏸ Pausado";
  });

  // ⏹ Stop
  stopBtn.addEventListener("click", () => {
    MIDIjs.stop();
    statusMsg.className = "status-message success";
    statusMsg.textContent = "⏹ Parado";
    // Remove destaque
    if (currentLi) currentLi.classList.remove("active");
  });

  // 🔊 Volume
  volumeSlider.addEventListener("input", () => {
    let vol = volumeSlider.value / 100;
    MIDIjs.setVolume(0, vol);
  });
});
