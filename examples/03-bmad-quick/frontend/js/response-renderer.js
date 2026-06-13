class ResponseRenderer {
  constructor(formEl, fieldsContainer) {
    this.form = formEl;
    this.container = fieldsContainer;
  }

  render(responseModel) {
    this.container.innerHTML = '';
    this._fields = [];
    if (!responseModel) return;

    if (responseModel.type === 'mixed' && Array.isArray(responseModel.fields)) {
      responseModel.fields.forEach(f => this._renderField(f));
    } else {
      this._renderField(responseModel);
    }
  }

  _renderField(field) {
    const group = document.createElement('div');
    group.className = 'field-group';
    group.dataset.fieldId = field.id;

    const label = document.createElement('label');
    label.textContent = field.label || '';
    if (field.required) {
      const req = document.createElement('span');
      req.textContent = ' *';
      req.style.color = 'var(--color-error)';
      label.appendChild(req);
    }
    group.appendChild(label);

    let input;

    switch (field.type) {
      case 'open_text':
        input = document.createElement('textarea');
        input.placeholder = field.placeholder || '';
        if (field.max_length !== undefined && field.max_length !== null) {
          input.maxLength = field.max_length;
        }
        input.dataset.minLength = field.min_length || 0;
        group.appendChild(input);
        break;

      case 'single_choice':
        input = document.createElement('div');
        input.className = 'options-group';
        if (Array.isArray(field.options)) {
          field.options.forEach(opt => {
            const optDiv = document.createElement('div');
            optDiv.className = 'option-item';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'field-' + field.id;
            radio.value = opt.id;
            const optLabel = document.createElement('label');
            optLabel.textContent = opt.label;
            optDiv.appendChild(radio);
            optDiv.appendChild(optLabel);
            input.appendChild(optDiv);
          });
        }
        group.appendChild(input);
        break;

      case 'code':
        input = document.createElement('textarea');
        input.placeholder = field.placeholder || '';
        input.spellcheck = false;
        if (field.language) {
          const langHint = document.createElement('div');
          langHint.className = 'field-description';
          langHint.textContent = 'Language: ' + field.language;
          group.appendChild(langHint);
        }
        group.appendChild(input);
        break;

      default:
        return;
    }

    const errorEl = document.createElement('div');
    errorEl.className = 'field-error hidden';
    group.appendChild(errorEl);
    group._errorEl = errorEl;

    this.container.appendChild(group);
    field._groupEl = group;
  }

  validate() {
    let valid = true;
    const groups = this.container.querySelectorAll('.field-group');
    groups.forEach(group => {
      const errorEl = group._errorEl;
      const fieldId = group.dataset.fieldId;
      let message = null;

      const textarea = group.querySelector('textarea');
      if (textarea) {
        const minLen = parseInt(textarea.dataset.minLength) || 0;
        if (textarea.required !== false) {
          if (!textarea.value.trim()) {
            message = 'This field is required.';
          } else if (textarea.value.trim().length < minLen) {
            message = 'Minimum length is ' + minLen + ' characters.';
          }
        }
      }

      const radios = group.querySelectorAll('input[type="radio"]');
      if (radios.length > 0) {
        const checked = group.querySelector('input[type="radio"]:checked');
        if (!checked) {
          message = 'Please select an option.';
        }
      }

      if (message) {
        valid = false;
        group.classList.add('invalid');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.classList.remove('hidden');
        }
      } else {
        group.classList.remove('invalid');
        if (errorEl) errorEl.classList.add('hidden');
      }
    });
    return valid;
  }

  getValues() {
    const values = {};
    const groups = this.container.querySelectorAll('.field-group');
    groups.forEach(group => {
      const fieldId = group.dataset.fieldId;
      const textarea = group.querySelector('textarea');
      if (textarea) {
        values[fieldId] = textarea.value.trim();
        return;
      }
      const checked = group.querySelector('input[type="radio"]:checked');
      if (checked) {
        values[fieldId] = checked.value;
      }
    });
    return values;
  }

  setDisabled(disabled) {
    const inputs = this.container.querySelectorAll('textarea, input');
    inputs.forEach(el => el.disabled = disabled);
  }
}
