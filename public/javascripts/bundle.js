/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _showhide = __webpack_require__(1);

var _showhide2 = _interopRequireDefault(_showhide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rppSelect = document.getElementById('rpp');

if (rppSelect) {
    rppSelect.addEventListener('change', function (event) {
        event.target.form.submit();
    });
}

var showHideElements = document.getElementsByClassName('js-showhide');
for (var i = 0; i < showHideElements.length; i++) {
    new _showhide2.default({
        el: showHideElements[i],
        mediaQuery: 'only screen and (max-width: 640px)',
        iconPosition: 'after'
    });
}

var showHideFields = document.getElementsByClassName('js-showhide-field');
for (var i = 0; i < showHideFields.length; i++) {
    new _showhide2.default({
        el: showHideFields[i],
        mediaQuery: 'only screen and (min-width: 0)',
        iconClassClosed: 'ion-arrow-right-b',
        iconClassOpen: 'ion-arrow-down-b'
    });
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(2);

var _debounce = __webpack_require__(3);

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowHide = function () {
    function ShowHide(_ref) {
        var _this = this;

        var _ref$el = _ref.el,
            el = _ref$el === undefined ? null : _ref$el,
            _ref$mediaQuery = _ref.mediaQuery,
            mediaQuery = _ref$mediaQuery === undefined ? null : _ref$mediaQuery,
            _ref$icon = _ref.icon,
            icon = _ref$icon === undefined ? true : _ref$icon,
            _ref$iconPosition = _ref.iconPosition,
            iconPosition = _ref$iconPosition === undefined ? 'before' : _ref$iconPosition,
            _ref$iconClassClosed = _ref.iconClassClosed,
            iconClassClosed = _ref$iconClassClosed === undefined ? 'ion-arrow-down-b' : _ref$iconClassClosed,
            _ref$iconClassOpen = _ref.iconClassOpen,
            iconClassOpen = _ref$iconClassOpen === undefined ? 'ion-arrow-up-b' : _ref$iconClassOpen;

        _classCallCheck(this, ShowHide);

        console.log(arguments);
        this.el = el;
        this.mediaQuery = mediaQuery;
        this.icon = icon;
        this.iconPosition = iconPosition;
        this.iconClassClosed = iconClassClosed;
        this.iconClassOpen = iconClassOpen;
        this.targetEl = null;
        this.initialized = false;

        this.checkBrowserWidth();

        this.el.addEventListener('click', function (event) {
            return _this.handleClick(event);
        });
        window.addEventListener('resize', (0, _debounce2.default)(this.checkBrowserWidth.bind(this), 100));
        document.addEventListener('keyup', function (event) {
            if (event.target.classList.contains('js-showhide--initialized') && event.which === 13) {
                _this.handleClick(event);
                return false;
            }
        });
    }

    _createClass(ShowHide, [{
        key: 'checkBrowserWidth',
        value: function checkBrowserWidth() {
            return matchMedia(this.mediaQuery).matches ? this.init() : this.uninit();
        }
    }, {
        key: 'init',
        value: function init() {
            if (!this.el) return console.error('No target element specified');

            if (this.initialized) return;

            // set up open/close text element
            this.el.classList.add('js-showhide--initialized');
            this.el.setAttribute('aria-expanded', false);
            this.el.setAttribute('aria-controls', this.el.dataset.showhideTargetId);
            this.el.setAttribute('role', 'button');
            this.el.setAttribute('tabindex', 0);

            // add arrow to open/close text element
            this.iconEl = document.createElement('i');
            this.iconEl.className = 'icon icon--' + this.iconPosition + ' ' + this.iconClassClosed;
            this.iconEl.setAttribute('aria-hidden', true);
            this.el.appendChild(this.iconEl);

            this.iconPosition === 'after' ? this.el.appendChild(this.iconEl) : this.el.insertBefore(this.iconEl, this.el.firstChild);

            // retrieve details on target element
            this.targetEl = document.getElementById(this.el.dataset.showhideTargetId);
            this.targetEl.classList.add('js-hidden');
            this.targetEl.setAttribute('aria-hidden', true);

            this.initialized = true;
        }
    }, {
        key: 'uninit',
        value: function uninit() {
            if (!this.initialized) return;

            this.el.removeChild(this.iconEl);
            this.el.classList.remove('js-showhide--initialized');
            this.el.removeAttribute('aria-expanded');
            this.el.removeAttribute('tabindex');
            this.el.removeAttribute('role');
            this.el.removeAttribute('aria-controls');
            this.targetEl.removeAttribute('aria-hidden');
            this.targetEl.classList.remove('js-hidden');
            this.initialized = false;
        }
    }, {
        key: 'handleClick',
        value: function handleClick(event) {
            event.preventDefault();

            // we only want to fire if the media query matches
            if (matchMedia(this.mediaQuery).matches) {
                var targetHidden = this.targetEl.classList.contains('js-hidden');

                this.el.setAttribute('aria-expanded', targetHidden);
                this.iconEl.classList.toggle(this.iconClassClosed);
                this.iconEl.classList.toggle(this.iconClassOpen);
                this.targetEl.setAttribute('aria-hidden', !targetHidden);
                this.targetEl.classList.toggle('js-hidden');
            }
        }
    }]);

    return ShowHide;
}();

exports.default = ShowHide;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map