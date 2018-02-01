import ShowHide from '../javascripts/modules/showhide';

var rppSelect = document.getElementById('rpp');

if(rppSelect) {
    rppSelect.addEventListener('change', function (event) {
        event.target.form.submit();
    });
}


const showHideElements = document.getElementsByClassName('js-showhide');
for(var i = 0; i < showHideElements.length; i++) {
   new ShowHide(showHideElements[i]);
}