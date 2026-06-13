class StudentSelector {
  constructor(inputEl, suggestionsEl, statusEl, options) {
    this.input = inputEl;
    this.suggestions = suggestionsEl;
    this.status = statusEl;
    this.allowManual = options.allowManual || false;
    this.students = (options.students || []).filter(function(s) { return s && s.display_name; });
    this.selectedStudent = null;
    this._onSelectCallback = null;

    this.input.addEventListener('input', () => this._onInput());
    this.input.addEventListener('blur', () => this._onBlur());
    this.input.addEventListener('focus', () => this._onFocus());
    this.suggestions.addEventListener('mousedown', (e) => {
      const item = e.target.closest('li');
      if (item && item.dataset.id !== undefined) {
        this._select(item.dataset.id, item.dataset.name);
      }
    });
  }

  onSelect(callback) {
    this._onSelectCallback = callback;
  }

  _onInput() {
    const value = this.input.value.trim();
    if (!value) {
      this._hideSuggestions();
      this.selectedStudent = null;
      this._updateStatus(null);
      if (this._onSelectCallback) this._onSelectCallback(null);
      return;
    }

    if (this.selectedStudent && value === this.selectedStudent.display_name) {
      this._showSuggestions(this.students.filter(s =>
        s.display_name.toLowerCase().includes(value.toLowerCase())
      ));
      return;
    }

    if (this.selectedStudent && value !== this.selectedStudent.display_name) {
      this.selectedStudent = null;
    }

    const matches = this.students.filter(s =>
      s.display_name.toLowerCase().includes(value.toLowerCase())
    );

    if (matches.length > 0) {
      this._showSuggestions(matches);
    } else {
      this._hideSuggestions();
      if (this.allowManual && value.length > 0) {
        this._updateStatus({ source: 'manual', name: value });
      } else {
        this._updateStatus(null);
      }
    }
  }

  _onBlur() {
    setTimeout(() => this._hideSuggestions(), 200);
  }

  _onFocus() {
    if (this.input.value.trim() && !this.selectedStudent) {
      this.input.dispatchEvent(new Event('input'));
    }
  }

  _showSuggestions(matches) {
    this.suggestions.innerHTML = '';
    matches.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s.display_name;
      li.dataset.id = String(s.student_id);
      li.dataset.name = s.display_name;
      this.suggestions.appendChild(li);
    });
    this.suggestions.classList.remove('hidden');
  }

  _hideSuggestions() {
    this.suggestions.classList.add('hidden');
  }

  _select(id, name) {
    this.selectedStudent = { student_id: String(id), display_name: name };
    this.input.value = name;
    this._hideSuggestions();
    this._updateStatus({ source: 'listed', name: name });
    if (this._onSelectCallback) this._onSelectCallback(this.selectedStudent);
  }

  _updateStatus(info) {
    if (!info) {
      this.status.classList.add('hidden');
      return;
    }
    this.status.classList.remove('hidden');
    if (info.source === 'listed') {
      this.status.textContent = 'Known student: ' + info.name;
      this.status.className = 'field-status listed';
    } else {
      this.status.textContent = 'Entering as unlisted participant: ' + info.name;
      this.status.className = 'field-status manual';
    }
  }

  getSelectedInfo() {
    const value = this.input.value.trim();
    if (!value) return null;
    if (this.selectedStudent && value === this.selectedStudent.display_name) {
      return {
        student_id: this.selectedStudent.student_id,
        display_name: this.selectedStudent.display_name,
        source: 'listed'
      };
    }
    if (this.allowManual) {
      return {
        student_id: null,
        display_name: value,
        source: 'manual'
      };
    }
    return null;
  }

  validate() {
    const info = this.getSelectedInfo();
    if (!info) return 'Please type or select your name.';
    if (info.source === 'manual' && !this.allowManual) {
      return 'Please select your name from the list.';
    }
    return null;
  }
}
