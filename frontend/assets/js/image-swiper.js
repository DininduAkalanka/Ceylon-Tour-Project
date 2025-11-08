/**
 * Image Swiper JavaScript - Professional Tour Gallery Component
 * Features: Touch/Swipe support, Auto-play, Keyboard navigation, Thumbnails
 */

class ImageSwiper {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            console.error('Swiper container not found');
            return;
        }

        // Default options
        this.options = {
            autoPlay: true,
            autoPlayDelay: 5000,
            loop: true,
            touchThreshold: 50,
            keyboardNav: true,
            thumbnailNav: true,
            fadeEffect: false,
            pauseOnHover: true,
            lazyLoad: true,
            ...options
        };

        this.currentSlide = 0;
        this.isPlaying = this.options.autoPlay;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.autoPlayTimer = null;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateThumbnails();
        
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }

        // Preload first few images
        this.preloadImages();
        
        console.log('Image Swiper initialized successfully');
    }

    setupElements() {
        this.wrapper = this.container.querySelector('.swiper-wrapper');
        this.slides = Array.from(this.container.querySelectorAll('.swiper-slide'));
        this.prevBtn = this.container.querySelector('.swiper-prev');
        this.nextBtn = this.container.querySelector('.swiper-next');
        this.playPauseBtn = this.container.querySelector('#playPauseBtn');
        this.playIcon = this.playPauseBtn?.querySelector('.play-icon');
        this.pauseIcon = this.playPauseBtn?.querySelector('.pause-icon');
        this.paginationDots = Array.from(this.container.querySelectorAll('.pagination-dot'));
        this.currentSlideEl = this.container.querySelector('#currentSlide');
        this.totalSlidesEl = this.container.querySelector('#totalSlides');
        this.thumbnails = Array.from(document.querySelectorAll('.thumbnail'));

        // Set total slides
        if (this.totalSlidesEl) {
            this.totalSlidesEl.textContent = this.slides.length;
        }
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Play/Pause button
        this.playPauseBtn?.addEventListener('click', () => this.toggleAutoPlay());

        // Pagination dots
        this.paginationDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Thumbnail navigation
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch events for mobile swipe
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Mouse events for desktop drag
        this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.container.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

        // Keyboard navigation
        if (this.options.keyboardNav) {
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        // Pause on hover
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.container.addEventListener('mouseleave', () => {
                if (this.isPlaying) this.startAutoPlay();
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Handle visibility change (pause when tab is not visible)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else if (this.isPlaying) {
                this.startAutoPlay();
            }
        });
    }

    // Touch and Mouse Event Handlers
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.pauseAutoPlay();
        this.container.classList.add('touching');
    }

    handleTouchMove(e) {
        if (this.isTransitioning) return;
        
        const currentX = e.touches[0].clientX;
        const diff = this.touchStartX - currentX;
        
        // Add resistance effect
        const resistance = Math.min(Math.abs(diff) / 100, 1);
        const currentSlide = this.slides[this.currentSlide];
        
        if (currentSlide) {
            currentSlide.style.transform = `translateX(${-diff * resistance}px)`;
        }
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        this.container.classList.remove('touching');
        
        const diff = this.touchStartX - this.touchEndX;
        
        // Reset transform
        const currentSlide = this.slides[this.currentSlide];
        if (currentSlide) {
            currentSlide.style.transform = '';
        }
        
        if (Math.abs(diff) > this.options.touchThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        
        if (this.isPlaying) {
            setTimeout(() => this.startAutoPlay(), 1000);
        }
    }

    handleMouseDown(e) {
        if (e.button !== 0) return; // Only left mouse button
        this.touchStartX = e.clientX;
        this.isDragging = true;
        this.pauseAutoPlay();
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging || this.isTransitioning) return;
        
        const diff = this.touchStartX - e.clientX;
        const resistance = Math.min(Math.abs(diff) / 100, 1);
        const currentSlide = this.slides[this.currentSlide];
        
        if (currentSlide) {
            currentSlide.style.transform = `translateX(${-diff * resistance}px)`;
        }
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.touchEndX = e.clientX;
        this.isDragging = false;
        
        const diff = this.touchStartX - this.touchEndX;
        
        // Reset transform
        const currentSlide = this.slides[this.currentSlide];
        if (currentSlide) {
            currentSlide.style.transform = '';
        }
        
        if (Math.abs(diff) > this.options.touchThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        
        if (this.isPlaying) {
            setTimeout(() => this.startAutoPlay(), 1000);
        }
    }

    handleKeyDown(e) {
        if (this.isTransitioning) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoPlay();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.slides.length - 1);
                break;
        }
    }

    handleResize() {
        // Recalculate positions if needed
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.updateSlidePositions();
        }, 250);
    }

    // Navigation Methods
    nextSlide() {
        if (this.isTransitioning) return;
        
        const nextIndex = this.options.loop 
            ? (this.currentSlide + 1) % this.slides.length
            : Math.min(this.currentSlide + 1, this.slides.length - 1);
        
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        if (this.isTransitioning) return;
        
        const prevIndex = this.options.loop
            ? this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1
            : Math.max(this.currentSlide - 1, 0);
        
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide || index < 0 || index >= this.slides.length) {
            return;
        }

        this.isTransitioning = true;
        const previousSlide = this.currentSlide;
        this.currentSlide = index;

        // Update slide classes
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (i === this.currentSlide) {
                slide.classList.add('active');
            } else if (i === previousSlide) {
                slide.classList.add(i < this.currentSlide ? 'prev' : 'next');
            }
        });

        // Update UI elements
        this.updatePaginationDots();
        this.updateThumbnails();
        this.updateSlideCounter();

        // Preload nearby images
        this.preloadNearbyImages(index);

        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);

        // Trigger custom event
        this.container.dispatchEvent(new CustomEvent('slideChange', {
            detail: { 
                currentSlide: this.currentSlide, 
                previousSlide: previousSlide,
                slideData: this.getSlideData(this.currentSlide)
            }
        }));
    }

    // Auto-play Methods
    startAutoPlay() {
        if (!this.options.autoPlay || this.autoPlayTimer) return;
        
        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, this.options.autoPlayDelay);

        this.updatePlayPauseButton();
    }

    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
        
        this.updatePlayPauseButton();
    }

    updatePlayPauseButton() {
        if (!this.playIcon || !this.pauseIcon) return;
        
        if (this.isPlaying && this.autoPlayTimer) {
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
        } else {
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
        }
    }

    // UI Update Methods
    updatePaginationDots() {
        this.paginationDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    updateThumbnails() {
        this.thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentSlide);
        });
    }

    updateSlideCounter() {
        if (this.currentSlideEl) {
            this.currentSlideEl.textContent = this.currentSlide + 1;
        }
    }

    updateSlidePositions() {
        // Update slide positions for responsive changes
        this.slides.forEach((slide, index) => {
            if (index !== this.currentSlide) {
                slide.classList.remove('active', 'prev', 'next');
            }
        });
        
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
    }

    // Image Loading Methods
    preloadImages() {
        // Preload first 3 images
        for (let i = 0; i < Math.min(3, this.slides.length); i++) {
            this.preloadSlideImage(i);
        }
    }

    preloadNearbyImages(currentIndex) {
        // Preload current, next, and previous images
        for (let i = -1; i <= 1; i++) {
            const index = (currentIndex + i + this.slides.length) % this.slides.length;
            this.preloadSlideImage(index);
        }
    }

    preloadSlideImage(index) {
        const slide = this.slides[index];
        if (!slide) return;
        
        const img = slide.querySelector('.slide-image');
        if (!img || img.complete) return;
        
        img.classList.add('loading');
        
        const preloadImg = new Image();
        preloadImg.onload = () => {
            img.classList.remove('loading');
        };
        preloadImg.onerror = () => {
            img.classList.remove('loading');
            console.warn(`Failed to load image: ${img.src}`);
        };
        preloadImg.src = img.src;
    }

    // Utility Methods
    getSlideData(index) {
        const slide = this.slides[index];
        if (!slide) return null;
        
        const content = slide.querySelector('.slide-content');
        return {
            index,
            title: content?.querySelector('h3')?.textContent || '',
            description: content?.querySelector('p')?.textContent || '',
            image: slide.querySelector('.slide-image')?.src || ''
        };
    }

    getCurrentSlideData() {
        return this.getSlideData(this.currentSlide);
    }

    // Public API Methods
    destroy() {
        this.pauseAutoPlay();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        
        // Clear timers
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        
        console.log('Image Swiper destroyed');
    }

    // Configuration methods
    setAutoPlayDelay(delay) {
        this.options.autoPlayDelay = delay;
        if (this.isPlaying) {
            this.pauseAutoPlay();
            this.startAutoPlay();
        }
    }

    enableLoop(enable = true) {
        this.options.loop = enable;
    }

    getSlideCount() {
        return this.slides.length;
    }

    getCurrentSlideIndex() {
        return this.currentSlide;
    }
}

