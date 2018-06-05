import 'matchmedia-polyfill';
import debounce from 'debounce';

const { document } = window;

export default class ShowHide {
    constructor({
        el = null,
        mediaQuery = null,
        icon = true,
        iconPosition = 'before',
        iconClassClosed = 'ion-arrow-down-b',
        iconClassOpen = 'ion-arrow-up-b',
        classDefaultOpen = 'js-expanded',
    }) {
        this.el = el;
        this.mediaQuery = mediaQuery;
        this.icon = icon;
        this.iconPosition = iconPosition;
        this.iconClassClosed = iconClassClosed;
        this.iconClassOpen = iconClassOpen;
        this.classDefaultOpen = classDefaultOpen;
        this.targetEl = document.getElementById(this.el.dataset.showhideTargetId);
        this.initialized = false;
        this.isFieldOpen = this.checkClassExists(this.targetEl.className, this.classDefaultOpen);

        this.checkBrowserWidth();

        // event listeners
        this.el.addEventListener('click', event => this.handleClick(event));
        window.addEventListener('resize', debounce(this.checkBrowserWidth.bind(this), 100));
        document.addEventListener('keyup', (event) => {
            // if we're hitting enter on a button, it registers a 'click' anyway
            if (event.target.localName === 'button') {
                event.preventDefault();
                return false;
            }

            if (event.which === 13 && event.target === this.el) {
                event.preventDefault();
                this.handleClick(event);
            }

            return false;
        });
    }

    checkBrowserWidth() {
        // eslint-disable-next-line no-undef
        return matchMedia(this.mediaQuery).matches ? this.init() : this.uninit();
    }

    init() {
        if (!this.el || this.initialized) return false;

        // set up open/close text element
        this.el.className = this.addClass(this.el.className, 'js-showhide--initialized');
        this.el.setAttribute('aria-expanded', this.isFieldOpen);
        this.el.setAttribute('aria-controls', this.el.dataset.showhideTargetId);
        this.el.setAttribute('role', 'button');
        this.el.setAttribute('tabindex', 0);

        // add arrow to open/close text element
        this.iconEl = document.createElement('i'); // eslint-disable-line no-undef
        this.iconEl.className = `
            icon icon--${this.iconPosition} 
            ${this.isFieldOpen ? this.iconClassOpen : this.iconClassClosed}
            `;
        this.iconEl.setAttribute('aria-hidden', true);
        this.el.appendChild(this.iconEl);

        // eslint-disable-next-line no-unused-expressions
        this.iconPosition === 'after' ?
            this.el.appendChild(this.iconEl) :
            this.el.insertBefore(this.iconEl, this.el.firstChild);

        this.targetEl.setAttribute('aria-hidden', this.isFieldOpen);
        this.targetEl.className = this.isFieldOpen ?
            this.removeClass(this.targetEl.className, 'js-hidden') :
            this.addClass(this.targetEl.className, 'js-hidden');

        this.initialized = true;

        return false;
    }

    uninit() {
        if (!this.initialized) return;

        this.el.removeChild(this.iconEl);
        this.el.className = this.removeClass(this.el.className, 'js-showhide--initialized');
        this.el.removeAttribute('aria-expanded');
        this.el.removeAttribute('tabindex');
        this.el.removeAttribute('role');
        this.el.removeAttribute('aria-controls');
        this.targetEl.removeAttribute('aria-hidden');
        this.targetEl.className = this.removeClass(this.targetEl.className, 'js-hidden');
        this.initialized = false;
    }

    handleClick() {
        // we only want to fire if the media query matches
        if (matchMedia(this.mediaQuery).matches) { // eslint-disable-line no-undef
            const targetHidden = this.targetEl.className.indexOf('js-hidden') > 0;

            this.el.setAttribute('aria-expanded', targetHidden);
            this.iconEl.className = this.toggleClass(this.iconEl.className, this.iconClassClosed);
            this.iconEl.className = this.toggleClass(this.iconEl.className, this.iconClassOpen);
            this.targetEl.setAttribute('aria-hidden', !targetHidden);
            this.targetEl.className = this.toggleClass(this.targetEl.className, 'js-hidden');
        }

        return false;
    }

    // eslint-disable-next-line class-methods-use-this
    addClass(classList, newClass) {
        // having to use crappy way of adding class to keep IE happy :(
        return `${classList} ${newClass}`.trim();
    }

    // eslint-disable-next-line class-methods-use-this
    removeClass(classList, newClass) {
        // having to use crappy way of adding class to keep IE happy :(
        return classList.replace(newClass, '').trim();
    }

    toggleClass(classList, newClass) {
        // having to use crappy way of toggling class to keep IE happy :(
        return classList.indexOf(newClass) <= 0 ?
            this.addClass(classList, newClass) : this.removeClass(classList, newClass);
    }

    checkClassExists(classList, className) {
        return classList.indexOf(className) >= 0;
    }
}
