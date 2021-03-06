/**
 * Autocomplete modifide from the Allies Computing project https://github.com/allies-computing/accessible-address-autocomplete.
 * MIT license
 */
(function () {

    let _ = function (input, o) {
        let me = this;

        // Keep track of number of instances for unique IDs
        AlliesComplete.numInstances = (AlliesComplete.numInstances || 0) + 1;

        // Setup

        this.isOpened = false;

        this.input = $(input);
        this.input.setAttribute("autocomplete", "off");
        this.input.setAttribute("autocorrect", "off");
        this.input.setAttribute("autocapitalize", "off");
        this.input.setAttribute("spellcheck", "false");
        this.input.setAttribute("aria-owns", "allies_complete_list_" + AlliesComplete.numInstances);
        this.input.setAttribute("role", "combobox");

        o = o || {};

        // Default options
        configure(this, {
            maxItems: 10
        }, o);

        this.index = -1;

        this.minChars = 3;

        // Create necessary elements

        this.container = $.create("div", {
            className: "allies-complete",
            around: input
        });

        this.ul = $.create("ul", {
            hidden: "hidden",
            role: "listbox",
            id: "allies_complete_list_" + AlliesComplete.numInstances,
            className: "autocomplete__menu autocomplete__menu--inline autocomplete__menu",
            inside: this.container
        });

        this.status = $.create("span", {
            className: "visually-hidden",
            role: "status",
            id: "allies_complete_status_" + AlliesComplete.numInstances,
            "aria-live": "assertive",
            "aria-relevant": "all",
            "aria-atomic": true,
            inside: this.container,
            textContent: this.minChars != 0 ? ("Type " + this.minChars + " or more characters for results.") : "Begin typing for results."
        });

        this.error = $.create("div", {
            className: "error-message",
            role: "alert",
            id: "allies_complete_error_" + AlliesComplete.numInstances,
            "aria-relevant": "additions text",
            textContent: "",
            hidden: "hidden",
            inside: this.container
        });

        // Bind events

        this._events = {
            input: {
                "input": this.evaluate.bind(this),
                "blur": this.close.bind(this, {
                    reason: "blur"
                }),
                "keydown": function (evt) {
                    let c = evt.keyCode;

                    // If the dropdown `ul` is in view, then act on keydown for the following keys:
                    // Enter / Esc / Up / Down
                    if (me.opened) {
                        if (c === 13 && me.selected) { // Enter
                            evt.preventDefault();
                            me.select();
                        } else if (c === 27) { // Esc
                            me.close({
                                reason: "esc"
                            });
                        } else if (c === 38 || c === 40) { // Down/Up arrow
                            evt.preventDefault();
                            me[c === 38 ? "previous" : "next"]();
                        }
                    }
                },
                "keyup": function (evt) {

                    let c = evt.keyCode;
                    let autocomplete_url = "http://api.postcodes.io/places?q=";

                    // Arrows, Esc, Enter
                    if (c !== 37 && c !== 38 && c !== 39 && c !== 40 && c !== 27 && c !== 13) {

                        if (me.input.value.trim().length >= me.minChars) {

                            let request = new XMLHttpRequest();
                            request.open('GET', autocomplete_url + encodeURIComponent(me.input.value.trim()), true);

                            request.onload = function () {
                                if (request.status >= 200 && request.status < 400) {

                                    let data = JSON.parse(request.responseText);
                                    if (data.result.length > 0) {


                                        let ajax_list = [];

                                        for (let i = 0; i < data.result.length; i++) {
                                            const name = data.result[i].name_1;
                                            const countyUnitary = (comma) => {
                                                if(data.result[i].county_unitary == null) {
                                                    return '';
                                                } else {
                                                    if(comma) {
                                                        return ", " + data.result[i].county_unitary;
                                                    } else {
                                                        return " " + data.result[i].county_unitary;
                                                    }
                                                }
                                            };

                                            let item = {
                                                label: name + countyUnitary(true),
                                                value: name + countyUnitary(false)
                                            };

                                            ajax_list.push(item);
                                            // find and remove dupes. Postcode.io seems to be giving dupes now and then.
                                            ajax_list = ajax_list.filter((inputItem, index, self) =>
                                                index === self.findIndex((ogItem) => (
                                                    ogItem.label === inputItem.label && ogItem.value === inputItem.value
                                                ))
                                            );
                                        }

                                        me.list = ajax_list;
                                        me.evaluate();

                                    } else {

                                        console.warn("No results found");

                                        me.close({
                                            reason: "nomatches"
                                        });

                                    }

                                } else {

                                    console.warn("Error from API");

                                    ajax_list = [];

                                }
                            };

                            request.onerror = function() {
                                console.warn("Connection error");
                                ajax_list = [];
                            };

                            request.send();
                        }
                    }
                }
            },
            form: {
                "submit": this.close.bind(this, {
                    reason: "submit"
                })
            },
            ul: {
                "mousedown": function(evt) {
                    let li = evt.target;

                    if (li !== this) {

                        while (li && !/li/i.test(li.nodeName)) {
                            li = li.parentNode;
                        }

                        if (li && evt.button === 0) { // Only select on left click
                            evt.preventDefault();
                            me.select(li, evt.target);
                        }
                    }
                }
            }
        };

        $.bind(this.input, this._events.input);
        $.bind(this.input.form, this._events.form);
        $.bind(this.ul, this._events.ul);

        if (this.input.hasAttribute("list")) {
            this.list = "#" + this.input.getAttribute("list");
            this.input.removeAttribute("list");
        } else {
            this.list = this.input.getAttribute("data-list") || o.list || [];
        }

        _.all.push(this);
    };

    _.prototype = {
        set list(list) {
            if (Array.isArray(list)) {
                this._list = list;
            } else if (typeof list === "string" && list.indexOf(",") > -1) {
                this._list = list.split(/\s*,\s*/);
            } else { // Element or CSS selector
                list = $(list);

                if (list && list.children) {
                    let items = [];
                    slice.apply(list.children).forEach(function(el) {
                        if (!el.disabled) {
                            let text = el.textContent.trim();
                            let value = el.value || text;
                            let label = el.label || text;
                            if (value !== "") {
                                items.push({
                                    label: label,
                                    value: value
                                });
                            }
                        }
                    });
                    this._list = items;
                }
            }

            if (document.activeElement === this.input) {
                this.evaluate();
            }
        },

        get selected() {
            return this.index > -1;
        },

        get opened() {
            return this.isOpened;
        },

        close: function(o) {
            if (!this.opened) {
                return;
            }

            this.ul.setAttribute("hidden", "");
            this.isOpened = false;
            this.index = -1;

            $.fire(this.input, "allies-complete-close", o || {});
        },

        open: function() {
            this.ul.removeAttribute("hidden");
            this.isOpened = true;

            $.fire(this.input, "allies-complete-open");
        },

        destroy: function() {
            //remove events from the input and its form
            $.unbind(this.input, this._events.input);
            $.unbind(this.input.form, this._events.form);

            //move the input out of the allies-complete container and remove the container and its children
            let parentNode = this.container.parentNode;

            parentNode.insertBefore(this.input, this.container);
            parentNode.removeChild(this.container);

            //remove autocomplete and aria-autocomplete attributes
            this.input.removeAttribute("autocomplete");
            this.input.removeAttribute("aria-autocomplete");

            //remove this awesomeplete instance from the global array of instances
            let indexOfAlliesComplete = _.all.indexOf(this);

            if (indexOfAlliesComplete !== -1) {
                _.all.splice(indexOfAlliesComplete, 1);
            }
        },

        next: function() {
            let count = this.ul.children.length;
            this.goto(this.index < count - 1 ? this.index + 1 : (count ? 0 : -1));
        },

        previous: function() {
            let count = this.ul.children.length;
            let pos = this.index - 1;

            this.goto(this.selected && pos !== -1 ? pos : count - 1);
        },

        // Should not be used, highlights specific item without any checks!
        goto: function(i) {
            let lis = this.ul.children;

            if (this.selected) {
                lis[this.index].setAttribute("aria-selected", "false");
                lis[this.index].classList.remove("autocomplete__hover");
            }

            this.index = i;

            if (i > -1 && lis.length > 0) {
                lis[i].setAttribute("aria-selected", "true");

                lis[i].classList.add("autocomplete__hover");

                this.status.textContent = lis[i].textContent + ", list item " + (i + 1) + " of " + lis.length;

                this.input.setAttribute("aria-activedescendant", this.ul.id + "_item_" + this.index);

                // scroll to highlighted element in case parent's height is fixed
                this.ul.scrollTop = lis[i].offsetTop - this.ul.clientHeight + lis[i].clientHeight;

                $.fire(this.input, "allies-complete-highlight", {
                    text: this.suggestions[this.index]
                });
            }
        },

        select: function(selected, origin) {

            if (selected) {
                this.index = $.siblingIndex(selected);
            } else {
                selected = this.ul.children[this.index];
            }

            if (selected) {
                let suggestion = this.suggestions[this.index];

                let allowed = $.fire(this.input, "allies-complete-select", {
                    text: suggestion,
                    origin: origin || selected
                });

                if (allowed) {
                    this.close({
                        reason: "select"
                    });

                    $.fire(this.input, "allies-complete-selectcomplete", {
                        text: suggestion.value,
                    });
                }
            }
        },

        evaluate: function() {
            let me = this;
            let value = this.input.value;

            if (value.length >= this.minChars && this._list.length > 0) {
                this.index = -1;
                // Populate list with options that match
                this.ul.innerHTML = "";

                this.suggestions = this._list
                    .map(function(item) {
                        return new Suggestion(item);
                    });

                this.suggestions = this.suggestions.slice(0, this.maxItems);

                this.suggestions.forEach(function(text, index) {
                    let input_array = value.trim().split(" ");
                    // Escape any characters that might break regex
                    input_array.map($.regExpEscape);

                    // Put the array back together with pipe seperators fo regex
                    let input_string = input_array.join('|');

                    // Create the html with mark tags, then go back and get rid of wasteful mark tags before and after spaces
                    let html = value.trim() === '' ? text : text.replace(RegExp(input_string, "gi"), "<mark>$&</mark>").replace(RegExp($.regExpEscape("</mark> <mark>"), "gi"), " ");

                    child = $.create("li", {
                        innerHTML: html,
                        "aria-selected": "false",
                        "id": "allies_complete_list_" + AlliesComplete.numInstances + "_item_" + index,
                        className: "autocomplete__option",
                        "data-index": index
                    });

                    me.ul.appendChild(child);
                });

                if (this.ul.children.length === 0) {

                    this.status.textContent = "No results found";

                    this.close({
                        reason: "nomatches"
                    });

                } else {
                    this.open();

                    this.status.textContent = this.ul.children.length + " results found";
                }
            } else {
                this.close({
                    reason: "nomatches"
                });

                this.status.textContent = "No results found";
            }
        }
    };

    // Static methods/properties

    _.all = [];

    // Private functions

    function Suggestion(data) {
        let o = Array.isArray(data) ?
            {
                label: data[0],
                value: data[1]
            } :
            typeof data === "object" && "label" in data && "value" in data ? data : {
                label: data,
                value: data
            };

        this.label = o.label || o.value;
        this.value = o.value;
    }
    Object.defineProperty(Suggestion.prototype = Object.create(String.prototype), "length", {
        get: function() {
            return this.label.length;
        }
    });
    Suggestion.prototype.toString = Suggestion.prototype.valueOf = function() {
        return "" + this.label;
    };

    function configure(instance, properties, o) {
        for (let i in properties) {
            let initial = properties[i],
                attrValue = instance.input.getAttribute("data-" + i.toLowerCase());

            if (typeof initial === "number") {
                instance[i] = parseInt(attrValue);
            } else if (initial === false) { // Boolean options must be false by default anyway
                instance[i] = attrValue !== null;
            } else if (initial instanceof Function) {
                instance[i] = null;
            } else {
                instance[i] = attrValue;
            }

            if (!instance[i] && instance[i] !== 0) {
                instance[i] = (i in o) ? o[i] : initial;
            }
        }
    }

    // Helpers

    let slice = Array.prototype.slice;

    function $(expr, con) {
        return typeof expr === "string" ? (con || document).querySelector(expr) : expr || null;
    }

    function $$(expr, con) {
        return slice.call((con || document).querySelectorAll(expr));
    }

    $.create = function(tag, o) {
        let element = document.createElement(tag);

        for (let i in o) {
            let val = o[i];

            if (i === "inside") {
                $(val).appendChild(element);
            } else if (i === "around") {
                let ref = $(val);
                ref.parentNode.insertBefore(element, ref);
                element.appendChild(ref);
            } else if (i in element) {
                element[i] = val;
            } else {
                element.setAttribute(i, val);
            }
        }

        return element;
    };

    $.bind = function(element, o) {
        if (element) {
            for (let event in o) {
                let callback = o[event];

                event.split(/\s+/).forEach(function(event) {
                    element.addEventListener(event, callback);
                });
            }
        }
    };

    $.unbind = function(element, o) {
        if (element) {
            for (let event in o) {
                let callback = o[event];

                event.split(/\s+/).forEach(function(event) {
                    element.removeEventListener(event, callback);
                });
            }
        }
    };

    $.fire = function(target, type, properties) {
        let evt = document.createEvent("HTMLEvents");

        evt.initEvent(type, true, true);

        for (let j in properties) {
            evt[j] = properties[j];
        }

        return target.dispatchEvent(evt);
    };

    $.regExpEscape = function(s) {
        return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
    };

    $.siblingIndex = function(el) {
        return el.dataset.index;
    };

    // Initialization

    function init() {
        $$("input.allies-complete").forEach(function(input) {
            new _(input);
        });
    }

    // Are we in a browser? Check for Document constructor
    if (typeof Document !== "undefined") {
        // DOM already loaded?
        if (document.readyState !== "loading") {
            init();
        } else {
            // Wait for it
            document.addEventListener("DOMContentLoaded", init);
        }
    }

    _.$ = $;
    _.$$ = $$;

    // Make sure to export AlliesComplete on self when in a browser
    if (typeof self !== "undefined") {
        self.AlliesComplete = _;
    }

    // Expose AlliesComplete as a CJS module
    if (typeof module === "object" && module.exports) {
        module.exports = _;
    }

    return _;

}());