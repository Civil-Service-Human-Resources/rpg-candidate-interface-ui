import ShowHide from '../javascripts/modules/showhide';

var rppSelect = document.getElementById('rpp');

if(rppSelect) {
    rppSelect.addEventListener('change', function (event) {
        event.target.form.submit();
    });
}

const showHideElements = document.getElementsByClassName('js-showhide');
for(var i = 0; i < showHideElements.length; i++) {
   new ShowHide({
       el: showHideElements[i],
       mediaQuery: 'only screen and (max-width: 640px)',
       iconPosition: 'after'
   });
}

const showHideFields = document.getElementsByClassName('js-showhide-field');
for(var i = 0; i < showHideFields.length; i++) {
    new ShowHide({
        el: showHideFields[i],
        mediaQuery: 'only screen and (min-width: 0)',
        iconClassClosed: 'ion-arrow-right-b',
        iconClassOpen: 'ion-arrow-down-b'
    });
}