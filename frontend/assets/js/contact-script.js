(function() {
    'use strict';

    console.log('Contact script loaded');

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing contact form');
        
        const contactForm = document.querySelector('.modern-contact-form');
        
        if (!contactForm) {
            console.error('Contact form not found');
            return;
        }

        console.log('Contact form found');

        // Validation functions
        const validators = {
            name: (value) => {
                if (!value || value.trim().length < 2) {
                    return 'Name must be at least 2 characters';
                }
                return null;
            },
            email: (value) => {
                if (!value) {
                    return 'Email is required';
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address';
                }
                return null;
            },
            message: (value) => {
                if (!value || value.trim().length < 10) {
                    return 'Message must be at least 10 characters';
                }
                return null;
            }
        };

        // Show error
        function showError(fieldId, message) {
            const errorDiv = document.getElementById(`${fieldId}-error`);
            const input = document.getElementById(fieldId);
            
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }
            
            if (input) {
                input.classList.add('error');
            }
        }

        // Clear error
        function clearError(fieldId) {
            const errorDiv = document.getElementById(`${fieldId}-error`);
            const input = document.getElementById(fieldId);
            
            if (errorDiv) {
                errorDiv.textContent = '';
                errorDiv.style.display = 'none';
            }
            
            if (input) {
                input.classList.remove('error');
            }
        }

        // Validate field
        function validateField(fieldId) {
            const input = document.getElementById(fieldId);
            if (!input) return true;

            const value = input.value.trim();
            const validator = validators[fieldId];

            if (validator) {
                const error = validator(value);
                if (error) {
                    showError(fieldId, error);
                    return false;
                } else {
                    clearError(fieldId);
                    return true;
                }
            }

            return true;
        }

        // Real-time validation
        ['name', 'email', 'message'].forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input) {
                input.addEventListener('blur', () => validateField(fieldId));
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        validateField(fieldId);
                    }
                });
            }
        });

        // Show notification
        function showNotification(type, message) {
            console.log(`Showing ${type} notification:`, message);
            
            // Remove existing notifications
            document.querySelectorAll('.form-notification').forEach(el => el.remove());
            
            const notification = document.createElement('div');
            notification.className = `form-notification form-notification-${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            
            contactForm.insertAdjacentElement('beforebegin', notification);
            notification.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setTimeout(() => notification.remove(), 10000);
        }

        // Form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted');

            // Remove old notifications
            document.querySelectorAll('.form-notification').forEach(el => el.remove());

            // Validate
            const isNameValid = validateField('name');
            const isEmailValid = validateField('email');
            const isMessageValid = validateField('message');

            if (!isNameValid || !isEmailValid || !isMessageValid) {
                showNotification('error', 'Please fix the errors before submitting');
                return;
            }

            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            console.log('Sending data to server...');
            console.log('Form data:', Object.fromEntries(formData));

            try {
                const response = await fetch('contact-process.php', {
                    method: 'POST',
                    body: formData
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    console.error('Non-JSON response received');
                    const responseText = await response.text();
                    console.log('Raw response:', responseText);
                    throw new Error('Server returned invalid response format. Check contact-debug.log');
                }

                const result = await response.json();
                console.log('Parsed result:', result);

                if (result.success) {
                    const notificationType = result.data?.email_warnings ? 'warning' : 'success';
                    showNotification(notificationType, result.message);
                    
                    // Reset form only on full success
                    if (!result.data?.email_warnings) {
                        contactForm.reset();
                        ['name', 'email', 'message'].forEach(clearError);
                    }
                    
                    // Log any warnings
                    if (result.data?.email_warnings) {
                        console.warn('Email warnings:', result.data.email_warnings);
                    }
                } else {
                    showNotification('error', result.message || 'Submission failed. Please try again.');
                }

            } catch (error) {
                console.error('Submission error:', error);
                showNotification('error', 'Connection error: ' + error.message + '. Please try again or contact us directly.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });

        console.log('Contact form initialized successfully');
    });

    // Add styles for warning notification
    const style = document.createElement('style');
    style.textContent = `
        .form-notification-warning {
            background-color: #fff3cd;
            color: #856404;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            margin-bottom: 20px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideDown 0.3s ease-out;
        }
        
        .form-notification-warning i {
            font-size: 20px;
            color: #ffc107;
        }
    `;
    document.head.appendChild(style);
})();
