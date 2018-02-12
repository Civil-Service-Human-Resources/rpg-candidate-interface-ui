import 'matchmedia-polyfill';
import debounce from 'debounce';

export default class ShowHide {
    constructor({
        el = null,
        mediaQuery = null,
        icon = true,
        iconPosition = 'before',
        iconClassClosed = 'ion-arrow-down-b',
        iconClassOpen = 'ion-arrow-up-b',
    }) {
        this.el = el;
        this.mediaQuery = mediaQuery;
        this.icon = icon;
        this.iconPosition = iconPosition;
        this.iconClassClosed = iconClassClosed;
        this.iconClassOpen = iconClassOpen;
        this.targetEl = null;
        this.initialized = false;

        this.checkBrowserWidth();

        this.el.addEventListener('click', event => this.handleClick(event));

        // eslint-disable-next-line no-undef
        window.addEventListener('resize', debounce(this.checkBrowserWidth.bind(this), 100));

        // eslint-disable-next-line no-undef
        document.addEventListener('keyup', (event) => {
            // if we're hitting enter on a button, it registers a 'click' anyway
            if (event.target.localName === 'button') return;

            if (event.which === 13 && event.target === this.el) {
                event.preventDefault();
                this.handleClick(event);
            }
        });
    }

    checkBrowserWidth() {
        // eslint-disable-next-line no-undef
        return matchMedia(this.mediaQuery).matches ? this.init() : this.uninit();
    }

    init() {
        if (!this.el) return false;

        if (this.initialized) return false;

        // set up open/close text element
        this.el.classList.add('js-showhide--initialized');
        this.el.setAttribute('aria-expanded', false);
        this.el.setAttribute('aria-controls', this.el.dataset.showhideTargetId);
        this.el.setAttribute('role', 'button');
        this.el.setAttribute('tabindex', 0);

        // add arrow to open/close text element
        this.iconEl = document.createElement('i'); // eslint-disable-line no-undef
        this.iconEl.className = `icon icon--${this.iconPosition} ${this.iconClassClosed}`;
        this.iconEl.setAttribute('aria-hidden', true);
        this.el.appendChild(this.iconEl);

        // eslint-disable-next-line no-unused-expressions
        this.iconPosition === 'after' ?
            this.el.appendChild(this.iconEl) :
            this.el.insertBefore(this.iconEl, this.el.firstChild);

        // retrieve details on target element
        // eslint-disable-next-line no-undef
        this.targetEl = document.getElementById(this.el.dataset.showhideTargetId);
        this.targetEl.classList.add('js-hidden');
        this.targetEl.setAttribute('aria-hidden', true);

        this.initialized = true;

        return false;
    }

    uninit() {
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

    handleClick(event) {
        event.preventDefault();

        // we only want to fire if the media query matches
        if (matchMedia(this.mediaQuery).matches) { // eslint-disable-line no-undef
            const targetHidden = this.targetEl.classList.contains('js-hidden');

            this.el.setAttribute('aria-expanded', targetHidden);
            this.iconEl.classList.toggle(this.iconClassClosed);
            this.iconEl.classList.toggle(this.iconClassOpen);
            this.targetEl.setAttribute('aria-hidden', !targetHidden);
            this.targetEl.classList.toggle('js-hidden');
        }

        return false;
    }
}
