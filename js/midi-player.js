document.addEventListener("DOMContentLoaded", function () {
  const midiList = document.getElementById("midi-list");
  const playBtn = document.getElementById("play-midi");
  const pauseBtn = document.getElementById("pause-midi");
  const stopBtn = document.getElementById("stop-midi");
  const volumeSlider = document.getElementById("midi-volume");
  const currentTrack = document.getElementById("current-track");
  const statusMsg = document.getElementById("player-status");
  const searchInput = document.getElementById("midi-search");

  let currentFile = null;
  let currentLi = null;

  // ⚡ Inicializa o player
  let player = new MIDI.Player();

  // 🔎 Renderiza lista de músicas
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

  // 🎼 Seleciona música
  function selectSong(song, li) {
    currentFile = song.file;
    currentTrack.textContent = "🎶 " + song.name;
    statusMsg.className = "status-message loading";
    statusMsg.textContent = "Carregando...";

    // Remove destaque anterior
    if (currentLi) currentLi.classList.remove("active");
    li.classList.add("active");
    currentLi = li;

    // Carrega o arquivo MIDI
    player.loadFile(currentFile, () => {
      statusMsg.className = "status-message success";
      statusMsg.textContent = "🎵 Pronto para tocar";

      playBtn.disabled = false;
      pauseBtn.disabled = false;
      stopBtn.disabled = false;
    });
  }

  // ▶ Play
  playBtn.addEventListener("click", () => {
    if (!currentFile) return;
    player.start();
    statusMsg.className = "status-message playing";
    statusMsg.textContent = "▶ Tocando...";
    if (currentLi) currentLi.classList.add("active");
  });

  // ⏸ Pause
  pauseBtn.addEventListener("click", () => {
    player.pause();
    statusMsg.className = "status-message success";
    statusMsg.textContent = "⏸ Pausado";
  });

  // ⏹ Stop
  stopBtn.addEventListener("click", () => {
    player.stop();
    statusMsg.className = "status-message success";
    statusMsg.textContent = "⏹ Parado";
    if (currentLi) currentLi.classList.remove("active");
  });

  // 🔊 Volume
  volumeSlider.addEventListener("input", () => {
    let vol = volumeSlider.value / 100;
    MIDI.Player.setVolume(vol);
  });
});
