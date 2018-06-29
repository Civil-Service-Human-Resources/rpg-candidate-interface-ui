import accessibleAutocomplete from 'accessible-autocomplete';
import _ from 'lodash';

import 'babel-polyfill/dist/polyfill';
import './polyfills-custom/dataset';
import './polyfills-custom/append';
import './polyfills-custom/prepend';

import ShowHide from '../javascripts/modules/showhide';
import MinMaxSalary from '../javascripts/modules/salary';

// eslint-disable-next-line no-undef
const rppSelect = document.getElementById('rpp');

if (rppSelect) {
    rppSelect.addEventListener('change', (event) => {
        event.target.form.submit();
    });
}

// eslint-disable-next-line no-undef
const showHideElements = [...document.getElementsByClassName('js-showhide')];
showHideElements.forEach(el => new ShowHide({
    el,
    mediaQuery: 'only screen and (max-width: 767px)',
    iconPosition: 'after',
}));

// eslint-disable-next-line no-undef
const showHideFields = [...document.getElementsByClassName('js-showhide-field')];
showHideFields.forEach(el => new ShowHide({
    el,
    mediaQuery: 'only screen and (min-width: 0)',
    iconClassClosed: 'ion-arrow-right-b',
    iconClassOpen: 'ion-arrow-down-b',
}));

// eslint-disable-next-line no-new
new MinMaxSalary('minSalary', 'maxSalary');

// for automation
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
let i;

for (i = 0; i < checkboxes.length; i += 1) {
    // add checkbox state on page load
    addCheckboxState(checkboxes[i]);

    // add event listeners to update checkbox state
    checkboxes[i].addEventListener('change', event => addCheckboxState(event.target));
}

function addCheckboxState(checkbox) {
    return checkbox.setAttribute('data-checked', checkbox.checked);
}

// create user form email interactivity
const emailAuto = document.querySelector('#email-autocomplete-src input');

if (emailAuto) {
    updateEmailAutocomplete();
    emailAuto.addEventListener('keyup', updateEmailAutocomplete);
}

function updateEmailAutocomplete() {
    const emailAutoDest = document.querySelector('#email-autocomplete-dest');
    const emailAutoDestEl = emailAutoDest.querySelector('#email-autocomplete-dest span');

    if (emailAuto.value.trim().length > 0) {
        emailAutoDest.className = emailAutoDest.className.replace(new RegExp('(\\s|^)js-hidden(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
        emailAutoDest.setAttribute('aria-hidden', false);
        emailAutoDestEl.textContent = emailAuto.value.trim();
    } else {
        emailAutoDest.className += ' js-hidden';
        emailAutoDest.setAttribute('aria-hidden', true);
    }
}

const selectElement = document.querySelector('#depts');
const autocompleteOptions = {
    selectElement,
    placeholder: 'Start typing...',
    autoselect: true,
    defaultValue: '',
};

if (selectElement) {
    document.addEventListener('keyup', isSelectEmpty);
    accessibleAutocomplete.enhanceSelectElement(autocompleteOptions);
}

function isSelectEmpty() {
    if (_.isEmpty(document.getElementById('depts').value)) {
        document.getElementById('depts-select').value = '0';
    }
}
