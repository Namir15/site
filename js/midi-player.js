// js/midi-player.js - VERSÃO ULTRA-ROBUSTA
class MIDIPlayer {
    constructor() {
        this.isInitialized = false;
        this.currentTrack = null;
        this.isPlaying = false;
        this.midiFiles = [];
        this.volume = 0.8;
        
        console.log('🎵 MIDI Player instanciado');
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Iniciando MIDI Player...');
            
            // Carrega a lista de músicas primeiro
            await this.loadMidiListFromJSON();
            this.setupEventListeners();
            
            // Tenta inicializar MIDI
            await this.initializeMIDI();
            
        } catch (error) {
            console.warn('Aviso na inicialização:', error.message);
            this.updateStatus('Player carregado em modo limitado', 'warning');
        }
    }

    async initializeMIDI() {
        console.log('🔄 Inicializando sistema de áudio...');
        
        // Método 1: Verifica se MIDI.js já carregou
        if (await this.checkMIDIReady()) {
            console.log('✅ MIDI.js detectado automaticamente');
            this.setupMIDIPlugin();
            return;
        }
        
        // Método 2: Tenta carregar manualmente
        console.log('📥 MIDI.js não encontrado, carregando manualmente...');
        await this.loadMIDIManually();
    }

    checkMIDIReady() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 30; // 3 segundos
            
            const check = () => {
                attempts++;
                
                if (typeof MIDI !== 'undefined' && MIDI.loadPlugin) {
                    console.log(`✅ MIDI.js pronto após ${attempts} tentativas`);
                    resolve(true);
                    return;
                }
                
                if (attempts >= maxAttempts) {
                    console.warn(`❌ MIDI.js não carregou após ${maxAttempts} tentativas`);
                    resolve(false);
                    return;
                }
                
                setTimeout(check, 100);
            };
            
            check();
        });
    }

    loadMIDIManually() {
        return new Promise((resolve) => {
            console.log('🔧 Tentando carregar MIDI.js manualmente...');
            
            // Tenta várias CDNs
            const cdns = [
                'https://cdn.jsdelivr.net/npm/midijs@0.3.0/lib/MIDI.min.js',
                'https://unpkg.com/midijs@0.3.0/lib/MIDI.min.js',
                'https://cdn.rawgit.com/mudcube/MIDI.js/edfa90f2/build/MIDI.min.js'
            ];
            
            this.tryCDNs(cdns, 0, resolve);
        });
    }

    tryCDNs(cdns, index, resolve) {
        if (index >= cdns.length) {
            console.error('❌ Todas as CDNs falharam');
            this.setupFallbackMode();
            resolve();
            return;
        }
        
        const cdn = cdns[index];
        console.log(`🌐 Tentando CDN ${index + 1}/${cdns.length}: ${cdn}`);
        
        const script = document.createElement('script');
        script.src = cdn;
        
        script.onload = () => {
            console.log(`✅ CDN ${index + 1} carregou com sucesso`);
            setTimeout(() => {
                this.setupMIDIPlugin();
                resolve();
            }, 500);
        };
        
        script.onerror = () => {
            console.warn(`❌ CDN ${index + 1} falhou`);
            this.tryCDNs(cdns, index + 1, resolve);
        };
        
        document.head.appendChild(script);
    }

    setupFallbackMode() {
        console.log('🔄 Ativando modo fallback (sem áudio)');
        this.updateStatus('🔇 Modo sem áudio - Lista disponível', 'warning');
        
        // Ainda permite interação, mas sem som
        this.setupBasicControls();
    }

    setupBasicControls() {
        const playBtn = document.getElementById('play-midi');
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-play"></i> Sem Áudio';
            playBtn.disabled = true;
            playBtn.title = 'Sistema de áudio não disponível';
        }
    }

    setupMIDIPlugin() {
        if (typeof MIDI === 'undefined') {
            console.error('❌ MIDI ainda não disponível após carregamento');
            this.setupFallbackMode();
            return;
        }

        console.log('🎛️ Configurando plugin MIDI...');
        
        try {
            MIDI.loadPlugin({
                soundfontUrl: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/",
                instrument: "acoustic_guitar_nylon",
                onprogress: (state, progress) => {
                    console.log(`📦 Progresso MIDI: ${state} ${progress}%`);
                    if (progress < 100) {
                        this.updateStatus(`Carregando instrumentos: ${progress}%`, 'loading');
                    }
                },
                onsuccess: () => {
                    console.log('🎉 Plugin MIDI carregado com sucesso!');
                    this.isInitialized = true;
                    this.setVolume(this.volume);
                    this.updateStatus('✅ Player MIDI totalmente funcional!', 'success');
                    this.enableFullControls();
                },
                onerror: (err) => {
                    console.error('❌ Erro no plugin MIDI:', err);
                    this.updateStatus('❌ Sintetizador não disponível', 'error');
                    this.setupFallbackMode();
                }
            });
        } catch (error) {
            console.error('❌ Erro crítico no setup MIDI:', error);
            this.setupFallbackMode();
        }
    }

    enableFullControls() {
        const playBtn = document.getElementById('play-midi');
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-play"></i> Tocar';
            playBtn.disabled = false;
            playBtn.style.background = 'var(--success)';
        }
        
        // Atualiza todos os botões de play da lista
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.disabled = false;
            btn.title = 'Clique para tocar';
        });
    }

    async loadMidiListFromJSON() {
        try {
            const response = await fetch('midis.json');
            if (!response.ok) throw new Error('Arquivo não encontrado');
            
            this.midiFiles = await response.json();
            console.log(`✅ ${this.midiFiles.length} músicas carregadas`);
            this.renderMidiList();
            
        } catch (error) {
            console.error('Erro ao carregar lista:', error);
            this.useFallbackMidiList();
        }
    }

    useFallbackMidiList() {
        this.midiFiles = [
            { "name": "Hino Nacional Brasileiro", "file": "./midis/Hino_Nacional_Brasileiro.mid" },
            { "name": "Granados Bocetos No1", "file": "./midis/Granados_Bocetos_No1.mid" }
        ];
        this.renderMidiList();
    }

    renderMidiList() {
        const midiList = document.getElementById('midi-list');
        if (!midiList) return;

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
        document.querySelectorAll('.midi-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.play-btn')) {
                    this.selectTrack(parseInt(item.dataset.index));
                }
            });
        });

        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.currentTarget.dataset.index);
                this.selectTrack(index);
                this.playCurrentTrack();
            });
        });
    }

    setupEventListeners() {
        // Busca
        const searchInput = document.getElementById('midi-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterMidiList(e.target.value);
            });
        }

        // Controles
        const playBtn = document.getElementById('play-midi');
        const pauseBtn = document.getElementById('pause-midi');
        const stopBtn = document.getElementById('stop-midi');
        const volumeControl = document.getElementById('midi-volume');

        if (playBtn) playBtn.addEventListener('click', () => this.playCurrentTrack());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseMIDI());
        if (stopBtn) stopBtn.addEventListener('click', () => this.stopMIDI());
        if (volumeControl) {
            volumeControl.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }
    }

    filterMidiList(searchTerm) {
        document.querySelectorAll('.midi-item').forEach(item => {
            const name = item.querySelector('.midi-name').textContent.toLowerCase();
            item.style.display = name.includes(searchTerm.toLowerCase()) ? 'flex' : 'none';
        });
    }

    selectTrack(index) {
        document.querySelectorAll('.midi-item').forEach(item => item.classList.remove('active'));
        
        const selectedItem = document.querySelector(`.midi-item[data-index="${index}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
            this.currentTrack = this.midiFiles[index];
            this.updateCurrentTrackDisplay();
        }
    }

    updateCurrentTrackDisplay() {
        const element = document.getElementById('current-track');
        if (element && this.currentTrack) {
            element.textContent = `Selecionada: ${this.currentTrack.name}`;
        }
    }

    async playCurrentTrack() {
        if (!this.currentTrack) {
            this.updateStatus('⚠️ Selecione uma música', 'error');
            return;
        }

        if (!this.isInitialized) {
            this.updateStatus('❌ Sistema de áudio não disponível', 'error');
            return;
        }

        try {
            this.updateStatus(`🎵 Tocando: ${this.currentTrack.name}`, 'playing');
            this.stopMIDI();
            
            MIDI.Player.loadFile(this.currentTrack.file, () => {
                MIDI.Player.start();
                this.isPlaying = true;
                this.updatePlaybackState();
            });

        } catch (error) {
            console.error('Erro na reprodução:', error);
            this.updateStatus('❌ Erro ao reproduzir', 'error');
        }
    }

    pauseMIDI() {
        if (this.isPlaying && MIDI.Player) {
            MIDI.Player.pause();
            this.isPlaying = false;
            this.updatePlaybackState();
            this.updateStatus('⏸️ Pausado', 'info');
        }
    }

    stopMIDI() {
        if (MIDI.Player) MIDI.Player.stop();
        this.isPlaying = false;
        this.updatePlaybackState();
    }

    updatePlaybackState() {
        const playBtn = document.getElementById('play-midi');
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? 
                '<i class="fas fa-pause"></i> Pausar' : 
                '<i class="fas fa-play"></i> Tocar';
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (MIDI && MIDI.setVolume) MIDI.setVolume(0, volume);
    }

    updateStatus(message, type = 'info') {
        const element = document.getElementById('player-status');
        if (element) {
            element.textContent = message;
            element.className = `status-message ${type}`;
            console.log(`📢 ${message}`);
        }
    }
}

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎸 Inicializando Violão Pro...');
    window.midiPlayer = new MIDIPlayer();
});