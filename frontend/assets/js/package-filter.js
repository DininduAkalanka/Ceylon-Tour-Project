// Professional Tour Package Filter System
class TourPackageFilter {
    constructor() {
        this.packages = [];
        this.filteredPackages = [];
        this.activeFilters = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeFilter());
        } else {
            this.initializeFilter();
        }
    }
    
    initializeFilter() {
        this.cacheElements();
        this.bindEvents();
        this.initializePackages();
        this.updatePriceRange();
        this.updateResultsCount();
        this.updateButtonStates();
        this.isInitialized = true;
        
        console.log('Tour Package Filter System Initialized');
    }
    
    cacheElements() {
        // Filter elements
        this.elements = {
            searchInput: document.getElementById('packageSearch'),
            destinationSelect: document.getElementById('destinationFilter'),
            daysSelect: document.getElementById('daysFilter'),
            minPriceInput: document.getElementById('minPrice'),
            maxPriceInput: document.getElementById('maxPrice'),
            priceSlider: document.getElementById('priceRange'),
            priceValue: document.getElementById('priceValue'),
            clearBtn: document.getElementById('clearFilters'),
            applyBtn: document.getElementById('applyFilters'),
            resultsCount: document.getElementById('resultsCount'),
            activeFilters: document.getElementById('activeFilters'),
            packageContainer: document.querySelector('.packages .box-container'),
            packages: document.querySelectorAll('.packages .box')
        };
    }
    
    bindEvents() {
        if (!this.elements.searchInput) return;
        
        // Search input - real-time filtering
        this.elements.searchInput.addEventListener('input', 
            this.debounce(() => this.handleSearch(), 300));
        
        // Dropdown filters
        this.elements.destinationSelect.addEventListener('change', () => this.handleFilterChange());
        this.elements.daysSelect.addEventListener('change', () => this.handleFilterChange());
        
        // Price range inputs
        this.elements.minPriceInput.addEventListener('input', 
            this.debounce(() => this.handlePriceChange(), 300));
        this.elements.maxPriceInput.addEventListener('input', 
            this.debounce(() => this.handlePriceChange(), 300));
        this.elements.priceSlider.addEventListener('input', () => this.handleSliderChange());
        
        // Action buttons
        this.elements.clearBtn.addEventListener('click', () => this.clearAllFilters());
        this.elements.applyBtn.addEventListener('click', () => this.applyFilters());
        
        // Enter key support
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.applyFilters();
            }
        });
    }
    
    initializePackages() {
        this.packages = Array.from(this.elements.packages).map(packageEl => ({
            element: packageEl,
            price: parseInt(packageEl.dataset.price) || 0,
            days: parseInt(packageEl.dataset.days) || 0,
            destination: packageEl.dataset.destination || '',
            keywords: packageEl.dataset.keywords || '',
            title: packageEl.querySelector('h3')?.textContent || '',
            description: packageEl.querySelector('p')?.textContent || ''
        }));
        
        this.filteredPackages = [...this.packages];
    }
    
    updatePriceRange() {
        if (this.packages.length === 0) return;
        
        const prices = this.packages.map(pkg => pkg.price).filter(price => price > 0);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // Update slider attributes
        this.elements.priceSlider.min = minPrice;
        this.elements.priceSlider.max = maxPrice;
        this.elements.priceSlider.value = maxPrice;
        
        // Update input placeholders
        this.elements.minPriceInput.placeholder = `$${minPrice}`;
        this.elements.maxPriceInput.placeholder = `$${maxPrice}`;
        
        // Update price display
        this.elements.priceValue.textContent = `Up to $${maxPrice}`;
    }
    
    handleSearch() {
        this.activeFilters.search = this.elements.searchInput.value.toLowerCase().trim();
        this.updateActiveFilters();
        this.filterPackages();
        this.updateButtonStates();
    }
    
    handleFilterChange() {
        this.activeFilters.destination = this.elements.destinationSelect.value;
        this.activeFilters.days = this.elements.daysSelect.value;
        this.updateActiveFilters();
        this.filterPackages();
        this.updateButtonStates();
    }
    
    handlePriceChange() {
        const minPrice = parseInt(this.elements.minPriceInput.value) || 0;
        const maxPrice = parseInt(this.elements.maxPriceInput.value) || Infinity;
        
        this.activeFilters.minPrice = minPrice > 0 ? minPrice : null;
        this.activeFilters.maxPrice = maxPrice < Infinity ? maxPrice : null;
        
        // Update slider if max price is set
        if (maxPrice < Infinity) {
            this.elements.priceSlider.value = maxPrice;
            this.elements.priceValue.textContent = `Up to $${maxPrice}`;
        }
        
        this.updateActiveFilters();
        this.filterPackages();
        this.updateButtonStates();
    }
    
    handleSliderChange() {
        const sliderValue = parseInt(this.elements.priceSlider.value);
        this.elements.priceValue.textContent = `Up to $${sliderValue}`;
        this.elements.maxPriceInput.value = sliderValue;
        
        this.activeFilters.maxPrice = sliderValue;
        this.updateActiveFilters();
        this.filterPackages();
        this.updateButtonStates();
    }
    
    filterPackages() {
        this.filteredPackages = this.packages.filter(pkg => {
            // Search filter
            if (this.activeFilters.search) {
                const searchTerms = this.activeFilters.search.split(' ');
                const searchableText = `${pkg.title} ${pkg.description} ${pkg.keywords}`.toLowerCase();
                const matchesSearch = searchTerms.every(term => 
                    term.length === 0 || searchableText.includes(term));
                if (!matchesSearch) return false;
            }
            
            // Destination filter
            if (this.activeFilters.destination && pkg.destination !== this.activeFilters.destination) {
                return false;
            }
            
            // Days filter
            if (this.activeFilters.days) {
                const daysRange = this.activeFilters.days;
                const packageDays = pkg.days;
                
                switch (daysRange) {
                    case '1-3':
                        if (packageDays < 1 || packageDays > 3) return false;
                        break;
                    case '4-6':
                        if (packageDays < 4 || packageDays > 6) return false;
                        break;
                    case '7-9':
                        if (packageDays < 7 || packageDays > 9) return false;
                        break;
                    case '10+':
                        if (packageDays < 10) return false;
                        break;
                }
            }
            
            // Price filter
            if (this.activeFilters.minPrice && pkg.price < this.activeFilters.minPrice) {
                return false;
            }
            if (this.activeFilters.maxPrice && pkg.price > this.activeFilters.maxPrice) {
                return false;
            }
            
            return true;
        });
        
        this.updatePackageVisibility();
        this.updateResultsCount();
    }
    
    updatePackageVisibility() {
        const visiblePackages = new Set(this.filteredPackages.map(pkg => pkg.element));
        
        this.packages.forEach(pkg => {
            const isVisible = visiblePackages.has(pkg.element);
            
            if (isVisible) {
                pkg.element.classList.remove('filter-hidden');
                pkg.element.classList.add('filter-visible');
            } else {
                pkg.element.classList.remove('filter-visible');
                pkg.element.classList.add('filter-hidden');
            }
        });
        
        // Show/hide no results message
        this.toggleNoResultsMessage();
    }
    
    toggleNoResultsMessage() {
        let noResultsEl = document.querySelector('.no-results');
        
        if (this.filteredPackages.length === 0) {
            if (!noResultsEl) {
                noResultsEl = this.createNoResultsMessage();
                this.elements.packageContainer.parentNode.insertBefore(
                    noResultsEl, 
                    this.elements.packageContainer.nextSibling
                );
            }
            noResultsEl.style.display = 'block';
        } else {
            if (noResultsEl) {
                noResultsEl.style.display = 'none';
            }
        }
    }
    
    createNoResultsMessage() {
        const noResultsEl = document.createElement('div');
        noResultsEl.className = 'no-results';
        noResultsEl.innerHTML = `
            <div class="no-results-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No packages found</h3>
            <p>Try adjusting your filters or search terms to find the perfect Sri Lankan adventure.</p>
            <button class="btn" onclick="tourFilter.clearAllFilters()">Clear All Filters</button>
        `;
        return noResultsEl;
    }
    
    updateResultsCount() {
        const count = this.filteredPackages.length;
        this.elements.resultsCount.textContent = count;
        
        // Add animation to results count
        this.elements.resultsCount.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.elements.resultsCount.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateActiveFilters() {
        const activeFiltersContainer = this.elements.activeFilters;
        activeFiltersContainer.innerHTML = '';
        
        const filterLabels = {
            search: 'Search',
            destination: 'Destination',
            days: 'Duration',
            minPrice: 'Min Price',
            maxPrice: 'Max Price'
        };
        
        Object.entries(this.activeFilters).forEach(([key, value]) => {
            if (value && value !== '') {
                const filterTag = document.createElement('div');
                filterTag.className = 'filter-tag';
                
                let displayValue = value;
                if (key === 'minPrice' || key === 'maxPrice') {
                    displayValue = `$${value}`;
                } else if (key === 'destination') {
                    displayValue = this.getDestinationLabel(value);
                } else if (key === 'days') {
                    displayValue = this.getDaysLabel(value);
                }
                
                filterTag.innerHTML = `
                    <span>${filterLabels[key]}: ${displayValue}</span>
                    <span class="remove-filter" onclick="tourFilter.removeFilter('${key}')">&times;</span>
                `;
                
                activeFiltersContainer.appendChild(filterTag);
            }
        });
    }
    
    getDestinationLabel(value) {
        const labels = {
            'cultural': 'Cultural & Heritage',
            'beach': 'Beach & Coastal',
            'wildlife': 'Wildlife & Safari',
            'adventure': 'Adventure Tours',
            'tea-country': 'Tea Country',
            'mixed': 'Mixed Experience'
        };
        return labels[value] || value;
    }
    
    getDaysLabel(value) {
        const labels = {
            '1-3': '1-3 Days',
            '4-6': '4-6 Days',
            '7-9': '7-9 Days',
            '10+': '10+ Days'
        };
        return labels[value] || value;
    }
    
    removeFilter(filterKey) {
        delete this.activeFilters[filterKey];
        
        // Clear corresponding form field
        switch (filterKey) {
            case 'search':
                this.elements.searchInput.value = '';
                break;
            case 'destination':
                this.elements.destinationSelect.value = '';
                break;
            case 'days':
                this.elements.daysSelect.value = '';
                break;
            case 'minPrice':
                this.elements.minPriceInput.value = '';
                break;
            case 'maxPrice':
                this.elements.maxPriceInput.value = '';
                const maxPrice = Math.max(...this.packages.map(pkg => pkg.price));
                this.elements.priceSlider.value = maxPrice;
                this.elements.priceValue.textContent = `Up to $${maxPrice}`;
                break;
        }
        
        this.updateActiveFilters();
        this.filterPackages();
    }
    
    clearAllFilters() {
        // Add loading state
        this.elements.clearBtn.classList.add('loading');
        const clearIcon = this.elements.clearBtn.querySelector('i');
        const clearText = this.elements.clearBtn.querySelector('.btn-text');
        
        clearIcon.className = 'fas fa-spinner-third';
        clearText.textContent = 'Clearing...';
        
        setTimeout(() => {
            // Clear all form inputs
            this.elements.searchInput.value = '';
            this.elements.destinationSelect.value = '';
            this.elements.daysSelect.value = '';
            this.elements.minPriceInput.value = '';
            this.elements.maxPriceInput.value = '';
            
            // Reset price slider
            const maxPrice = Math.max(...this.packages.map(pkg => pkg.price));
            this.elements.priceSlider.value = maxPrice;
            this.elements.priceValue.textContent = `Up to $${maxPrice}`;
            
            // Clear active filters
            this.activeFilters = {};
            
            // Reset filtered packages
            this.filteredPackages = [...this.packages];
            
            // Update UI
            this.updateActiveFilters();
            this.updatePackageVisibility();
            this.updateResultsCount();
            this.updateButtonStates();
            
            // Success state animation
            this.elements.clearBtn.classList.remove('loading');
            this.elements.clearBtn.classList.add('success');
            clearIcon.className = 'fas fa-check';
            clearText.textContent = 'Cleared!';
            
            setTimeout(() => {
                this.elements.clearBtn.classList.remove('success');
                clearIcon.className = 'fas fa-undo-alt';
                clearText.textContent = 'Reset Filters';
            }, 1500);
            
        }, 800);
    }
    
    applyFilters() {
        // Add loading state
        this.elements.applyBtn.classList.add('loading');
        const applyIcon = this.elements.applyBtn.querySelector('i');
        const applyText = this.elements.applyBtn.querySelector('.btn-text');
        
        applyIcon.className = 'fas fa-spinner-third';
        applyText.textContent = 'Searching...';
        
        setTimeout(() => {
            // Apply filters
            this.filterPackages();
            
            // Success state
            this.elements.applyBtn.classList.remove('loading');
            this.elements.applyBtn.classList.add('success');
            applyIcon.className = 'fas fa-check-circle';
            applyText.textContent = `Found ${this.filteredPackages.length} Tours`;
            
            // Scroll to packages section with offset for filter section
            setTimeout(() => {
                const packagesSection = document.querySelector('.packages');
                if (packagesSection) {
                    const headerHeight = 80; // Account for sticky header
                    const filterHeight = 100; // Account for filter section
                    const targetPosition = packagesSection.offsetTop - headerHeight - filterHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 300);
            
            // Reset button state
            setTimeout(() => {
                this.elements.applyBtn.classList.remove('success');
                applyIcon.className = 'fas fa-search';
                applyText.textContent = 'Search Tours';
            }, 2500);
            
        }, 1000);
    }
    
    updateButtonStates() {
        const hasActiveFilters = Object.keys(this.activeFilters).some(key => 
            this.activeFilters[key] && this.activeFilters[key] !== '');
        
        // Update Clear button state
        if (hasActiveFilters) {
            this.elements.clearBtn.classList.add('has-filters');
            this.elements.clearBtn.style.opacity = '1';
            this.elements.clearBtn.disabled = false;
        } else {
            this.elements.clearBtn.classList.remove('has-filters');
            this.elements.clearBtn.style.opacity = '0.6';
            this.elements.clearBtn.disabled = true;
        }
        
        // Update Apply button state and text
        const applyText = this.elements.applyBtn.querySelector('.btn-text');
        const applyIcon = this.elements.applyBtn.querySelector('i');
        
        if (hasActiveFilters) {
            this.elements.applyBtn.classList.add('has-filters');
            applyText.textContent = 'Find Tours';
            applyIcon.className = 'fas fa-compass';
        } else {
            this.elements.applyBtn.classList.remove('has-filters');
            applyText.textContent = 'Browse All Tours';
            applyIcon.className = 'fas fa-globe-asia';
        }
    }
    
    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Public API methods
    getFilteredPackages() {
        return this.filteredPackages;
    }
    
    getActiveFilters() {
        return { ...this.activeFilters };
    }
    
    getTotalPackages() {
        return this.packages.length;
    }
    
    // Analytics/tracking method
    trackFilterUsage(filterType, filterValue) {
        // Can be extended for analytics tracking
        console.log(`Filter used: ${filterType} = ${filterValue}`);
    }
}

// Initialize the filter system
let tourFilter;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    tourFilter = new TourPackageFilter();
});

// Alternative initialization for immediate script loading
if (document.readyState !== 'loading') {
    tourFilter = new TourPackageFilter();
}

// Export for global access
window.tourFilter = tourFilter;