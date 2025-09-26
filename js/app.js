// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    initTabs();
    initQuiz();
    initChallenge();
    initVideoPlayer();
    
    // Simulate progress animation
    setTimeout(() => {
        document.getElementById('progressBar').style.width = '45%';
    }, 500);
    
    // Initialize metronome for challenge
    initMetronome();
});

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

// Quiz functionality
function initQuiz() {
    const options = document.querySelectorAll('#quizTab .option');
    const confirmBtn = document.getElementById('confirmQuiz');
    const skipBtn = document.getElementById('skipQuiz');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    confirmBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('#quizTab .option.selected');
        if (!selectedOption) {
            alert('Por favor, selecione uma opção antes de confirmar.');
            return;
        }
        
        const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
        
        if (isCorrect) {
            selectedOption.style.borderColor = 'var(--success)';
            selectedOption.style.background = 'rgba(76, 175, 80, 0.1)';
            alert('Resposta correta! Parabéns!');
            
            // Simulate points increase
            updateProgress(10);
        } else {
            selectedOption.style.borderColor = 'var(--danger)';
            selectedOption.style.background = 'rgba(244, 67, 54, 0.1)';
            alert('Resposta incorreta. Tente novamente!');
            
            // Find correct answer and highlight it
            const correctOption = document.querySelector('#quizTab .option[data-correct="true"]');
            correctOption.style.borderColor = 'var(--success)';
            correctOption.style.background = 'rgba(76, 175, 80, 0.1)';
        }
        
        // Disable options after answer
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        confirmBtn.disabled = true;
    });
    
    skipBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja pular esta questão?')) {
            // Reset quiz for next time
            options.forEach(option => {
                option.classList.remove('selected');
                option.style.pointerEvents = 'auto';
                option.style.borderColor = '';
                option.style.background = '';
            });
            confirmBtn.disabled = false;
        }
    });
}

// Challenge functionality
function initChallenge() {
    const startBtn = document.getElementById('startChallenge');
    const submitBtn = document.getElementById('submitChallenge');
    
    startBtn.addEventListener('click', () => {
        startBtn.disabled = true;
        submitBtn.disabled = false;
        
        // Simulate challenge start
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

// Video player functionality
function initVideoPlayer() {
    const playButton = document.getElementById('playButton');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const speedSelect = document.getElementById('speedSelect');
    
    playButton.addEventListener('click', () => {
        // Simulate video play
        playButton.style.display = 'none';
        document.querySelector('.video-player').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #000; color: white; font-size: 1.2rem;">Vídeo sendo reproduzido...</div>';
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
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
        }
    });
    
    speedSelect.addEventListener('change', (e) => {
        alert(`Velocidade alterada para: ${e.target.value}x`);
    });
}

// Metronome functionality
function initMetronome() {
    const beats = document.querySelectorAll('.metronome-beat');
    let currentBeat = 0;
    
    // Simulate metronome animation
    setInterval(() => {
        beats.forEach(beat => beat.classList.remove('active'));
        beats[currentBeat].classList.add('active');
        
        currentBeat = (currentBeat + 1) % beats.length;
    }, 500);
}

// Progress update function
function updateProgress(points) {
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    
    // Get current progress
    let currentWidth = parseFloat(progressBar.style.width) || 45;
    let newWidth = Math.min(currentWidth + (points / 2), 100);
    
    // Update progress bar
    progressBar.style.width = `${newWidth}%`;
    
    // Update progress text
    progressPercent.textContent = `${Math.round(newWidth)}% completo`;
    
    // Check for achievements
    if (newWidth >= 50) {
        document.querySelectorAll('.badge')[1].classList.add('earned');
    }
    if (newWidth >= 75) {
        document.querySelectorAll('.badge')[2].classList.add('earned');
    }
    
    // Update streak if this is first activity of day
    const streakDays = document.getElementById('streakDays');
    const currentStreak = parseInt(streakDays.textContent) || 5;
    streakDays.textContent = `${currentStreak + 1} dias seguidos`;
}