// Initialize swiper when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const swiperContainer = document.getElementById('tourSwiper');
    
    if (swiperContainer) {
        // Initialize the swiper with custom options
        const swiper = new ImageSwiper('#tourSwiper', {
            autoPlay: true,
            autoPlayDelay: 4000,
            loop: true,
            touchThreshold: 75,
            keyboardNav: true,
            pauseOnHover: true,
            lazyLoad: true
        });

        // Listen for slide changes
        swiperContainer.addEventListener('slideChange', function(e) {
            const { currentSlide, slideData } = e.detail;
            console.log(`Slide changed to: ${currentSlide + 1}`, slideData);
            
            // You can add custom logic here, like analytics tracking
            // trackSlideView(slideData.title);
        });

        // Handle explore button clicks
        document.querySelectorAll('.explore-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const slideData = swiper.getCurrentSlideData();
                console.log('Explore clicked for:', slideData.title);
                
                // Add your navigation logic here
                // For example, navigate to detailed page based on slide
                handleExploreClick(slideData);
            });
        });

        // Expose swiper to global scope for debugging
        window.tourSwiper = swiper;
    }
});

// Handle explore button functionality
function handleExploreClick(slideData) {
    const destinationPages = {
        'Sigiriya Rock Fortress': 'sigiriya-details.php',
        'Temple of the Tooth - Kandy': 'kandy-details.php',
        'Ella - Nine Arch Bridge': 'ella-details.php',
        'Galle Fort': 'galle-details.php',
        'Mirissa Beach': 'mirissa-details.php',
        'Yala National Park': 'yala-safari-details.php',
        'Nuwara Eliya': 'nuwara-eliya-details.php',
        'Dambulla Cave Temple': 'dambulla-details.php'
    };

    const page = destinationPages[slideData.title];
    if (page) {
        // Check if page exists, then navigate
        window.location.href = page;
    } else {
        // Fallback to a general booking page
        window.location.href = 'process_booking.php';
    }
}

