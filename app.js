// ==========================
// Lista completa de acordes
// ==========================
const chords = [
  "C", "D", "E", "F", "G", "A", "B",
  "Cm", "Dm", "Em", "Fm", "Gm", "Am", "Bm",
  "C7", "D7", "E7", "F7", "G7", "A7", "B7"
];

// ==========================
// Utilitários
// ==========================
function getRandomChord() {
  return chords[Math.floor(Math.random() * chords.length)];
}

function getRandomOptions(correctChord, total = 4) {
  const options = new Set([correctChord]);
  while (options.size < total) {
    options.add(getRandomChord());
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}

// ==========================
// Quiz
// ==========================
let currentChord = null;

function startQuiz() {
  // Escolher acorde correto
  currentChord = getRandomChord();

  // Mostrar diagrama do acorde
  renderChord("quiz-chord-visualizer", currentChord);

  // Gerar opções
  const options = getRandomOptions(currentChord, 4);
  const optionsContainer = document.getElementById("quiz-options");
  optionsContainer.innerHTML = "";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.classList.add("quiz-option");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsContainer.appendChild(btn);
  });

  // Resetar feedback
  document.getElementById("quiz-feedback").innerText = "";
}

function checkAnswer(selected) {
  const feedback = document.getElementById("quiz-feedback");
  if (selected === currentChord) {
    feedback.innerText = "✅ Correto! Esse acorde é " + currentChord;
    feedback.style.color = "green";
  } else {
    feedback.innerText = "❌ Errado! O correto era " + currentChord;
    feedback.style.color = "red";
  }
}

// ==========================
// Visualizador de acordes
// ==========================
function setupChordSelector() {
  const select = document.getElementById("chord-select");
  chords.forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    renderChord("chord-visualizer", select.value);
  });

  // Mostrar primeiro acorde
  renderChord("chord-visualizer", chords[0]);
}

// ==========================
// Inicialização
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("new-quiz-btn");
  if (btn) {
    btn.addEventListener("click", startQuiz);
  }

  setupChordSelector();
  startQuiz();
});


/*------------------------------------------------------------------------------- */


// app.js - Violão Pro (Versão Melhorada)

class ViolaoApp {
    constructor() {
        this.currentTab = 'quiz';
        this.progress = 45;
        this.streakDays = 5;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        this.loadProgress();
        this.setupEventListeners();
        this.setupTabs();
        this.setupQuiz();
        this.setupVideoPlayer();
        this.setupRecording();
        this.setupNotifications();
        this.updateProgressDisplay();
        
        this.isInitialized = true;
        console.log('Violão Pro inicializado!');
    }

