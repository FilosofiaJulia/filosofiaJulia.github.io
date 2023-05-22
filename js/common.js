const BASE_SERVER_PATH = 'https://academy.directlinedev.com';

function popupHandler (popupClass, openPopupbtnClass, closePopupbtnClass, inputFocusClass) {
    const popup = document.querySelector(`.${popupClass}`);
    const openPopupbtn = document.querySelector(`.${openPopupbtnClass}`);
    const closePopupbtn = document.querySelector(`.${closePopupbtnClass}`);
    const inputFocus = popup.querySelector(`.${inputFocusClass}`);

    if(!openPopupbtn) return;

    if(!popup || !popup.classList.contains('visually-hidden')) return;

    openPopupbtn.addEventListener('click', openPopup);

    function openPopup() {
        window.scrollTo(0, 0);
        popup.classList.remove('visually-hidden');
        document.body.classList.add('no-scroll');
        inputFocus.focus();
        window.addEventListener('keydown', escClosePopup);
        
        if(closePopupbtn) { 
        closePopupbtn.addEventListener('click', closePopup);
        }
    }

    function closePopup() {
        popup.classList.add('visually-hidden');
        document.body.classList.remove('no-scroll');
        openPopupbtn.focus();
        window.removeEventListener('keydown', escClosePopup);
        if(closePopupbtn) { 
            closePopupbtn.removeEventListener('click', closePopup);
        }
    } 

    function escClosePopup(e) {
        if(e.code === "Escape" && !popup.classList.contains('visually-hidden')) {
            closePopup();
        }
    }
}

function popupMobileHandler(mobilePopupClass, openPopupBurgerbtnClass, closePopupbtnClass, inputFocusClass) {
    const menu = document.querySelector('.header__burger');
    const openMenuBtn = document.querySelector('.header__burger-btn-open_js');
    const mobilePopup = document.querySelector(`.${mobilePopupClass}`);
    const openPopupBurgerbtn = document.querySelector(`.${openPopupBurgerbtnClass}`);
    const closePopupbtn = document.querySelector(`.${closePopupbtnClass}`);
    const inputFocus = mobilePopup.querySelector(`.${inputFocusClass}`);
    
    if(!menu && !openPopupBurgerbtn) return;
    if(!mobilePopup && !closePopupbtn) return;
   
    openPopupBurgerbtn.addEventListener('click', openMobilePopup);
   
    function openMobilePopup() {
        if(!menu.classList.contains('visually-hidden')) {
            menu.classList.add('visually-hidden');
        }
        window.scrollTo(0, 0);
        mobilePopup.classList.remove('visually-hidden');
        document.body.classList.add('no-scroll');
        inputFocus.focus();

        closePopupbtn.addEventListener('click', closeMobilePopup);
    }

    function closeMobilePopup() {
        mobilePopup.classList.add('visually-hidden');
        openMenuBtn.focus();
        document.body.classList.remove('no-scroll');
        closePopupbtn.removeEventListener('click', closeMobilePopup); 
    }      
}

/* -----------------------------   Burger menu  ---------------------------- */

(function() {
    const openMenuBtn = document.querySelector('.header__burger-btn-open_js');
    const menu = document.querySelector('.header__burger');
    const closeMenuBtn = document.querySelector('.header__burger-btn-close_js');

    if(!openMenuBtn) return;
    if(!menu && !closeMenuBtn) return;

    openMenuBtn.addEventListener('click', openMenu);

    function openMenu() {
        menu.classList.remove('visually-hidden');
        document.body.classList.add('no-scroll');
        closeMenuBtn.focus();

        closeMenuBtn.addEventListener('click', closeMenu);
        window.addEventListener('keydown', escHandler);
    }

    function closeMenu() {
        menu.classList.add('visually-hidden');
        document.body.classList.remove('no-scroll'); 
        closeMenuBtn.removeEventListener('click', closeMenu);
        window.removeEventListener('keydown', escHandler);
    }

    function escHandler(e) {
        if(e.code === "Escape" && !menu.classList.contains('visually-hidden')) {
            closeMenu();
        }
    }
})();