// Utility functions for enhanced functionality
function createSwiperFromImages(images, containerId) {
    // Utility function to create a swiper from an array of image objects
    const container = document.getElementById(containerId);
    if (!container || !images.length) return null;

    // Generate HTML for slides
    const slidesHTML = images.map((img, index) => `
        <div class="swiper-slide ${index === 0 ? 'active' : ''}">
            <img src="${img.src}" alt="${img.alt || ''}" class="slide-image">
            <div class="slide-content">
                <h3>${img.title || ''}</h3>
                <p>${img.description || ''}</p>
                <button class="explore-btn">Explore Destination</button>
            </div>
        </div>
    `).join('');

    // Generate pagination dots
    const paginationHTML = images.map((_, index) => `
        <button class="pagination-dot ${index === 0 ? 'active' : ''}" 
                data-slide="${index}" 
                aria-label="Go to slide ${index + 1}"></button>
    `).join('');

    // Update container HTML
    const wrapper = container.querySelector('.swiper-wrapper');
    const pagination = container.querySelector('.swiper-pagination');
    
    if (wrapper) wrapper.innerHTML = slidesHTML;
    if (pagination) pagination.innerHTML = paginationHTML;

    // Initialize swiper
    return new ImageSwiper(container);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageSwiper;
}


 // Initialize home header swiper when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded, initializing swiper...');
            
            // Check if slides exist
            const slides = document.querySelectorAll('#homeSwiper .swiper-slide');
            console.log(`Found ${slides.length} slides`);
            
            // Check if images are loading
            slides.forEach((slide, index) => {
                const box = slide.querySelector('.box');
                if (box) {
                    const bgStyle = box.style.background;
                    console.log(`Slide ${index + 1} background:`, bgStyle);
                }
            });
            
            const homeSwiper = new ImageSwiper('#homeSwiper', {
                autoPlay: true,
                autoPlayDelay: 2000, // 1 second per slide
                loop: true,
                touchThreshold: 75,
                keyboardNav: true,
                pauseOnHover: true,
                lazyLoad: false // Since these are header images, load immediately
            });

            // Optional: Log slide changes
            document.getElementById('homeSwiper').addEventListener('slideChange', function(e) {
                const { currentSlide } = e.detail;
                console.log(`Home slider changed to slide: ${currentSlide + 1}`);
            });

            // Expose to global scope for debugging
            window.homeSwiper = homeSwiper;
        });