    setupEventListeners() {
        // Notificações
        document.getElementById('notificationsBtn')?.addEventListener('click', () => {
            this.showNotification('🔔 Você tem 2 novas atividades para praticar!');
        });

        // Perfil
        document.getElementById('profileBtn')?.addEventListener('click', () => {
            this.showNotification('👤 Perfil - Em desenvolvimento...');
        });

        // Módulos
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('start-btn')) {
                const moduleTitle = e.target.closest('.module-card')?.querySelector('.module-title')?.textContent;
                if (moduleTitle) this.startModule(moduleTitle);
            }
        });

        // Recursos
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const resource = e.target.closest('.resource-card')?.querySelector('.resource-title')?.textContent;
                if (resource) this.downloadResource(resource);
            });
        });

        this.setupPWA();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        const containers = document.querySelectorAll('.quiz-container, .challenge-container, .revision-container');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                // Atualizar aba ativa
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Mostrar container correspondente
                containers.forEach(container => {
                    container.classList.remove('active');
                    if (container.id === `${tabName}Tab`) {
                        container.classList.add('active');
                        this[`setup${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`]?.();
                    }
                });

                this.currentTab = tabName;
            });
        });
    }

    setupQuiz() {
        const options = document.querySelectorAll('#quizTab .option');
        const confirmBtn = document.getElementById('confirmQuiz');
        const skipBtn = document.getElementById('skipQuiz');
        const changeBtn = document.getElementById('changeAnswer');

        if (!options.length) return;

       let selectedOption = null;
          
    }

    

    

    

    

    setupRevision() {
        const startBtn = document.getElementById('startRevision');
        
        startBtn?.addEventListener('click', () => {
            this.showNotification('📚 Iniciando revisão dos acordes C, G e Am...', 'info');
            
            setTimeout(() => {
                this.showNotification('✅ Revisão concluída! Acordes praticados com sucesso.', 'success');
                this.updateProgress(5);
            }, 2000);
        });
    }

    setupVideoPlayer() {
        const playButton = document.getElementById('playButton');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const volumeBtn = document.getElementById('volumeBtn');
        const speedSelect = document.getElementById('speedSelect');

        playButton?.addEventListener('click', () => {
            playButton.style.display = 'none';
            const videoPlayer = document.querySelector('.video-player');
            if (videoPlayer) {
                videoPlayer.innerHTML = `
                    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#000;color:white;">
                        <div style="text-align:center;">
                            <div style="font-size:2rem;margin-bottom:1rem;">🎸</div>
                            <div>Reproduzindo: Acorde de Dó Maior</div>
                        </div>
                    </div>
                `;
                videoPlayer.style.background = '#000';
            }
        });

        fullscreenBtn?.addEventListener('click', () => {
            this.showNotification('🎥 Modo tela cheia ativado!');
        });

        volumeBtn?.addEventListener('click', () => {
            const icon = volumeBtn.querySelector('i');
            if (icon.classList.contains('fa-volume-up')) {
                icon.classList.replace('fa-volume-up', 'fa-volume-mute');
                this.showNotification('🔇 Áudio mutado');
            } else {
                icon.classList.replace('fa-volume-mute', 'fa-volume-up');
                this.showNotification('🔊 Áudio ativado');
            }
        });

        speedSelect?.addEventListener('change', (e) => {
            this.showNotification(`Velocidade alterada para: ${e.target.value}x`);
        });
    }

    setupRecording() {
        const recordButton = document.getElementById('recordButton');
        const playButton = document.getElementById('playRecording');
        const submitButton = document.getElementById('submitRecording');
        const timerElement = document.getElementById('recordingTimer');
        const visualizerBars = document.querySelectorAll('.visualizer-bar');
        
    }

    setupNotifications() {
        // CSS para notificações
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .violao-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                    font-weight: 500;
                }
                
                .notification-success { background: #4CAF50; }
                .notification-error { background: #F44336; }
                .notification-warning { background: #FF9800; }
                .notification-info { background: #2196F3; }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `violao-notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setupPWA() {
        const installButton = document.getElementById('installButton');
        const installAppButton = document.getElementById('installAppButton');
        const installPrompt = document.getElementById('installPrompt');
        const closePrompt = document.getElementById('closePrompt');

        installButton?.addEventListener('click', () => {
            if (installPrompt) installPrompt.style.display = 'block';
        });

        closePrompt?.addEventListener('click', () => {
            if (installPrompt) installPrompt.style.display = 'none';
        });

        installAppButton?.addEventListener('click', () => {
            if (installPrompt) installPrompt.style.display = 'none';
            this.showNotification('📱 App instalado! Agora você pode usar offline.', 'success');
        });
    }

    updateProgress(points) {
        this.progress = Math.min(this.progress + points, 100);
        this.streakDays++;
        this.updateProgressDisplay();
        this.saveProgress();

        // Verificar conquistas
        const badges = document.querySelectorAll('.badge');
        if (this.progress >= 50 && badges[1] && !badges[1].classList.contains('earned')) {
            badges[1].classList.add('earned');
            this.showNotification('🎉 Conquista desbloqueada: Ritmista!', 'success');
        }
        if (this.progress >= 75 && badges[2] && !badges[2].classList.contains('earned')) {
            badges[2].classList.add('earned');
            this.showNotification('🎉 Conquista desbloqueada: Solista!', 'success');
        }
    }

    updateProgressDisplay() {
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const streakDays = document.getElementById('streakDays');

        if (progressBar) progressBar.style.width = `${this.progress}%`;
        if (progressPercent) progressPercent.textContent = `${Math.round(this.progress)}% completo`;
        if (streakDays) streakDays.textContent = `${this.streakDays} dias seguidos`;
    }

    startModule(moduleTitle) {
        this.showNotification(`🎯 Iniciando: ${moduleTitle}`, 'info');
        this.updateProgress(5);
    }

    downloadResource(resourceName) {
        this.showNotification(`📥 Baixando: ${resourceName}`, 'info');
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('violaoPro_progress');
        const savedStreak = localStorage.getItem('violaoPro_streak');

        if (savedProgress) this.progress = parseInt(savedProgress);
        if (savedStreak) this.streakDays = parseInt(savedStreak);
    }

    saveProgress() {
        localStorage.setItem('violaoPro_progress', this.progress);
        localStorage.setItem('violaoPro_streak', this.streakDays);
    }
}

// Manter seu código original de tema
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle?.querySelector('i');
    
    if (!themeToggle || !icon) return;

    const currentTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                document.body.classList.remove('dark-mode');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    });

    // Inicializar a aplicação
    setTimeout(() => {
        window.violaoApp = new ViolaoApp();
        window.violaoApp.init();
    }, 100);
});