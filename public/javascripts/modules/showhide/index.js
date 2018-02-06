import 'matchmedia-polyfill';
import debounce from 'debounce';

export default class ShowHide {

    constructor({
        el = null,
        mediaQuery = null,
        icon = true,
        iconPosition = 'before',
        iconClassClosed = 'ion-arrow-down-b',
        iconClassOpen = 'ion-arrow-up-b'
    }) {
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

        this.el.addEventListener('click', event => this.handleClick(event));
        window.addEventListener('resize', debounce(this.checkBrowserWidth.bind(this), 100));
        document.addEventListener('keyup', event => {
            event.preventDefault();
            event.stopPropagation();
            if(event.target.classList.contains('js-showhide--initialized') && event.which === 13) {
                this.handleClick(event);
                return false;
            }
        })
    }

    checkBrowserWidth() {
        return matchMedia(this.mediaQuery).matches ? this.init() : this.uninit();
    }

    init() {
        if(!this.el) return console.error('No target element specified');

        if(this.initialized) return;

        // set up open/close text element
        this.el.classList.add('js-showhide--initialized');
        this.el.setAttribute('aria-expanded', false);
        this.el.setAttribute('aria-controls', this.el.dataset.showhideTargetId)
        this.el.setAttribute('role', 'button');
        this.el.setAttribute('tabindex', 0);

        // add arrow to open/close text element
        this.iconEl = document.createElement('i');
        this.iconEl.className = `icon icon--${this.iconPosition} ${this.iconClassClosed}`;
        this.iconEl.setAttribute('aria-hidden', true);
        this.el.appendChild(this.iconEl);

        this.iconPosition === 'after' ? this.el.appendChild(this.iconEl) : this.el.insertBefore(this.iconEl, this.el.firstChild);

        // retrieve details on target element
        this.targetEl = document.getElementById(this.el.dataset.showhideTargetId);
        this.targetEl.classList.add('js-hidden');
        this.targetEl.setAttribute('aria-hidden', true);

        this.initialized = true;
    }

    uninit() {
        if(!this.initialized) return;

        this.el.removeChild(this.iconEl);
        this.el.classList.remove('js-showhide--initialized');
        this.el.removeAttribute('aria-expanded');
        this.targetEl.removeAttribute('aria-hidden');
        this.targetEl.classList.remove('js-hidden');
        this.initialized = false;
    }

    handleClick(event) {
        event.preventDefault();

        debugger;

        // we only want to fire if the media query matches
        if(matchMedia(this.mediaQuery).matches) {
            const targetHidden = this.targetEl.classList.contains('js-hidden');

            this.el.setAttribute('aria-expanded', targetHidden);
            this.iconEl.classList.toggle(this.iconClassClosed);
            this.iconEl.classList.toggle(this.iconClassOpen);
            this.targetEl.setAttribute('aria-hidden', !targetHidden);
            this.targetEl.classList.toggle('js-hidden');
        }
    }

}