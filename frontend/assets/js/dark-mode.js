// IMMEDIATE light mode enforcement - prevent any dark mode flashing
(function() {
    // Force remove any dark mode classes immediately
    document.documentElement.classList.remove('dark-mode');
    if (document.body) {
        document.body.classList.remove('dark-mode');
    }
    
    // Clear ALL dark mode related storage
    localStorage.removeItem('darkMode');
    localStorage.removeItem('dark-mode');
    sessionStorage.removeItem('darkMode');
    sessionStorage.removeItem('dark-mode');
    
    // Force light mode styles
    const style = document.createElement('style');
    style.innerHTML = `
        body { 
            background: #f0f4f3 !important; 
            color: #333 !important; 
        }
        * { 
            transition: none !important; 
        }
    `;
    document.head.appendChild(style);
    
    // Remove the forced styles after a short delay to allow normal transitions
    setTimeout(() => {
        document.head.removeChild(style);
    }, 100);
})();

// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const body = document.body;
    
    // FORCE light mode as default - remove any dark mode classes immediately
    body.classList.remove('dark-mode');
    
    // Clear any stored dark mode preference to start fresh
    localStorage.removeItem('darkMode');
    
    // Always start in light mode - ignore any previous preferences
    disableDarkMode();
    
    // Only enable dark mode if user clicks the button (not on page load)
    
    // Mark that initial load is complete
    setTimeout(() => {
        body.setAttribute('data-loaded', 'true');
    }, 100);
    
    // Add click event listener to the dark mode button
    darkModeBtn.addEventListener('click', function() {
        // Add visual feedback
        darkModeBtn.style.pointerEvents = 'none';
        
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
            showModeToast('Light mode enabled');
        } else {
            enableDarkMode();
            showModeToast('Dark mode enabled');
        }
        
        // Re-enable clicking after animation
        setTimeout(() => {
            darkModeBtn.style.pointerEvents = 'auto';
        }, 300);
    });
    
    // Function to show mode change toast
    function showModeToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.mode-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'mode-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-color);
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow-color);
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            border: 1px solid var(--border-color);
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        // Hide toast after 2 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 2000);
    }
    
    // Function to enable dark mode
    function enableDarkMode() {
        body.classList.add('dark-mode');
        
        // Change to sun icon (indicating light mode is available)
        const icon = darkModeBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        
        darkModeBtn.setAttribute('aria-pressed', 'true');
        darkModeBtn.title = 'Switch to Light Mode';
        localStorage.setItem('darkMode', 'true');
        
        // Add smooth animation only if not initial load
        if (body.hasAttribute('data-loaded')) {
            darkModeBtn.style.transform = 'rotate(180deg) scale(1.1)';
            setTimeout(() => {
                darkModeBtn.style.transform = 'rotate(180deg) scale(1)';
            }, 200);
        }
    }
    
    // Function to disable dark mode (set to light mode)
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        
        // Ensure moon icon is shown (indicating dark mode is available)
        const icon = darkModeBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        
        darkModeBtn.setAttribute('aria-pressed', 'false');
        darkModeBtn.title = 'Switch to Dark Mode';
        localStorage.setItem('darkMode', 'false');
        
        // Add smooth animation only if not initial load
        if (body.hasAttribute('data-loaded')) {
            darkModeBtn.style.transform = 'rotate(-180deg) scale(1.1)';
            setTimeout(() => {
                darkModeBtn.style.transform = 'rotate(0deg) scale(1)';
            }, 200);
        }
    }
    
    // System preference detection removed - Always default to light mode
    // Dark mode is now purely user choice, not automatic
    
    // Add keyboard shortcut (Ctrl+Shift+D)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            darkModeBtn.click();
        }
    });
});

// Additional utility functions
const darkModeUtils = {
    // Get current dark mode status
    isEnabled: function() {
        return document.body.classList.contains('dark-mode');
    },
    
    // Toggle dark mode programmatically
    toggle: function() {
        const darkModeBtn = document.getElementById('dark-mode-btn');
        if (darkModeBtn) {
            darkModeBtn.click();
        }
    },
    
    // Force enable dark mode
    enable: function() {
        if (!this.isEnabled()) {
            this.toggle();
        }
    },
    
    // Force disable dark mode
    disable: function() {
        if (this.isEnabled()) {
            this.toggle();
        }
    }
};

// Make utils available globally
window.darkModeUtils = darkModeUtils;