/* --------------- log out of account and rerender menu-------------------- */
(function() {
    const signOutBtn = document.querySelector('.header__sign-out-btn_js');
    const signOutBurgerBtn = document.querySelector('.header__burger-sign-out-btn_js');
    const isLogin = localStorage.getItem('token');

    if(signOutBtn) {
        signOutBtn.addEventListener('click', signOutHandler, {once: true});
    }

    if(signOutBurgerBtn) {
        signOutBurgerBtn.addEventListener('click', signOutHandler, {once: true});
    }
    
    function signOutHandler() {
        if(isLogin) {
            localStorage.removeItem('token');
            location.pathname = '/';
            rerenderLinks();
            rerenderBurgerLinks();
        }
    }
})();

function rerenderLinks() {
    const loginBtn = document.querySelector('.header__item-login_js');
    const registerBtn = document.querySelector('.header__item-reg_js');
    const toProfileLink = document.querySelector('.header__item-profile_js');
    const signOutBtn = document.querySelector('.header__item-sign-out_js');
  
    const isLogin = localStorage.getItem('token');

    if(isLogin) {
        if(!loginBtn.classList.contains('visually-hidden')) {
            loginBtn.classList.add('visually-hidden');
        }
        if(!registerBtn.classList.contains('visually-hidden')) {
            registerBtn.classList.add('visually-hidden');
        }
        if(toProfileLink.classList.contains('visually-hidden')){
            toProfileLink.classList.remove('visually-hidden');
        }
        if(signOutBtn.classList.contains('visually-hidden')){
            signOutBtn.classList.remove('visually-hidden');
        }
    } else {
        if(loginBtn.classList.contains('visually-hidden')) {
            loginBurgerBtn.classList.remove('visually-hidden');
        }
        if(registerBtn.classList.contains('visually-hidden')) {
            registerBtn.classList.remove('visually-hidden');
        }
        if(!toProfileLink.classList.contains('visually-hidden')){
            toProfileLink.classList.add('visually-hidden');
        }
        if(!signOutBtn.classList.contains('visually-hidden')){
            signOutBtn.classList.add('visually-hidden');
        }
    }
}

function rerenderBurgerLinks() {
    const loginBurgerBtn = document.querySelector('.header__burger-login_js');
    const registerBurgerBtn = document.querySelector('.header__burger-reg_js');
    const toProfileBurgerLink = document.querySelector('.header__burger-profile_js');
    const signOutBurgerBtn = document.querySelector('.header__burger-sign-out_js');
    const isLogin = localStorage.getItem('token');
    
    if(isLogin) {
        if(!loginBurgerBtn.classList.contains('visually-hidden')) {
            loginBurgerBtn.classList.add('visually-hidden');
        }
        if(!registerBurgerBtn.classList.contains('visually-hidden')) {
            registerBurgerBtn.classList.add('visually-hidden');
        }
        if(toProfileBurgerLink.classList.contains('visually-hidden')) {
            toProfileBurgerLink.classList.remove('visually-hidden');
        }
        if(signOutBurgerBtn.classList.contains('visually-hidden')) {
            signOutBurgerBtn.classList.remove('visually-hidden');
        }
    } else {
        if(loginBurgerBtn.classList.contains('visually-hidden')) {
            loginBurgerBtn.classList.remove('visually-hidden');
        }
        if(registerBurgerBtn.classList.contains('visually-hidden')) {
            registerBurgerBtn.classList.remove('visually-hidden');
        }
        if(!toProfileBurgerLink.classList.contains('visually-hidden')) {
            toProfileBurgerLink.classList.add('visually-hidden');
        }
        if(!signOutBurgerBtn.classList.contains('visually-hidden')) {
            signOutBurgerBtn.classList.add('visually-hidden');
        }   
    }
}

