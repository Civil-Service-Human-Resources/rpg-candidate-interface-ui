import ShowHide from '../javascripts/modules/showhide';

// eslint-disable-next-line no-undef
const rppSelect = document.getElementById('rpp');

if (rppSelect) {
    rppSelect.addEventListener('change', (event) => {
        event.target.form.submit();
    });
}

// eslint-disable-next-line no-undef
const showHideElements = document.getElementsByClassName('js-showhide');
for (let i = 0; i < showHideElements.length; i += 1) {
    ShowHide({
        el: showHideElements[i],
        mediaQuery: 'only screen and (max-width: 640px)',
        iconPosition: 'after',
    });
}

// eslint-disable-next-line no-undef
const showHideFields = document.getElementsByClassName('js-showhide-field');
for (let i = 0; i < showHideFields.length; i += 1) {
    ShowHide({
        el: showHideFields[i],
        mediaQuery: 'only screen and (min-width: 0)',
        iconClassClosed: 'ion-arrow-right-b',
        iconClassOpen: 'ion-arrow-down-b',
    });
}
