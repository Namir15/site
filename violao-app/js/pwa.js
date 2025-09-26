// PWA functionality
document.addEventListener('DOMContentLoaded', function() {
    const installButton = document.getElementById('installButton');
    const installAppButton = document.getElementById('installAppButton');
    const installPrompt = document.getElementById('installPrompt');
    const closePrompt = document.getElementById('closePrompt');
    
    let deferredPrompt;
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // Show install button
        installButton.style.display = 'flex';
    });
    
    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        } else {
            // Fallback: show custom prompt
            installPrompt.style.display = 'block';
        }
    });
    
    installAppButton.addEventListener('click', () => {
        // Simulate PWA installation
        installPrompt.style.display = 'none';
        alert('App instalado com sucesso! Agora você pode usar o Violão Pro offline.');
        
        // Hide install button after installation
        installButton.style.display = 'none';
    });
    
    closePrompt.addEventListener('click', () => {
        installPrompt.style.display = 'none';
    });
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installButton.style.display = 'none';
    });
});