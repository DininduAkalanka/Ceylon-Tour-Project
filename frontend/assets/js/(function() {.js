(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', initializeContactForm);

    function initializeContactForm() {
        const contactFormElement = document.querySelector('.modern-contact-form');
        
        if (!contactFormElement) {
            console.warn('Contact form element not found in DOM');
            return;
        }

        setupFieldValidation(contactFormElement);
        setupFormSubmission(contactFormElement);
    }

    // Field validation rules
    const validationRules = {
        name: {
            check: (val) => val.trim().length >= 2 && val.trim().length <= 100,
            errorMsg: 'Name must be between 2 and 100 characters'
        },
        email: {
            check: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            errorMsg: 'Please provide a valid email address'
        },
        phone: {
            check: (val) => !val || /^[0-9\s\-\+\(\)]+$/.test(val),
            errorMsg: 'Phone number contains invalid characters'
        },
        message: {
            check: (val) => val.trim().length >= 10,
            errorMsg: 'Message must contain at least 10 characters'
        }
    };

    function displayFieldError(fieldName, errorText) {
        const errorContainer = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorContainer) {
            errorContainer.textContent = errorText;
            errorContainer.style.display = 'block';
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.setAttribute('aria-invalid', 'true');
        }
    }

    function removeFieldError(fieldName) {
        const errorContainer = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorContainer) {
            errorContainer.textContent = '';
            errorContainer.style.display = 'none';
        }
        
        if (inputElement) {
            inputElement.classList.remove('error');
            inputElement.setAttribute('aria-invalid', 'false');
        }
    }

    function performFieldValidation(fieldName) {
        const inputElement = document.getElementById(fieldName);
        if (!inputElement) return true;

        const fieldValue = inputElement.value.trim();
        const validationRule = validationRules[fieldName];

        if (validationRule && !validationRule.check(fieldValue)) {
            displayFieldError(fieldName, validationRule.errorMsg);
            return false;
        }

        removeFieldError(fieldName);
        return true;
    }

    function setupFieldValidation(formElement) {
        Object.keys(validationRules).forEach(fieldName => {
            const inputField = document.getElementById(fieldName);
            if (inputField) {
                inputField.addEventListener('blur', () => performFieldValidation(fieldName));
                inputField.addEventListener('input', () => {
                    if (inputField.classList.contains('error')) {
                        performFieldValidation(fieldName);
                    }
                });
            }
        });
    }

    function displayNotification(type, messageText) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `form-notification form-notification-${type}`;
        
        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
        notificationDiv.innerHTML = `
            <i class="fas ${iconClass}"></i>
            <span>${messageText}</span>
        `;
        
        const formElement = document.querySelector('.modern-contact-form');
        formElement.insertAdjacentElement('beforebegin', notificationDiv);
        
        notificationDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => notificationDiv.remove(), 6000);
    }

    async function setupFormSubmission(formElement) {
        formElement.addEventListener('submit', async function(submitEvent) {
            submitEvent.preventDefault();

            // Clear old notifications
            document.querySelectorAll('.form-notification').forEach(el => el.remove());

            // Validate all fields
            const validationResults = Object.keys(validationRules).map(performFieldValidation);
            
            if (validationResults.includes(false)) {
                displayNotification('error', 'Please correct the highlighted errors before submitting.');
                return;
            }

            const submitButton = formElement.querySelector('button[type="submit"]');
            const originalButtonContent = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            try {
                const formPayload = new FormData(formElement);
                
                const serverResponse = await fetch('contact-process.php', {
                    method: 'POST',
                    body: formPayload
                });

                const responseData = await serverResponse.json();

                if (responseData.success) {
                    displayNotification('success', responseData.message);
                    formElement.reset();
                    
                    // Remove error states
                    Object.keys(validationRules).forEach(removeFieldError);
                } else {
                    displayNotification('error', responseData.message || 'Submission failed. Please try again.');
                }

            } catch (networkError) {
                console.error('Network error:', networkError);
                displayNotification('error', 'Connection error. Please verify your internet and retry.');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonContent;
            }
        });
    }
})();
