import 'matchmedia-polyfill';
import debounce from 'debounce';

export default class ShowHide {

    constructor(el) {
        this.el = el || null;
        this.targetEl = null;
        this.mediaQuery = 'only screen and (max-width: 640px)';
        this.initialized = false;

        this.checkBrowserWidth();

        this.el.addEventListener('click', event => this.handleClick(event));
        window.addEventListener('resize', debounce(this.checkBrowserWidth.bind(this), 100));
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

        // add arrow to open/close text element
        this.iconEl = document.createElement('i');
        this.iconEl.className = 'icon ion-arrow-down-b';
        this.iconEl.setAttribute('aria-hidden', true);
        this.el.appendChild(this.iconEl);

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

        // we only want to do something if we're at mobile width
        if(matchMedia(this.mediaQuery).matches) {
            const targetHidden = this.targetEl.classList.contains('js-hidden');

            this.iconEl.classList.toggle('ion-arrow-down-b');
            this.iconEl.classList.toggle('ion-arrow-up-b');
            this.targetEl.setAttribute('aria-hidden', !targetHidden);
            this.targetEl.classList.toggle('js-hidden');
        }
    }

}