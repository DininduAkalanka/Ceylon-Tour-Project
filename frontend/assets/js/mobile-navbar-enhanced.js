// Enhanced Mobile Navbar Animation
// Simple addition to existing navbar functionality
// Only applies to mobile devices

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.header .navbar');
    const menuBtn = document.querySelector('#menu-btn');
    const navClose = document.querySelector('#nav-close');
    const navItems = document.querySelectorAll('.header .navbar .nav-list li');

    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Function to trigger staggered animations when navbar opens
    function triggerNavItemAnimations() {
        navItems.forEach((item, index) => {
            // Reset animation state
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            
            // Trigger staggered animation
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, (index + 1) * 100);
        });
    }

    // Function to reset nav items when closing
    function resetNavItemAnimations() {
        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                item.style.opacity = '0';
                item.style.transform = 'translateX(-30px)';
            }, index * 50);
        });
    }

    // Enhanced menu button click handler (mobile only)
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            if (isMobile()) {
                navbar.classList.add('active');
                // Trigger staggered animations after navbar is visible
                setTimeout(triggerNavItemAnimations, 100);
            }
        });
    }

    // Enhanced close button click handler (mobile only)
    if (navClose) {
        navClose.addEventListener('click', function() {
            if (isMobile()) {
                resetNavItemAnimations();
                // Remove active class after animations start
                setTimeout(() => {
                    navbar.classList.remove('active');
                }, 200);
            }
        });
    }

    // Close navbar when clicking nav links (mobile only)
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            link.addEventListener('click', function() {
                if (isMobile()) {
                    resetNavItemAnimations();
                    setTimeout(() => {
                        navbar.classList.remove('active');
                    }, 200);
                }
            });
        }
    });

    // Close navbar when clicking outside (mobile only)
    document.addEventListener('click', function(event) {
        if (isMobile() && navbar.classList.contains('active') && 
            !navbar.contains(event.target) && 
            !menuBtn.contains(event.target)) {
            resetNavItemAnimations();
            setTimeout(() => {
                navbar.classList.remove('active');
            }, 200);
        }
    });

    // Close navbar with Escape key (mobile only)
    document.addEventListener('keydown', function(event) {
        if (isMobile() && event.key === 'Escape' && navbar.classList.contains('active')) {
            resetNavItemAnimations();
            setTimeout(() => {
                navbar.classList.remove('active');
            }, 200);
        }
    });

    // Handle window resize to reset animations if switching from mobile to desktop
    window.addEventListener('resize', function() {
        if (!isMobile() && navbar.classList.contains('active')) {
            // Remove mobile active state when switching to desktop
            navbar.classList.remove('active');
            // Reset nav item styles for desktop
            navItems.forEach(item => {
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
            });
        }
    });
});