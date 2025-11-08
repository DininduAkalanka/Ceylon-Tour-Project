let navbar = document.querySelector('.header .navbar');
document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.add('active');
}
document.querySelector('#nav-close').onclick = () =>{
    navbar.classList.remove('active');
}



// Function to handle header state on scroll
const handleHeaderScroll = () => {
    // Close mobile navbar if open
    navbar.classList.remove('active');
    
    const header = document.querySelector('.header');
    
    // Add header active class on scroll
    if (window.scrollY > 0) {
        header.classList.add('active');
    } else {
        header.classList.remove('active');
    }
};

// Add scroll event listener with passive option for better performance
window.addEventListener('scroll', handleHeaderScroll, { passive: true });

// Initial check when page loads
window.addEventListener('load', handleHeaderScroll);

// handle increase/decrease buttons for adults & children
document.querySelectorAll('.increase').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    target.value = parseInt(target.value) + 1;
  });
});

document.querySelectorAll('.decrease').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (parseInt(target.value) > 0) { // don't go below 0
      target.value = parseInt(target.value) - 1;
    }
  });
});

// Enhanced Reviews/Testimonials Navigation
document.addEventListener('DOMContentLoaded', function() {
    const reviewsLink = document.querySelector('.reviews-link');
    const testimonialsSection = document.getElementById('testimonials');
    
    if (reviewsLink && testimonialsSection) {
        reviewsLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile navbar if open
            navbar.classList.remove('active');
            
            // Add a subtle highlight effect before scrolling
            reviewsLink.style.transform = 'scale(1.1) translateY(-3px)';
            reviewsLink.style.boxShadow = '0 8px 25px rgba(255, 99, 71, 0.5)';
            
            setTimeout(() => {
                reviewsLink.style.transform = '';
                reviewsLink.style.boxShadow = '';
            }, 300);
            
            // Smooth scroll to testimonials with offset for fixed header
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = testimonialsSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Highlight testimonials section briefly
            setTimeout(() => {
                testimonialsSection.style.boxShadow = '0 0 30px rgba(255, 99, 71, 0.3)';
                testimonialsSection.style.transform = 'scale(1.01)';
                testimonialsSection.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    testimonialsSection.style.boxShadow = '';
                    testimonialsSection.style.transform = '';
                }, 1000);
            }, 800);
            
            console.log('Navigating to testimonials section');
        });
    }
    
    // Add active state to navbar links based on scroll position
    function updateActiveNavLink() {
        const sections = ['home', 'category', 'packages', 'testimonials', 'contact'];
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const scrollPos = window.scrollY + headerHeight + 50;
        
        let currentActiveSection = null;
        let minDistance = Infinity;
        
        // Find the section that's currently in view
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                // Check if section is in viewport
                if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
                    const distanceFromTop = Math.abs(scrollPos - sectionTop);
                    if (distanceFromTop < minDistance) {
                        minDistance = distanceFromTop;
                        currentActiveSection = sectionId;
                    }
                }
            }
        });
        
        // If no section is exactly in view, find the closest one
        if (!currentActiveSection) {
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const distance = Math.abs(scrollPos - sectionTop);
                    if (distance < minDistance) {
                        minDistance = distance;
                        currentActiveSection = sectionId;
                    }
                }
            });
        }
        
        // Update nav links
        if (currentActiveSection) {
            // Remove active class from all nav links
            document.querySelectorAll('.navbar a').forEach(link => {
                link.classList.remove('nav-active');
            });
            
            // Add active class to current section's nav link
            const activeNavLink = document.querySelector(`[href="#${currentActiveSection}"]`);
            if (activeNavLink) {
                activeNavLink.classList.add('nav-active');
                console.log('Active section:', currentActiveSection);
            }
        }
    }
    
    // Enhanced scroll event with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveNavLink();
        }, 10);
    }, { passive: true });
    
    // Initial call to set active state
    updateActiveNavLink();
    
    console.log('Reviews navigation enhanced with improved scroll detection');
});