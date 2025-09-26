// Conteúdo JS completo fornecido anteriormente// app.js - Funcionalidades principais do Violão Pro

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
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
    
    // Listen for system theme changes
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

    // Initialize modules
    initProgress();
    initTabs();
    initVideoPlayer();
    initRecording();
    initResources();
    initPWA();
    
    // Simulate progress animation
    setTimeout(() => {
        document.getElementById('progressBar').style.width = '45%';
    }, 500);
});

// Progress functionality
function initProgress() {
    // Progress will be updated by other functions
}

// Tab functionality
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const containers = document.querySelectorAll('.quiz-container, .challenge-container, .revision-container');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding container
            containers.forEach(container => {
                container.classList.remove('active');
                if (container.id === `${tabName}Tab`) {
                    container.classList.add('active');
                }
            });
        });
    });
}

// Video player functionality
function initVideoPlayer() {
    const playButton = document.getElementById('playButton');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const speedSelect = document.getElementById('speedSelect');
    
    playButton.addEventListener('click', () => {
        // Simulate video play
        playButton.style.display = 'none';
        const videoPlayer = document.querySelector('.video-player');
        videoPlayer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #000; color: white; font-size: 1.2rem;">🎸 Vídeo: Acorde de Dó Maior</div>';
        videoPlayer.style.background = '#000';
    });
    
    fullscreenBtn.addEventListener('click', () => {
        alert('Modo de tela cheia ativado!');
    });
    
    volumeBtn.addEventListener('click', () => {
        // Toggle volume icon
        const icon = volumeBtn.querySelector('i');
        if (icon.classList.contains('fa-volume-up')) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
            alert('Áudio mutado');
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            alert('Áudio ativado');
        }
    });
    
    speedSelect.addEventListener('change', (e) => {
        alert(`Velocidade alterada para: ${e.target.value}x`);
    });
}

// Challenge functionality
function initChallenge() {
    const startBtn = document.getElementById('startChallenge');
    const submitBtn = document.getElementById('submitChallenge');
    
    if (!startBtn) return;
    
    startBtn.addEventListener('click', () => {
        startBtn.disabled = true;
        submitBtn.disabled = false;
        
        // Simulate metronome
        const beats = document.querySelectorAll('.metronome-beat');
        let currentBeat = 0;
        
        const metronomeInterval = setInterval(() => {
            beats.forEach(beat => beat.classList.remove('active'));
            beats[currentBeat].classList.add('active');
            currentBeat = (currentBeat + 1) % beats.length;
        }, 500);
        
        // Stop after 20 seconds
        setTimeout(() => {
            clearInterval(metronomeInterval);
            startBtn.disabled = false;
            submitBtn.disabled = true;
        }, 20000);
        
        alert('Desafio iniciado! Toque o acorde de Am no ritmo do metrônomo.');
    });
    
    submitBtn.addEventListener('click', () => {
        // Simulate challenge evaluation
        const success = Math.random() > 0.3; // 70% chance of success
        
        if (success) {
            alert('Parabéns! Você completou o desafio com sucesso!');
            updateProgress(15);
        } else {
            alert('Quase lá! Tente novamente para melhorar seu timing.');
        }
        
        // Reset challenge
        startBtn.disabled = false;
        submitBtn.disabled = true;
    });
}

