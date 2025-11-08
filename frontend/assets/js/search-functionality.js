/**
 * Enhanced Search Functionality
 * Provides real-time search across tour packages and destinations
 */

class TourSearch {
    constructor() {
        this.searchBtn = document.getElementById('search-btn');
        this.closeSearchBtn = document.getElementById('close-search');
        this.searchForm = document.querySelector('.search-form');
        this.searchInput = document.getElementById('search-box');
        this.searchableContent = [];
        this.isSearchOpen = false;
        
        this.init();
    }

    init() {
        this.collectSearchableContent();
        this.bindEvents();
        this.setupAutocomplete();
    }

    /**
     * Collect all searchable content from the page
     */
    collectSearchableContent() {
        try {
            // Collect actual package data from the page
            const packages = document.querySelectorAll('.packages .box');
            
            packages.forEach(pkg => {
                const title = pkg.querySelector('h3')?.textContent?.trim();
                const description = pkg.querySelector('p')?.textContent?.trim();
                const price = pkg.getAttribute('data-price');
                const days = pkg.getAttribute('data-days');
                const destination = pkg.getAttribute('data-destination');
                const keywords = pkg.getAttribute('data-keywords');
                const link = pkg.querySelector('a')?.href;
                
                if (title) {
                    this.searchableContent.push({
                        type: 'package',
                        title: title,
                        description: description || 'Tour package',
                        price: price ? `$${price}` : '',
                        duration: days ? `${days} Days` : '',
                        element: pkg,
                        link: link || '#packages',
                        packageLink: link,
                        keywords: (title + ' ' + (description || '') + ' ' + (keywords || '')).toLowerCase()
                    });
                }
            });

            // Collect adventure categories
            const categories = document.querySelectorAll('.category .box');
            categories.forEach(cat => {
                const title = cat.querySelector('h3')?.textContent?.trim();
                const description = cat.querySelector('p')?.textContent?.trim();
                
                if (title) {
                    this.searchableContent.push({
                        type: 'adventure',
                        title: title,
                        description: description || 'Adventure activity',
                        element: cat,
                        link: '#category',
                        keywords: (title + ' ' + (description || '')).toLowerCase()
                    });
                }
            });

            // Destination and attraction details with tour inclusions
            const destinationPackageMap = [
                {
                    name: 'Sigiriya Rock Fortress',
                    type: 'destination',
                    keywords: 'sigiriya rock fortress ancient unesco world heritage climbing',
                    relatedPackages: ['Sri Lanka Budget Tour Package', 'Sri Lanka 9 Day Tour Package', 'Highlights of Sri Lanka – 10 Days', 'Highlights of Sri Lanka 5 Days'],
                    description: 'UNESCO World Heritage Site featuring the legendary 5th-century rock citadel with stunning frescoes'
                },
                {
                    name: 'Kandy Temple of Tooth',
                    type: 'destination',
                    keywords: 'kandy temple tooth cultural buddhist sacred relic',
                    relatedPackages: ['Sri Lankan Heritage Tour', 'Sri Lanka 9 Day Tour Package', 'Highlights of Sri Lanka – 10 Days'],
                    description: 'Sacred temple housing the tooth relic of Lord Buddha, heart of Sri Lankan Buddhism'
                },
                {
                    name: 'Ella Train Journey',
                    type: 'activity',
                    keywords: 'ella train ride mountain scenic railway blue train tea country',
                    relatedPackages: ['Sri Lanka 9 Day Tour Package', 'Highlights of Sri Lanka – 10 Days'],
                    description: 'World-renowned scenic railway through emerald tea estates and misty mountains'
                },
                {
                    name: 'Mirissa Beach',
                    type: 'destination',
                    keywords: 'mirissa beach whale watching surfing coastal southern',
                    relatedPackages: ['Sri Lanka Beach Holiday', 'Sri Lanka 9 Day Tour Package', 'Highlights of Sri Lanka – 10 Days'],
                    description: 'Pristine golden beach renowned for blue whale watching and world-class surfing'
                },
                {
                    name: 'Yala National Park',
                    type: 'destination',
                    keywords: 'yala safari wildlife leopard national park animals elephant',
                    relatedPackages: ['Sri Lanka Budget Tour Package', 'Highlights of Sri Lanka 5 Days', 'Highlights of Sri Lanka – 10 Days'],
                    description: 'Sri Lanka\'s premier wildlife sanctuary with the world\'s highest leopard density'
                },
                {
                    name: 'Nuwara Eliya Tea Plantations',
                    type: 'destination',
                    keywords: 'nuwara eliya tea plantation highlands factory tour mountain',
                    relatedPackages: ['Sri Lanka Beach Holiday', 'Sri Lanka 9 Day Tour Package', 'Highlights of Sri Lanka – 10 Days'],
                    description: 'Historic hill station with colonial charm and world-famous Ceylon tea estates'
                },
                {
                    name: 'Galle Fort',
                    type: 'destination',
                    keywords: 'galle fort historical colonial architecture southern coast',
                    relatedPackages: ['Sri Lankan Heritage Tour', 'Sri Lanka 9 Day Tour Package'],
                    description: 'Well-preserved Dutch colonial fortress with cobblestone streets and ocean views'
                },
                {
                    name: 'Dambulla Cave Temple',
                    type: 'destination',
                    keywords: 'dambulla cave temple golden temple buddhist ancient',
                    relatedPackages: ['Highlights of Sri Lanka – 10 Days', 'Highlights of Sri Lanka 5 Days', 'Sri Lankan Heritage Tour'],
                    description: '2000-year-old cave monastery with magnificent Buddha statues and ancient murals'
                },
                {
                    name: 'Pinnawala Elephant Orphanage',
                    type: 'destination',
                    keywords: 'pinnawala elephant orphanage baby elephants feeding',
                    relatedPackages: ['Sri Lanka Beach Holiday', 'Sri Lanka Budget Tour Package'],
                    description: 'Renowned elephant sanctuary where orphaned elephants are cared for and rehabilitated'
                }
            ];

            // Add destination mappings to search content
            destinationPackageMap.forEach(dest => {
                this.searchableContent.push({
                    type: dest.type,
                    title: dest.name,
                    description: dest.description,
                    element: null,
                    link: '#packages',
                    relatedPackages: dest.relatedPackages,
                    keywords: dest.keywords
                });
            });

            // Tour categories and services
            const generalItems = [
                { name: 'Cultural & Heritage Tours', type: 'category', keywords: 'cultural heritage temple history tradition buddhist archaeological', section: '#packages' },
                { name: 'Beach & Coastal Holidays', type: 'category', keywords: 'beach holiday coastal relaxation swimming surfing diving snorkeling', section: '#packages' },
                { name: 'Wildlife & Nature Safaris', type: 'category', keywords: 'safari wildlife animals nature adventure leopard elephant bird watching', section: '#packages' },
                { name: 'Adventure & Active Tours', type: 'category', keywords: 'adventure hiking rafting zip line extreme sports trekking climbing', section: '#category' },
                { name: 'Guest Testimonials', type: 'page', keywords: 'reviews testimonials feedback customer experience ratings', section: '#testimonials' },
                { name: 'Plan Your Journey', type: 'page', keywords: 'contact booking inquiry support help consultation planning', section: '#contact' }
            ];

            generalItems.forEach(item => {
                this.searchableContent.push({
                    type: item.type,
                    title: item.name,
                    description: `Explore ${item.name.toLowerCase()}`,
                    element: null,
                    link: item.section,
                    keywords: item.keywords
                });
            });

            console.log(`Collected ${this.searchableContent.length} searchable items`);
        } catch (error) {
            console.error('Error collecting searchable content:', error);
        }
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Search button click
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSearch();
            });
        }

        // Close search button
        if (this.closeSearchBtn) {
            this.closeSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSearchModal();
            });
        }

        // Close search with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isSearchOpen) {
                this.closeSearchModal();
            }
        });

        // Close search when clicking outside
        if (this.searchForm) {
            this.searchForm.addEventListener('click', (e) => {
                if (e.target === this.searchForm) {
                    this.closeSearchModal();
                }
            });
        }

        // Real-time search
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });

            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearchSubmit(e.target.value);
                }
            });
        }
    }

    /**
     * Open search overlay
     */
    openSearch() {
        if (this.searchForm) {
            this.searchForm.classList.add('active');
            this.isSearchOpen = true;
            
            // Focus on search input
            setTimeout(() => {
                if (this.searchInput) {
                    this.searchInput.focus();
                }
            }, 300);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close search overlay
     */
    closeSearchModal() {
        if (this.searchForm) {
            this.searchForm.classList.remove('active');
            this.isSearchOpen = false;
            
            // Clear search
            if (this.searchInput) {
                this.searchInput.value = '';
            }
            this.clearSearchResults();
            
            // Clear package filtering when search is closed
            this.filterPackagesOnPage('', []);

            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    /**
     * Perform real-time search
     */
    performSearch(query) {
        if (!query || query.length < 2) {
            this.clearSearchResults();
            this.filterPackagesOnPage('', []); // Show all packages
            return;
        }

        const results = this.searchableContent.filter(item => 
            item.keywords.includes(query.toLowerCase()) ||
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        // Get matching packages for filtering
        const matchingPackages = results.filter(r => r.type === 'package');
        
        // Also get packages related to destination searches
        const destinationResults = results.filter(r => r.type === 'destination' && r.relatedPackages);
        destinationResults.forEach(dest => {
            dest.relatedPackages.forEach(packageName => {
                const packageData = this.searchableContent.find(item => 
                    item.type === 'package' && item.title === packageName
                );
                if (packageData && !matchingPackages.some(mp => mp.title === packageData.title)) {
                    matchingPackages.push(packageData);
                }
            });
        });

        this.displaySearchResults(results, query);
        
        // Filter packages on the main page
        if (matchingPackages.length > 0) {
            this.filterPackagesOnPage(query, matchingPackages);
        }
    }

    /**
     * Display search results
     */
    displaySearchResults(results, query) {
        // Remove existing results
        this.clearSearchResults();

        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }

        // Separate results by type and prioritize packages
        const packages = results.filter(r => r.type === 'package');
        const destinations = results.filter(r => r.type === 'destination' && r.relatedPackages);
        const others = results.filter(r => !['package'].includes(r.type) && !r.relatedPackages);

        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        
        const getResultIcon = (type) => {
            const icons = {
                'package': 'map-marked-alt',
                'destination': 'map-marker-alt',
                'activity': 'hiking',
                'adventure': 'mountain',
                'category': 'list',
                'page': 'file-alt'
            };
            return icons[type] || 'search';
        };

        let resultsHTML = `
            <div class="search-results-header">
                <span class="results-count">${results.length} result${results.length !== 1 ? 's' : ''} found for "${query}"</span>
            </div>
            <div class="search-results-list">
        `;

        // Show matching packages first
        if (packages.length > 0) {
            resultsHTML += `<div class="results-section">
                <h4 class="section-title"><i class="fas fa-suitcase"></i> Tour Packages</h4>`;
            
            packages.slice(0, 4).forEach(result => {
                resultsHTML += `
                    <div class="search-result-item package-result" data-type="${result.type}" data-link="${result.packageLink || result.link}">
                        <div class="result-icon">
                            <i class="fas fa-${getResultIcon(result.type)}"></i>
                        </div>
                        <div class="result-content">
                            <h4>${this.highlightMatch(result.title, query)}</h4>
                            <p>${this.highlightMatch(result.description, query)}</p>
                            <div class="package-meta">
                                ${result.price ? `<span class="package-price">${result.price}</span>` : ''}
                                ${result.duration ? `<span class="package-duration">${result.duration}</span>` : ''}
                            </div>
                        </div>
                        <div class="result-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                `;
            });
            resultsHTML += `</div>`;
        }

        // Show destination with recommended packages
        if (destinations.length > 0) {
            destinations.slice(0, 2).forEach(dest => {
                resultsHTML += `<div class="results-section destination-section">
                    <h4 class="section-title"><i class="fas fa-map-marker-alt"></i> ${this.highlightMatch(dest.title, query)}</h4>
                    <p class="destination-description">${dest.description}</p>
                    <div class="recommended-packages">
                        <h5><i class="fas fa-star"></i> Recommended Packages</h5>
                        <div class="package-recommendations">`;
                
                // Find actual package data for recommendations
                dest.relatedPackages.slice(0, 3).forEach(packageName => {
                    const packageData = this.searchableContent.find(item => 
                        item.type === 'package' && item.title === packageName
                    );
                    if (packageData) {
                        resultsHTML += `
                            <div class="recommended-package" data-link="${packageData.packageLink || packageData.link}">
                                <div class="package-info">
                                    <h6>${packageData.title}</h6>
                                    <div class="package-meta">
                                        ${packageData.price ? `<span class="package-price">${packageData.price}</span>` : ''}
                                        ${packageData.duration ? `<span class="package-duration">${packageData.duration}</span>` : ''}
                                    </div>
                                </div>
                                <button class="book-btn">
                                    <i class="fas fa-calendar-check"></i> Book Now
                                </button>
                            </div>
                        `;
                    }
                });
                
                resultsHTML += `</div></div></div>`;
            });
        }

        // Show other results
        if (others.length > 0) {
            resultsHTML += `<div class="results-section">
                <h4 class="section-title"><i class="fas fa-search"></i> Other Results</h4>`;
            
            others.slice(0, 4).forEach(result => {
                resultsHTML += `
                    <div class="search-result-item" data-type="${result.type}" data-link="${result.link}">
                        <div class="result-icon">
                            <i class="fas fa-${getResultIcon(result.type)}"></i>
                        </div>
                        <div class="result-content">
                            <h4>${this.highlightMatch(result.title, query)}</h4>
                            <p>${this.highlightMatch(result.description, query)}</p>
                            <span class="result-type-badge">${result.type}</span>
                        </div>
                        <div class="result-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                `;
            });
            resultsHTML += `</div>`;
        }

        resultsHTML += `</div>`;

        if (results.length > 8) {
            resultsHTML += `<div class="search-results-footer">
                <p>Showing top results. Total: ${results.length} matches found.</p>
            </div>`;
        }

        resultsContainer.innerHTML = resultsHTML;

        // Add to search form
        const form = this.searchForm.querySelector('form');
        if (form) {
            form.appendChild(resultsContainer);
        }

        // Add click handlers
        this.addResultClickHandlers(resultsContainer);
    }

    /**
     * Show no results message
     */
    showNoResults(query) {
        const noResults = document.createElement('div');
        noResults.className = 'search-no-results';
        noResults.innerHTML = `
            <div class="no-results-content">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No results found for "${query}"</h3>
                <p>Try searching for popular destinations, activities, or tour packages</p>
                <div class="search-suggestions">
                    <span>Popular searches:</span>
                    <div class="suggestion-buttons">
                        <button class="suggestion-btn" data-query="Sigiriya">Sigiriya</button>
                        <button class="suggestion-btn" data-query="Safari">Safari</button>
                        <button class="suggestion-btn" data-query="Beach">Beach</button>
                        <button class="suggestion-btn" data-query="Cultural">Cultural</button>
                        <button class="suggestion-btn" data-query="Adventure">Adventure</button>
                        <button class="suggestion-btn" data-query="Ella">Ella</button>
                    </div>
                </div>
            </div>
        `;

        const form = this.searchForm.querySelector('form');
        if (form) {
            form.appendChild(noResults);
        }

        // Add click handlers to suggestion buttons
        noResults.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                this.searchInput.value = query;
                this.performSearch(query);
            });
        });
    }

    /**
     * Clear search results
     */
    clearSearchResults() {
        const existing = this.searchForm?.querySelectorAll('.search-results, .search-no-results');
        existing?.forEach(el => el.remove());
    }

    /**
     * Highlight matching text
     */
    highlightMatch(text, query) {
        if (!text || !query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Add click handlers to search results
     */
    addResultClickHandlers(container) {
        // Handle general result clicks
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const link = item.getAttribute('data-link');
                this.navigateToResult(link);
            });

            // Add hover effects
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(5px)';
                item.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.boxShadow = '';
            });
        });

        // Handle recommended package clicks
        container.querySelectorAll('.recommended-package').forEach(item => {
            item.addEventListener('click', () => {
                const link = item.getAttribute('data-link');
                this.navigateToResult(link);
            });
        });

        // Handle book now buttons
        container.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const packageElement = btn.closest('.recommended-package');
                const link = packageElement.getAttribute('data-link');
                this.navigateToResult(link);
            });
        });
    }

    /**
     * Filter packages on the main page based on search query
     */
    filterPackagesOnPage(query, matchedPackages = []) {
        const allPackages = document.querySelectorAll('.packages .box');
        
        if (!query && matchedPackages.length === 0) {
            // Show all packages
            allPackages.forEach(pkg => {
                pkg.style.display = 'block';
                pkg.style.order = '';
                pkg.classList.remove('search-highlight');
            });
            return;
        }

        allPackages.forEach(pkg => {
            const title = pkg.querySelector('h3')?.textContent?.trim();
            const isMatched = matchedPackages.some(mp => mp.title === title);
            
            if (isMatched) {
                pkg.style.display = 'block';
                pkg.style.order = '-1'; // Move to front
                pkg.classList.add('search-highlight');
            } else {
                pkg.style.display = 'none';
                pkg.classList.remove('search-highlight');
            }
        });

        // Add a message about filtered results
        this.showPackageFilterMessage(matchedPackages.length, query);
    }

    /**
     * Show message about package filtering
     */
    showPackageFilterMessage(count, query) {
        // Remove existing message
        const existingMessage = document.querySelector('.package-filter-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (count === 0) return;

        const packagesSection = document.querySelector('.packages');
        if (packagesSection) {
            const message = document.createElement('div');
            message.className = 'package-filter-message';
            message.innerHTML = `
                <div class="filter-message-content">
                    <i class="fas fa-filter"></i>
                    <span>Showing ${count} package${count !== 1 ? 's' : ''} matching "${query}"</span>
                    <button class="clear-filter-btn">
                        <i class="fas fa-times"></i> Show All
                    </button>
                </div>
            `;

            // Insert after the heading
            const heading = packagesSection.querySelector('.heading');
            if (heading) {
                heading.after(message);
            }

            // Add clear filter functionality
            message.querySelector('.clear-filter-btn').addEventListener('click', () => {
                this.filterPackagesOnPage('', []);
                message.remove();
            });
        }
    }

    /**
     * Navigate to search result
     */
    navigateToResult(link) {
        this.closeSearchModal();
        
        if (link && !link.startsWith('#')) {
            // Direct package link
            window.open(link, '_self');
            return;
        }
        
        if (link && link.startsWith('#')) {
            // Smooth scroll to section
            const target = document.querySelector(link);
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Add highlight effect
                target.style.transition = 'box-shadow 0.3s ease';
                target.style.boxShadow = '0 0 30px rgba(255, 99, 71, 0.4)';
                setTimeout(() => {
                    target.style.boxShadow = '';
                }, 2000);
            }
        }
    }

    /**
     * Handle search form submission
     */
    handleSearchSubmit(query) {
        if (!query) return;

        // Perform search and navigate to first result
        const results = this.searchableContent.filter(item => 
            item.keywords.includes(query.toLowerCase()) ||
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length > 0) {
            this.navigateToResult(results[0].link);
        }
    }

    /**
     * Setup autocomplete functionality
     */
    setupAutocomplete() {
        if (!this.searchInput) return;

        const suggestions = [
            'Sigiriya Rock Fortress',
            'Kandy Temple of Tooth',
            'Ella Train Journey',
            'Yala National Park',
            'Mirissa Beach',
            'Tea Plantation Tours',
            'Galle Fort',
            'Cultural Tours',
            'Wildlife Safari',
            'Beach Holidays',
            'Adventure Tours',
            'Whale Watching',
            'Surfing',
            'Hiking',
            'Photography Tours'
        ];

        this.searchInput.setAttribute('list', 'search-suggestions');
        this.searchInput.setAttribute('autocomplete', 'off');
        this.searchInput.setAttribute('placeholder', 'Search destinations, activities, or packages...');
        
        // Create datalist if it doesn't exist
        let datalist = document.getElementById('search-suggestions');
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = 'search-suggestions';
            suggestions.forEach(suggestion => {
                const option = document.createElement('option');
                option.value = suggestion;
                datalist.appendChild(option);
            });
            document.body.appendChild(datalist);
        }
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const tourSearch = new TourSearch();
        
        // Make it globally accessible
        window.tourSearch = tourSearch;
        
        console.log(' Enhanced search functionality initialized successfully');
        console.log(` Search database contains ${tourSearch.searchableContent.length} items`);
        
        // Test if required elements exist
        const requiredElements = ['search-btn', 'close-search', 'search-box'];
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.warn(' Missing HTML elements for search:', missingElements);
        }
        
    } catch (error) {
        console.error(' Error initializing search functionality:', error);
    }
});