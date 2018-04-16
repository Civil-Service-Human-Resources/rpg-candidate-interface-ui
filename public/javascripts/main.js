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
    mediaQuery: 'only screen and (max-width: 679px)',
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
