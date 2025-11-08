/**
 * FAQ Accordion - Ceylon Tour.com
 * Version: 1.0.0
 * Description: Modern, accessible FAQ accordion with smooth animations
 * 
 * Features:
 * - Smooth expand/collapse animations
 * - Keyboard navigation support
 * - Screen reader friendly (ARIA attributes)
 * - Mobile responsive
 * - Multiple FAQs can be open simultaneously
 */

(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', initFAQ);

  function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (!faqQuestions.length) {
      return; // Exit if no FAQ questions found
    }

    // Add click event listeners to all FAQ questions
    faqQuestions.forEach(question => {
      question.addEventListener('click', toggleFAQ);
      
      // Keyboard accessibility
      question.addEventListener('keydown', handleKeyboard);
    });

    // Close all FAQs initially (optional - remove if you want first one open)
    // openFirstFAQ();
  }

  /**
   * Toggle FAQ item open/closed
   */
  function toggleFAQ(event) {
    const question = event.currentTarget;
    const answer = document.getElementById(question.getAttribute('aria-controls'));
    const isExpanded = question.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      // Close the FAQ
      closeFAQ(question, answer);
    } else {
      // Open the FAQ
      openFAQ(question, answer);
    }
  }

  /**
   * Open a specific FAQ item
   */
  function openFAQ(question, answer) {
    // Update ARIA attributes
    question.setAttribute('aria-expanded', 'true');
    answer.setAttribute('aria-hidden', 'false');

    // Smooth animation
    answer.style.maxHeight = answer.scrollHeight + 'px';

    // Add active class for additional styling (optional)
    question.closest('.faq-item').classList.add('active');
  }

  /**
   * Close a specific FAQ item
   */
  function closeFAQ(question, answer) {
    // Update ARIA attributes
    question.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');

    // Smooth animation
    answer.style.maxHeight = '0';

    // Remove active class
    question.closest('.faq-item').classList.remove('active');
  }

  /**
   * Keyboard navigation support
   */
  function handleKeyboard(event) {
    const question = event.currentTarget;

    // Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      question.click();
    }

    // Arrow key navigation
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      navigateFAQs(question, event.key === 'ArrowDown');
    }

    // Home/End keys
    if (event.key === 'Home') {
      event.preventDefault();
      focusFirstFAQ();
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusLastFAQ();
    }
  }

  /**
   * Navigate between FAQ items using arrow keys
   */
  function navigateFAQs(currentQuestion, moveDown) {
    const allQuestions = Array.from(document.querySelectorAll('.faq-question'));
    const currentIndex = allQuestions.indexOf(currentQuestion);
    
    let nextIndex;
    if (moveDown) {
      nextIndex = currentIndex + 1;
      if (nextIndex >= allQuestions.length) nextIndex = 0; // Wrap to first
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = allQuestions.length - 1; // Wrap to last
    }

    allQuestions[nextIndex].focus();
  }

  /**
   * Focus first FAQ question
   */
  function focusFirstFAQ() {
    const firstQuestion = document.querySelector('.faq-question');
    if (firstQuestion) firstQuestion.focus();
  }

  /**
   * Focus last FAQ question
   */
  function focusLastFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    const lastQuestion = questions[questions.length - 1];
    if (lastQuestion) lastQuestion.focus();
  }

  /**
   * Optional: Open first FAQ by default
   */
  function openFirstFAQ() {
    const firstQuestion = document.querySelector('.faq-question');
    if (firstQuestion) {
      const firstAnswer = document.getElementById(firstQuestion.getAttribute('aria-controls'));
      openFAQ(firstQuestion, firstAnswer);
    }
  }

  /**
   * Public API (if needed for dynamic content)
   */
  window.FAQAccordion = {
    init: initFAQ,
    openFAQ: function(questionElement) {
      const answer = document.getElementById(questionElement.getAttribute('aria-controls'));
      openFAQ(questionElement, answer);
    },
    closeFAQ: function(questionElement) {
      const answer = document.getElementById(questionElement.getAttribute('aria-controls'));
      closeFAQ(questionElement, answer);
    },
    closeAll: function() {
      document.querySelectorAll('.faq-question').forEach(question => {
        const answer = document.getElementById(question.getAttribute('aria-controls'));
        closeFAQ(question, answer);
      });
    }
  };

})();
