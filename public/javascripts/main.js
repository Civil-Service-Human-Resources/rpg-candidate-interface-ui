import 'babel-polyfill';
import './polyfills-custom/dataset';
import ShowHide from '../javascripts/modules/showhide';

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
    mediaQuery: 'only screen and (max-width: 640px)',
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
