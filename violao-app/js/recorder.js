// Audio recording functionality
document.addEventListener('DOMContentLoaded', function() {
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
            
            // Simulate recording start (in a real app, this would use the MediaRecorder API)
            console.log('Recording started...');
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
            
            // Simulate recording stop
            console.log('Recording stopped. Duration: ' + recordingTime + ' seconds');
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
});