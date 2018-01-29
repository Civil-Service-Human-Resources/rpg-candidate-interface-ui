const $ = require('jquery');

$('.js-submitOnChange').on('change', function() {
    $(this).parents('form').submit();
});