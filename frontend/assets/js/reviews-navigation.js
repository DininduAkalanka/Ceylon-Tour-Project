/* Enhanced Reviews/Testimonials Navigation */

document.addEventListener('DOMContentLoaded', function() {
    const reviewsLink = document.querySelector('.reviews-link');
    const testimonialsSection = document.getElementById('testimonials');
    const navbar = document.querySelector('.header .navbar');
    
    if (reviewsLink && testimonialsSection) {
        reviewsLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile navbar if open
            if (navbar) {
                navbar.classList.remove('active');
            }
            
            // Add a subtle highlight effect before scrolling
            reviewsLink.style.transform = 'scale(1.1) translateY(-3px)';
            reviewsLink.style.boxShadow = '0 8px 25px rgba(255, 99, 71, 0.5)';
            
            setTimeout(() => {
                reviewsLink.style.transform = '';
                reviewsLink.style.boxShadow = '';
            }, 300);
            
            // Smooth scroll to testimonials with offset for fixed header
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 80;
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
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const navLink = document.querySelector(`[href="#${sectionId}"]`);
            
            if (section && navLink) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    // Remove active class from all nav links
                    document.querySelectorAll('.navbar a').forEach(link => {
                        link.classList.remove('nav-active');
                    });
                    
                    // Add active class to current section's nav link
                    navLink.classList.add('nav-active');
                }
            }
        });
    }
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    
    console.log('Reviews navigation enhanced');
});