/* ------------------------- scroll the page up -------------------------- */
(function() {
    const btnToTop = document.querySelector('.button-to-top_js');

    if(!btnToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY >= 1500) {
            btnToTop.classList.remove('visually-hidden');
        } else {
            btnToTop.classList.add('visually-hidden');
        }
        btnToTop.addEventListener('click', scrollToTop, {once: true});
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
})();

/* -------------------------------- forms --------------------------------- */

function getAllFormData(form) {
    const inputs = form.querySelectorAll('input'); 
    const textareas = form.querySelectorAll('textarea'); 

    let result = {}; 

    for (let input of inputs) { 
        switch (input.type) {
            case 'radio': {
                if(input.checked) {
                    result[input.name] = input.value; 
                }
                break; 
            }
            case 'checkbox': {
                if(!result[input.name]) {
                    result[input.name] = [];
                }

                if(input.checked) {
                    result[input.name].push(input.value);
                }
                break;
            }
            case 'file': {
                result[input.name] = input.files; 
                break;
            }
            default: {
                result[input.name] = input.value;
            }
        }
    }

    for(let textarea of textareas) { 
        result[textarea.name] = textarea.value; 
    }

    return result; 
}

function isEmailCorrect(email) {
    return email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
}

function isAgeCorrect(age) {
    return (!isNaN(age) && age !== null && age >= 18);
}

function isPhoneCorrect(phone) {
    return phone.match(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/);
}

