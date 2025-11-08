/* Feedback Form JavaScript */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize feedback form functionality
    initFeedbackForm();
});

function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    const successMessage = document.querySelector('.feedback-success');
    
    // Flag to prevent multiple submissions
    let isSubmitting = false;
    
    if (!feedbackForm) return;
    
    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (isSubmitting) {
            return;
        }
        
        // Check network connectivity first
        const hasConnection = await checkNetworkConnectivity();
        
        if (!hasConnection) {
            showNetworkError();
            return;
        }
        
        // Basic validation
        let isValid = validateForm(feedbackForm);
        
        if (isValid) {
            isSubmitting = true;
            
            // Show loading state
            const submitBtn = feedbackForm.querySelector('.submit-feedback');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitBtn.disabled = true;
            }
            
            // Get form data
            const formData = new FormData(feedbackForm);
            
            // Create abort controller for timeout handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            // Submit form via AJAX
            fetch('process_feedback.php', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            })
            .then(response => {
                // Clear timeout if request completed
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        console.error('Server response (not JSON):', text);
                        throw new Error('Server returned invalid response. Please try again.');
                    }
                });
            })
            .then(data => {
                if (data.success) {
                    // Show success message inline
                    feedbackForm.style.display = 'none';
                    if (successMessage) {
                        successMessage.classList.add('visible');
                        successMessage.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                    
                    // Reset form
                    feedbackForm.reset();
                } else {
                    // Show error message
                    showFeedbackError('Error submitting feedback: ' + (data.message || 'Please try again.'));
                }
                
                // Reset submission flag and button
                isSubmitting = false;
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                
                // More specific error messages
                let errorMessage = 'An error occurred while submitting your feedback. Please try again.';
                
                if (error.name === 'AbortError' || error.message.includes('fetch')) {
                    errorMessage = 'Network connection lost during submission. Please check your internet connection and try again.';
                } else if (error.message.includes('HTTP error')) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (error.message.includes('Server returned invalid response')) {
                    errorMessage = error.message;
                } else if (error.message.includes('Network')) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                }
                
                showFeedbackError(errorMessage);
                
                // Reset submission flag and button
                isSubmitting = false;
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
                    submitBtn.disabled = false;
                }
            });
        } else {
            // Reset flag if validation fails
            isSubmitting = false;
        }
    });
    
    // Star rating visual interaction
    const starLabels = document.querySelectorAll('.star-rating label');
    if (starLabels) {
        starLabels.forEach(label => {
            label.addEventListener('click', function() {
                const rating = this.getAttribute('for').replace('star', '');
                console.log(`Rating selected: ${rating} stars`);
            });
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Remove all previous error states
    const allFields = form.querySelectorAll('input, textarea, select');
    allFields.forEach(field => {
        field.classList.remove('error');
    });
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            field.focus();
            isValid = false;
        }
    });
    
    // Validate email if present
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            emailField.classList.add('error');
            emailField.focus();
            alert('Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Check if rating is selected
    const ratingInputs = form.querySelectorAll('input[name="rating"]');
    if (ratingInputs.length > 0) {
        let ratingSelected = false;
        ratingInputs.forEach(input => {
            if (input.checked) {
                ratingSelected = true;
            }
        });
        
        if (!ratingSelected) {
            const ratingGroup = document.querySelector('.rating-group');
            if (ratingGroup) {
                ratingGroup.classList.add('error');
                alert('Please select a rating for your experience');
                isValid = false;
            }
        }
    }
    
    return isValid;
}

// Add floating feedback button functionality
document.addEventListener('DOMContentLoaded', function() {
    const floatingBtn = document.querySelector('.floating-feedback-btn');
    
    if (floatingBtn) {
        // Show button when user scrolls down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                floatingBtn.classList.add('visible');
            } else {
                floatingBtn.classList.remove('visible');
            }
        });
        
        // Scroll to feedback form when button is clicked
        floatingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'feedback.php';
        });
    }
});

// Network connectivity checking functions (global scope)
async function checkNetworkConnectivity() {
    try {
        // Check if navigator.onLine is available (basic check)
        if (!navigator.onLine) {
            return false;
        }

        // Try to fetch a reliable external resource with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 5000); // 5 second timeout
        
        const response = await fetch('https://www.google.com/favicon.ico', {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        return true;

    } catch (error) {
        return false;
    }
}

function showNetworkError() {
    showFeedbackError('No internet connection detected. Please check your network connection and try again.', 'fas fa-wifi');
}

function showFeedbackError(message, icon = 'fas fa-exclamation-triangle') {
    // Try to find a message container in the feedback form
    let messageContainer = document.querySelector('.feedback-message') || 
                          document.querySelector('#feedbackMessage') ||
                          document.querySelector('.message');
    
    // If no message container exists, create one
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'feedback-message message error';
        messageContainer.id = 'feedbackMessage';
        
        // Add CSS styles if they don't exist
        if (!document.querySelector('#feedbackMessageStyles')) {
            const style = document.createElement('style');
            style.id = 'feedbackMessageStyles';
            style.textContent = `
                .feedback-message {
                    padding: 15px;
                    border-radius: 4px;
                    margin: 15px 0;
                    display: none;
                    font-family: Arial, sans-serif;
                }
                .feedback-message.success {
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                .feedback-message.error {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
                .feedback-message i {
                    margin-right: 8px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Insert after the form
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.parentNode.insertBefore(messageContainer, feedbackForm.nextSibling);
        }
    }
    
    // Style and show the message
    messageContainer.classList.remove('success');
    messageContainer.classList.add('error');
    messageContainer.innerHTML = `
        <i class="${icon}"></i> 
        ${message}
    `;
    messageContainer.style.display = 'block';
    
    // Animate message appearance (same as booking form)
    messageContainer.style.opacity = '0';
    messageContainer.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        messageContainer.style.transition = 'all 0.3s ease';
        messageContainer.style.opacity = '1';
        messageContainer.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-hide message after 8 seconds
    setTimeout(() => {
        messageContainer.style.transition = 'all 0.3s ease';
        messageContainer.style.opacity = '0';
        messageContainer.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 300);
    }, 8000);
    
    // Scroll to message
    messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

