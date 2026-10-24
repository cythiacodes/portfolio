(function () {
    let contactForm;
    let nameInput;
    let emailInput;
    let phoneInput;
    let messageInput;
    let successBanner;
    let submitBtn;

    document.addEventListener('DOMContentLoaded', () => {
        initContactForm();
    });

    function initContactForm() {
        contactForm = document.getElementById('contactForm');
        nameInput = document.getElementById('contactName');
        emailInput = document.getElementById('contactEmail');
        phoneInput = document.getElementById('contactPhone');
        messageInput = document.getElementById('contactMessage');
        successBanner = document.getElementById('contactSuccessBanner');
        submitBtn = document.getElementById('contactSubmitBtn');

        if (!contactForm) return;

        nameInput.addEventListener('input', () => validateField(nameInput, validateName));
        emailInput.addEventListener('input', () => validateField(emailInput, validateEmail));
        phoneInput.addEventListener('input', () => validateField(phoneInput, validatePhone));
        messageInput.addEventListener('input', () => validateField(messageInput, validateMessage));

        nameInput.addEventListener('blur', () => validateField(nameInput, validateName));
        emailInput.addEventListener('blur', () => validateField(emailInput, validateEmail));
        phoneInput.addEventListener('blur', () => validateField(phoneInput, validatePhone));
        messageInput.addEventListener('blur', () => validateField(messageInput, validateMessage));

        contactForm.addEventListener('submit', handleFormSubmit);
    }

    function validateName(value) {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            return { valid: false, message: 'Name cannot be empty.' };
        }
        if (trimmed.length < 2) {
            return { valid: false, message: 'Name must be at least 2 characters.' };
        }
        return { valid: true, message: '' };
    }

    function validateEmail(value) {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            return { valid: false, message: 'Email address cannot be empty.' };
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
            return { valid: false, message: 'Please enter a valid email address (e.g., student@miva.edu.ng).' };
        }
        return { valid: true, message: '' };
    }

    function validatePhone(value) {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            return { valid: false, message: 'Phone number cannot be empty.' };
        }
        const onlyDigitsRegex = /^[0-9]+$/;
        if (!onlyDigitsRegex.test(trimmed)) {
            return { valid: false, message: 'Phone number must contain only digits (no spaces, dashes, or letters).' };
        }
        if (trimmed.length < 7 || trimmed.length > 15) {
            return { valid: false, message: 'Phone number should be between 7 and 15 digits.' };
        }
        return { valid: true, message: '' };
    }

    function validateMessage(value) {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            return { valid: false, message: 'Message cannot be empty.' };
        }
        if (trimmed.length < 10) {
            return { valid: false, message: 'Please enter a message with at least 10 characters.' };
        }
        return { valid: true, message: '' };
    }

    function validateField(inputEl, validatorFn) {
        const result = validatorFn(inputEl.value);
        const errorEl = document.getElementById(inputEl.id + 'Error');

        if (!result.valid) {
            inputEl.classList.add('is-invalid');
            inputEl.classList.remove('is-valid');
            if (errorEl) {
                errorEl.textContent = result.message;
                errorEl.classList.add('visible');
            }
            return false;
        } else {
            inputEl.classList.remove('is-invalid');
            inputEl.classList.add('is-valid');
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.classList.remove('visible');
            }
            return true;
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const isNameValid = validateField(nameInput, validateName);
        const isEmailValid = validateField(emailInput, validateEmail);
        const isPhoneValid = validateField(phoneInput, validatePhone);
        const isMessageValid = validateField(messageInput, validateMessage);

        const allValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid;

        if (!allValid) {
            if (typeof showToast === 'function') {
                showToast('Please correct the highlighted errors before submitting.', 'error');
            }
            const firstInvalid = contactForm.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            const senderName = nameInput.value.trim();
            contactForm.reset();
            [nameInput, emailInput, phoneInput, messageInput].forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });

            if (successBanner) {
                const bannerTitle = successBanner.querySelector('h4');
                const bannerText = successBanner.querySelector('p');
                if (bannerTitle) bannerTitle.textContent = `Thank You, ${senderName}!`;
                if (bannerText) bannerText.textContent = `Your message has been successfully received. Cynthia will respond to your email shortly.`;
                successBanner.classList.add('visible');

                successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            if (typeof showToast === 'function') {
                showToast('Message sent successfully!', 'success');
            }
        }, 800);
    }
})();
