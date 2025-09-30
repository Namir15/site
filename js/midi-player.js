// js/midi-player.js - VERSÃO TONE.JS
class MIDIPlayer {
    constructor() {
        this.isInitialized = false;
        this.currentTrack = null;
        this.isPlaying = false;
        this.midiFiles = [];
        this.volume = 0.8;
        this.synth = null;
        this.currentSequence = null;
        
        console.log('🎵 MIDI Player com Tone.js');
        this.init();
    }

    async init() {
        try {
            // 1. Carrega lista de músicas
            await this.loadMidiList();
            
            // 2. Configura controles
            this.setupEventListeners();

            // 3. Prepara desbloqueio de áudio
            this.prepareAudioUnlock();

        } catch (error) {
            console.warn('Aviso na inicialização:', error.message);
            this.updateStatus('Player carregado em modo de lista', 'info');
        }
    }

    prepareAudioUnlock() {
        // Só inicializa Tone.js depois do primeiro clique do usuário
        const unlock = async () => {
            if (!this.isInitialized) {
                console.log('🔓 Primeiro clique detectado, desbloqueando áudio...');
                await this.initializeTone();
            }
            document.removeEventListener('click', unlock);
        };
        document.addEventListener('click', unlock);
    }

    async initializeTone() {
        console.log('🔧 Inicializando Tone.js...');
        
        if (typeof Tone === 'undefined') {
            console.error('❌ Tone.js não carregada');
            this.updateStatus('❌ Biblioteca de áudio não carregada', 'error');
            this.setupFallbackMode();
            return;
        }

        try {
            this.synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "sine" },
                envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
            }).toDestination();

            const reverb = new Tone.Reverb({ decay: 2, wet: 0.1 }).toDestination();
            const filter = new Tone.Filter({ frequency: 1200, type: "lowpass" }).toDestination();

            this.synth.connect(reverb);
            this.synth.connect(filter);

            // 🔑 Agora sim inicializa o contexto
            await Tone.start();
            console.log('✅ Tone.js inicializada com sucesso!');
            console.log('🔊 Contexto de áudio:', Tone.context.state);
            
            this.isInitialized = true;
            this.setVolume(this.volume);
            this.updateStatus('✅ Player de áudio pronto!', 'success');
            this.enableControls();

        } catch (error) {
            console.error('❌ Erro ao inicializar Tone.js:', error);
            this.updateStatus('❌ Erro no sistema de áudio', 'error');
            this.setupFallbackMode();
        }
    }

    setupFallbackMode() {
        console.log('🔄 Modo fallback ativado');
        this.updateStatus('📋 Lista de músicas disponível', 'info');
    }

    enableControls() {
        const playBtn = document.getElementById('play-midi');
        if (playBtn) {
            playBtn.disabled = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i> Tocar';
            playBtn.title = 'Clique para tocar a música selecionada';
        }
        
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.disabled = false;
        });
        
        console.log('🎛️ Controles de áudio ativados');
    }

    async loadMidiList() {
        try {
            console.log('📁 Carregando lista de músicas...');
            
            const response = await fetch('./midis.json');
            if (!response.ok) throw new Error('midis.json não encontrado');
            
            this.midiFiles = await response.json();
            console.log(`✅ ${this.midiFiles.length} músicas carregadas do JSON`);
            
        } catch (error) {
            console.log('🔄 Usando lista embutida...');
            this.midiFiles = [
                { name: "Hino Nacional Brasileiro", file: "./midis/Hino_Nacional_Brasileiro.mid" },
                { name: "Granados Bocetos No1", file: "./midis/Granados_Bocetos_No1.mid" }
            ];
        }
        
        this.renderMidiList();
    }

    renderMidiList() {
        const midiList = document.getElementById('midi-list');
        if (!midiList) return;

        if (this.midiFiles.length === 0) {
            midiList.innerHTML = '<li class="loading-item">Nenhuma música encontrada</li>';
            return;
        }

        midiList.innerHTML = this.midiFiles.map((file, index) => `
            <li class="midi-item" data-index="${index}">
                <div class="midi-info">
                    <i class="fas fa-music"></i>
                    <div>
                        <div class="midi-name">${file.name}</div>
                        <small class="midi-path">${file.file}</small>
                    </div>
                </div>
                <button class="play-btn" data-index="${index}" 
                        ${!this.isInitialized ? 'disabled' : ''}
                        title="${this.isInitialized ? 'Tocar música' : 'Áudio não disponível'}">
                    <i class="fas fa-play"></i>
                </button>
            </li>
        `).join('');

        this.setupMidiListEvents();
        this.updateStatus(`🎵 ${this.midiFiles.length} músicas carregadas`, 'success');
    }

    setupMidiListEvents() {
        const midiList = document.getElementById('midi-list');
        if (!midiList) return;

        midiList.querySelectorAll('.midi-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.play-btn')) {
                    const index = parseInt(item.getAttribute('data-index'));
                    this.selectTrack(index);
                }
            });
        });

        midiList.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.selectTrack(index);
                this.playDemoMusic(); // Toca uma demo em vez do MIDI
            });
        });
    }

    setupEventListeners() {
        // Sistema de busca
        const searchInput = document.getElementById('midi-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterMidiList(e.target.value);
            });
        }

        // Controles principais
        const playBtn = document.getElementById('play-midi');
        const pauseBtn = document.getElementById('pause-midi');
        const stopBtn = document.getElementById('stop-midi');
        const volumeControl = document.getElementById('midi-volume');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.playDemoMusic());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseMusic());
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopMusic());
        }

        if (volumeControl) {
            volumeControl.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }

        console.log('🎛️ Todos os controles configurados');
    }

    // DEMO: Toca uma música de exemplo usando Tone.js
    playDemoMusic() {
        if (!this.currentTrack) {
            this.updateStatus('⚠️ Selecione uma música primeiro', 'warning');
            return;
        }

        if (!this.isInitialized) {
            this.updateStatus('❌ Sistema de áudio não disponível', 'error');
            return;
        }

        try {
            this.updateStatus(`🎵 Tocando: ${this.currentTrack.name}`, 'playing');
            this.stopMusic();

            // Demo: Toca uma sequência musical simples
            const now = Tone.now();
            const melody = ["C4", "E4", "G4", "C5", "G4", "E4", "C4"];
            
            // Para qualquer sequência anterior
            if (this.currentSequence) {
                this.currentSequence.stop();
            }

            // Cria nova sequência
            this.currentSequence = new Tone.Sequence((time, note) => {
                this.synth.triggerAttackRelease(note, "8n", time);
            }, melody, "4n");

            this.currentSequence.start(0);
            this.currentSequence.loop = true;
            this.currentSequence.loopEnd = "2m";
            
            // Inicia o transport do Tone.js
            Tone.Transport.start();
            this.isPlaying = true;
            this.updatePlaybackState();

            console.log(`▶️ Reproduzindo demo: ${this.currentTrack.name}`);

        } catch (error) {
            console.error('Erro ao reproduzir:', error);
            this.updateStatus('❌ Erro na reprodução', 'error');
        }
    }

    pauseMusic() {
        if (this.isPlaying) {
            Tone.Transport.pause();
            this.isPlaying = false;
            this.updatePlaybackState();
            this.updateStatus('⏸️ Música pausada', 'info');
        }
    }

    stopMusic() {
        if (this.currentSequence) {
            this.currentSequence.stop();
        }
        Tone.Transport.stop();
        Tone.Transport.cancel();
        this.isPlaying = false;
        this.updatePlaybackState();
        this.updateStatus('⏹️ Reprodução parada', 'info');
    }

    filterMidiList(searchTerm) {
        const items = document.querySelectorAll('.midi-item');
        items.forEach(item => {
            const name = item.querySelector('.midi-name').textContent.toLowerCase();
            item.style.display = name.includes(searchTerm.toLowerCase()) ? 'flex' : 'none';
        });
    }

    selectTrack(index) {
        document.querySelectorAll('.midi-item').forEach(item => {
            item.classList.remove('active');
        });

        const selectedItem = document.querySelector(`.midi-item[data-index="${index}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
            this.currentTrack = this.midiFiles[index];
            this.updateCurrentTrackDisplay();
            
            console.log(`🎵 Selecionada: ${this.currentTrack.name}`);
        }
    }

    updateCurrentTrackDisplay() {
        const element = document.getElementById('current-track');
        if (element && this.currentTrack) {
            element.textContent = `Selecionada: ${this.currentTrack.name}`;
            element.style.fontWeight = 'bold';
            element.style.color = 'var(--primary)';
        }
    }

    updatePlaybackState() {
        const playBtn = document.getElementById('play-midi');
        const currentItem = document.querySelector('.midi-item.active');
        const playIcon = currentItem ? currentItem.querySelector('.play-btn i') : null;

        if (this.isPlaying) {
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
                playBtn.style.background = 'var(--secondary)';
            }
            if (playIcon) {
                playIcon.className = 'fas fa-pause';
                currentItem.querySelector('.play-btn').classList.add('playing');
            }
        } else {
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-play"></i> Tocar';
                playBtn.style.background = '';
            }
            if (playIcon) {
                playIcon.className = 'fas fa-play';
                if (currentItem) {
                    currentItem.querySelector('.play-btn').classList.remove('playing');
                }
            }
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.synth) {
            this.synth.volume.value = Tone.gainToDb(volume);
        }
        
        const volumeControl = document.getElementById('midi-volume');
        if (volumeControl) {
            volumeControl.value = volume * 100;
        }
    }

    updateStatus(message, type = 'info') {
        const element = document.getElementById('player-status');
        if (element) {
            element.textContent = message;
            element.className = `status-message ${type}`;
        }
    }

    // Método para tocar acordes específicos (útil para o visualizador)
    playChord(notes, duration = "4n") {
        if (!this.isInitialized || !this.synth) {
            console.warn('Sintetizador não disponível');
            return;
        }

        try {
            const now = Tone.now();
            this.synth.triggerAttackRelease(notes, duration, now);
        } catch (error) {
            console.error('Erro ao tocar acorde:', error);
        }
    }

    // Método para tocar uma nota individual
    playNote(note, duration = "4n") {
        if (!this.isInitialized || !this.synth) {
            console.warn('Sintetizador não disponível');
            return;
        }

        try {
            const now = Tone.now();
            this.synth.triggerAttackRelease(note, duration, now);
        } catch (error) {
            console.error('Erro ao tocar nota:', error);
        }
    }
}

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎸 Violão Pro com Tone.js - Inicializando...');
    try {
        window.midiPlayer = new MIDIPlayer();
        
        window.playChord = (notes) => window.midiPlayer?.playChord(notes);
        window.playNote = (note) => window.midiPlayer?.playNote(note);
        
    } catch (error) {
        console.error('❌ Erro crítico:', error);
        const statusElement = document.getElementById('player-status');
        if (statusElement) {
            statusElement.textContent = '❌ Erro no player';
            statusElement.className = 'status-message error';
        }
    }
});