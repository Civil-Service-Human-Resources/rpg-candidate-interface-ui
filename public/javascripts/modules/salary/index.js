const { document } = window;

export default class MinMaxSalary {
    constructor(minId, maxId) {
        // get the two select fields
        this.minField = document.getElementById(minId);
        this.maxField = document.getElementById(maxId);

        // if one or both are missing from the page we just need to abort
        if (!this.minField || !this.maxField) return;

        // remove the default option, i.e. 'No minimum' and store the
        // remaining options, we'll need these later
        this.minOptions = [...this.minField.options].slice(1);
        this.maxOptions = [...this.maxField.options].slice(1);

        // get the default option labels for translation purposes
        this.minDefault = [...this.minField.options].shift(0, 1);
        this.maxDefault = [...this.maxField.options].shift(0, 1);

        // set up the select lists on page load
        this.updateMinOptions();
        this.updateMaxOptions();

        // listen for the user selecting a new option
        this.minField.addEventListener('change', this.updateMaxOptions.bind(this));
        this.maxField.addEventListener('change', this.updateMinOptions.bind(this));
    }

    updateMaxOptions() {
        const currentMinValue = parseInt(this.minField.value, 10) || 0;
        const currentMaxValue = parseInt(this.maxField.value, 10);
        this.maxField.innerHTML = null;

        this.maxField.append(this.createOption(this.maxDefault.value, this.maxDefault.innerHTML));

        for (let i = 0; i < this.maxOptions.length; i += 1) {
            const option = this.maxOptions[i];
            if (currentMinValue === 0 || parseInt(option.value, 10) > currentMinValue) {
                // eslint-disable-next-line max-len
                this.maxField.append(this.createOption(option.value, option.innerHTML, currentMaxValue));
            }
        }
    }

    updateMinOptions() {
        const currentMaxValue = parseInt(this.maxField.value, 10) || 0;
        const currentMinValue = parseInt(this.minField.value, 10);
        this.minField.innerHTML = '';

        this.minField.prepend(this.createOption(this.minDefault.value, this.minDefault.innerHTML));

        for (let i = 0; i < this.minOptions.length; i += 1) {
            const option = this.minOptions[i];
            if (currentMaxValue === 0 || parseInt(option.value, 10) < currentMaxValue) {
                // eslint-disable-next-line max-len
                this.minField.append(this.createOption(option.value, option.innerHTML, currentMinValue));
            }
        }
    }

    createOption(val, label, currentValue) {
        const option = document.createElement('option');
        option.setAttribute('value', val);
        option.innerHTML = label;
        option.selected = parseInt(currentValue, 10) === parseInt(val, 10);

        return option;
    }
}