function isConnectNameCorrect(fullName) {
    return fullName.match(/^[a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?$/);
}

function agreementCheckedHandler(checkbox, inputs, btn) {
    if(checkbox.checked) {
        inputs.forEach(elem => {
            if(elem.getAttribute('aria-label') === 'checkbox is not selected') {
                elem.setAttribute('aria-label', 'checkbox was selected');
            }
        });
        btn.removeAttribute('disabled');
    } else { 
        inputs.forEach(elem => {
            elem.setAttribute('aria-label', 'checkbox is not selected');
        });
        btn.setAttribute('disabled', 'disabled');
    }  
}

function getValidationFeildsResult (inputs, data = null) {
    let errors = {};
    inputs.forEach(elem => {
        if(elem.hasAttribute('required')){
            switch (elem.name) {
                case 'email': {
                    if(!isEmailCorrect(elem.value)) {
                        errors.email = 'Please enter a valid email address (your entry is not in the format "somebody@example.com")';
                    } else {
                        setValidityMessage(elem);
                    }
                    break;
                }
                case 'fullName': {
                    if(!isConnectNameCorrect(elem.value)) {
                        errors.fullName = 'Please enter a valid full name (your entry is not in the format "Name Surname")';
                    } else {
                        setValidityMessage(elem);
                    }
                    break;
                }
                case 'phone': {
                    if(!isPhoneCorrect(elem.value)) {
                        errors.phone = 'Please enter a valid phone';
                    } else {
                        setValidityMessage(elem);
                    }
                    break;
                }
                case 'age': {
                    if(!isAgeCorrect(elem.value)) {
                        errors.age = 'The minimum age is 18 years!';
                    } else {
                        setValidityMessage(elem);
                    }
                    break;
                }
                case 'repeatPassword': {
                    if(elem.value !== data.password) {
                        errors.repeatPassword = 'Please re-enter password (your entry does not match the password you entered)';
                    } else if(elem.value.length <= 0) {
                        errors.repeatPassword = 'This field is required';
                    } else {
                        setValidityMessage(elem);
                    }
                    break;
                }
                default: {
                    if(elem.value.length <= 0) {
                        errors[elem.name] = 'This field is required';
                    } else {
                        setValidityMessage(elem);
                    }
                    break;
                }
            }    
        }
    });
    return errors;
}

function setErrorText(input, messageError) { 
    const error = errorCreator(messageError);
    input.classList.add('invalid');
    input.insertAdjacentElement('beforeBegin', error);
    input.addEventListener('input', () => {
        error.remove();
        input.classList.remove('invalid');
    }, {once: true});
}

function errorCreator(message) {
    let messageError = document.createElement('div'); 
    messageError.classList.add('invalid-message'); 
    messageError.innerText = message; 
    return messageError;
}

function setValidityMessage(input) { 
    const message = validityMessageCreator(); 
    input.classList.add('valid'); 
    input.insertAdjacentElement('beforeBegin', message);
    input.addEventListener('input', () => {
        message.remove(); 
        input.classList.remove('valid'); 
    }, {once: true}); 
}

function validityMessageCreator() {
    let validityMessage = document.createElement('div'); 
    validityMessage.classList.add('valid-message'); 
    validityMessage.innerText = 'All right'; 
    return validityMessage;
}

function errorFormHandler(errors, form) {
    if(!errors) return;
    if(Object.keys(errors).length) {
      Object.keys(errors).forEach(key => {
        const messageError = errors[key];
        const input = form.elements[key];
        setErrorText(input, messageError);
      })
      return;
    }
}

function clearErrors(element) {
    const messages = element.querySelectorAll('.invalid-message');
    const invalids = element.querySelectorAll('.invalid');
    messages.forEach(message => message.remove());
    invalids.forEach(invalid => invalid.classList.remove('invalid'));
}

  function clearValidityMessage(element) {
    const messages = element.querySelectorAll('.valid-message');
    const valids = element.querySelectorAll('.valid');
    messages.forEach(message => message.remove());
    valids.forEach(invalid => invalid.classList.remove('valid'));
}

/* --------------------------- server request ---------------------------- */

(function closeServerMessage() {
    const serverMessagePopup = document.querySelector('.server-message_js');
    const closeServerMessagePopupBtn = document.querySelector('.server-message__btn-close_js');

    if(!serverMessagePopup && !closeServerMessagePopupBtn) return;

    window.addEventListener('keydown', escHandler);

    closeServerMessagePopupBtn.addEventListener('click', () => {
        if(!serverMessagePopup.classList.contains('visually-hidden')) {
            serverMessagePopup.classList.add('visually-hidden');
            document.body.classList.remove('no-scroll');
            window.removeEventListener('keydown', escHandler);
        }
    });

    function escHandler(e) {
        if(e.code === "Escape" && !serverMessagePopup.classList.contains('visually-hidden')) {
            serverMessagePopup.classList.add('visually-hidden');
            document.body.classList.remove('no-scroll');
        }
    }
})();

function setErrorServerMessage(element, error) {
    const serverMessage = createElement('div', 'server-message__text-error');
    serverMessage.innerText = `The form was sent but the server transmits an error: “${error}”`;
    element.insertAdjacentElement('afterBegin', serverMessage);
    if (element.classList.contains('visually-hidden'))
    interactionModal(element);
    setTimeout(() => { 
        serverMessage.remove();
     }, 3000)
}

function setSuccessServerMessage(element) {
    const serverMessage = createElement('div', 'server-message__text-success');
    serverMessage.innerText = 'Form has been sent successfully';
    element.insertAdjacentElement('afterBegin', serverMessage);
    if (element.classList.contains('visually-hidden'))
    interactionModal(element);
    setTimeout(() => { 
        serverMessage.remove();
     }, 3000)
}

function sendRequest({url, method = 'GET', headers, body = null}) {
    return fetch(BASE_SERVER_PATH + url, {
        method,
        headers,
        body,
    })
}

function createPreloader() {
   let preloader = createElement('div', 'loader');
   let spinner = createElement('div', 'spinner-border');
   preloader.insertAdjacentElement('afterBegin', spinner);
   return preloader;
}

function showLoader() {
    let loader = createPreloader();
    document.body.insertAdjacentElement('afterBegin', loader);
}

function removeLoader() {
    const loader = document.querySelector('.loader');
    if (loader) loader.remove(); 
}

function createElement(elem, className) {
    let element = document.createElement(elem);
    element.classList.add(className);
    return element;
}

function interactionModal(modal) {
    modal.classList.toggle('visually-hidden');
    document.body.classList.remove('no-scroll');
}