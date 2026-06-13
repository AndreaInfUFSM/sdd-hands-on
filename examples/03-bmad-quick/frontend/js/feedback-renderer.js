class FeedbackRenderer {
  render(feedback, answers, container) {
    container.innerHTML = '';
    if (!feedback) return;

    switch (feedback.mode) {
      case 'static':
        this._renderStatic(feedback, container);
        break;
      case 'answer_key':
        this._renderAnswerKey(feedback, answers, container);
        break;
      case 'rule_based':
        this._renderRuleBased(feedback, answers, container);
        break;
      case 'hybrid':
        this._renderHybrid(feedback, answers, container);
        break;
      default:
        if (feedback.message) {
          this._renderInfo(feedback.message, container);
        }
    }
  }

  _renderStatic(feedback, container) {
    if (feedback.message) {
      this._renderInfo(feedback.message, container);
    }
  }

  _renderAnswerKey(feedback, answers, container) {
    if (!feedback.choice_feedback) return;
    if (!answers) return;
    const cf = feedback.choice_feedback;
    const fieldId = cf.field_id;
    const answer = answers[fieldId];
    const correctOptions = Array.isArray(cf.correct_options) ? cf.correct_options : [cf.correct_options];
    const isCorrect = correctOptions.includes(answer);

    const div = document.createElement('div');
    if (isCorrect) {
      div.className = 'feedback-block correct';
      div.textContent = cf.messages && cf.messages.correct
        ? cf.messages.correct
        : 'Correct!';
    } else {
      div.className = 'feedback-block incorrect';
      div.textContent = cf.messages && cf.messages.incorrect
        ? cf.messages.incorrect
        : 'Not quite right.';
    }
    container.appendChild(div);
  }

  _renderRuleBased(feedback, answers, container) {
    if (!answers) return;
    const rules = feedback.rules || feedback.explanation_rules || [];
    if (!Array.isArray(rules) || rules.length === 0) {
      if (feedback.default_message) {
        this._renderInfo(feedback.default_message, container);
      }
      return;
    }

    let anyMatched = false;
    rules.forEach(rule => {
      if (!rule.condition) return;
      const fieldId = rule.condition.field_id;
      const fieldAnswer = fieldId && answers[fieldId] ? answers[fieldId] : '';
      if (!fieldAnswer) return;

      if (this._checkCondition(rule.condition, fieldAnswer)) {
        anyMatched = true;
        const div = document.createElement('div');
        div.className = 'feedback-block info';
        div.textContent = rule.message || '';
        container.appendChild(div);
      }
    });

    if (!anyMatched && feedback.default_message) {
      this._renderInfo(feedback.default_message, container);
    }
  }

  _renderHybrid(feedback, answers, container) {
    if (!answers) return;
    if (feedback.choice_feedback) {
      this._renderAnswerKey(feedback, answers, container);
    }
    const rules = feedback.explanation_rules || feedback.rules || [];
    if (Array.isArray(rules) && rules.length > 0) {
      const ruleFeedback = {
        rules: rules,
        default_message: feedback.default_message,
        field_id: feedback.explanation_field_id
      };
      this._renderRuleBased(ruleFeedback, answers, container);
    } else if (feedback.default_message) {
      this._renderInfo(feedback.default_message, container);
    }
  }

  _checkCondition(condition, answer) {
    if (!condition || !answer) return false;
    switch (condition.type) {
      case 'contains_any':
        if (!Array.isArray(condition.terms)) return false;
        const lower = String(answer).toLowerCase();
        return condition.terms.some(t => String(t).toLowerCase() && lower.includes(String(t).toLowerCase()));
      case 'equals':
        return String(answer).toLowerCase() === String(condition.value).toLowerCase();
      default:
        return false;
    }
  }

  _renderInfo(message, container) {
    const div = document.createElement('div');
    div.className = 'feedback-block info';
    div.textContent = message || '';
    container.appendChild(div);
  }
}