// Recording functionality
function initRecording() {
    const recordButton = document.getElementById('recordButton');
    const playButton = document.getElementById('playRecording');
    const submitButton = document.getElementById('submitRecording');
    const timerElement = document.getElementById('recordingTimer');
    const visualizerBars = document.querySelectorAll('.visualizer-bar');
    
    let isRecording = false;
    let recordingTime = 0;
    let timerInterval;
    let visualizerInterval;
    
    recordButton.addEventListener('click', toggleRecording);
    playButton.addEventListener('click', playRecording);
    submitButton.addEventListener('click', submitRecording);
    
    function toggleRecording() {
        if (!isRecording) {
            // Start recording
            isRecording = true;
            recordButton.classList.add('recording');
            recordButton.innerHTML = '<i class="fas fa-stop"></i>';
            
            // Start timer
            recordingTime = 0;
            timerInterval = setInterval(updateTimer, 1000);
            
            // Start visualizer animation
            visualizerInterval = setInterval(updateVisualizer, 200);
            
            // Enable buttons
            playButton.disabled = true;
            submitButton.disabled = true;
        } else {
            // Stop recording
            isRecording = false;
            recordButton.classList.remove('recording');
            recordButton.innerHTML = '<i class="fas fa-microphone"></i>';
            
            // Stop timer and visualizer
            clearInterval(timerInterval);
            clearInterval(visualizerInterval);
            
            // Enable playback and submission
            playButton.disabled = false;
            submitButton.disabled = false;
        }
    }
    
    function updateTimer() {
        recordingTime++;
        
        if (recordingTime >= 60) {
            // Auto-stop at 60 seconds
            toggleRecording();
            alert('Gravação automática parada após 60 segundos.');
            return;
        }
        
        const minutes = Math.floor(recordingTime / 60);
        const seconds = recordingTime % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function updateVisualizer() {
        visualizerBars.forEach(bar => {
            // Random height for visual effect
            const randomHeight = 5 + Math.random() * 30;
            bar.style.height = `${randomHeight}px`;
        });
    }
    
    function playRecording() {
        // Simulate playback
        alert('Reproduzindo gravação...');
    }
    
    function submitRecording() {
        // Simulate submission and evaluation
        const score = Math.floor(Math.random() * 100);
        
        if (score >= 70) {
            alert(`Ótimo trabalho! Sua performance recebeu ${score} pontos.`);
            updateProgress(score / 5);
        } else {
            alert(`Sua performance recebeu ${score} pontos. Tente novamente para melhorar!`);
        }
        
        // Reset recording UI
        recordingTime = 0;
        timerElement.textContent = '00:00';
        playButton.disabled = true;
        submitButton.disabled = true;
        
        // Reset visualizer
        visualizerBars.forEach(bar => {
            bar.style.height = '';
        });
    }
}

// Resources functionality
function initResources() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const resourceType = button.querySelector('i').classList.contains('fa-share-alt') ? 'compartilhar' : 'baixar';
            alert(`Recurso será ${resourceType}do! Em uma versão real, isso faria o download do arquivo.`);
        });
    });
}

// PWA functionality
function initPWA() {
    const installButton = document.getElementById('installButton');
    const installAppButton = document.getElementById('installAppButton');
    const installPrompt = document.getElementById('installPrompt');
    const closePrompt = document.getElementById('closePrompt');
    
    if (!installButton) return;
    
    installButton.addEventListener('click', () => {
        installPrompt.style.display = 'block';
    });
    
    closePrompt.addEventListener('click', () => {
        installPrompt.style.display = 'none';
    });
    
    installAppButton.addEventListener('click', () => {
        // Simulate PWA installation
        installPrompt.style.display = 'none';
        alert('App instalado com sucesso! Agora você pode usar o Violão Pro offline.');
    });
}

// Progress update function
function updateProgress(points) {
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const streakDays = document.getElementById('streakDays');
    
    // Get current progress
    let currentWidth = parseFloat(progressBar.style.width) || 45;
    let newWidth = Math.min(currentWidth + (points / 2), 100);
    
    // Update progress bar
    progressBar.style.width = `${newWidth}%`;
    
    // Update progress text
    progressPercent.textContent = `${Math.round(newWidth)}% completo`;
    
    // Check for achievements
    const badges = document.querySelectorAll('.badge');
    if (newWidth >= 50 && !badges[1].classList.contains('earned')) {
        badges[1].classList.add('earned');
        alert('🎉 Conquista desbloqueada: Ritmista!');
    }
    if (newWidth >= 75 && !badges[2].classList.contains('earned')) {
        badges[2].classList.add('earned');
        alert('🎉 Conquista desbloqueada: Solista!');
    }
    
    // Update streak
    const currentStreak = parseInt(streakDays.textContent) || 5;
    streakDays.textContent = `${currentStreak + 1} dias seguidos`;
}

// Module buttons functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('start-btn')) {
        const moduleTitle = e.target.closest('.module-card').querySelector('.module-title').textContent;
        alert(`Iniciando: ${moduleTitle}`);
    }
});

// Notification button
document.getElementById('notificationsBtn')?.addEventListener('click', () => {
    alert('🔔 Notificações - Você tem 2 novas atividades para praticar!');
});

// Profile button
document.getElementById('profileBtn')?.addEventListener('click', () => {
    alert('👤 Perfil - Aqui você pode editar suas informações e preferências');
});

// Initialize challenge when tab is clicked
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tab') && e.target.getAttribute('data-tab') === 'challenge') {
        setTimeout(initChallenge, 100);
    }
});

// Revision functionality
document.getElementById('startRevision')?.addEventListener('click', () => {
    alert('🎯 Iniciando revisão de acordes... Pratique C, G e Am!');
});