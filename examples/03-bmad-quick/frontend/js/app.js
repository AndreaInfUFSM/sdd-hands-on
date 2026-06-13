(function () {
  'use strict';

  const BACKEND_URL = 'BACKEND_URL_PLACEHOLDER';

  if (BACKEND_URL === 'BACKEND_URL_PLACEHOLDER') {
    document.body.innerHTML = '<div style="padding:2rem;text-align:center;color:#dc3545;"><h1>Configuration Required</h1><p>Set the BACKEND_URL constant in frontend/js/app.js to your Google Apps Script deployment URL before deploying.</p></div>';
    return;
  }

  const els = {
    loading: document.getElementById('loading-indicator'),
    error: document.getElementById('error-message'),
    noChallenge: document.getElementById('no-challenge'),
    challengeContainer: document.getElementById('challenge-container'),
    feedbackContainer: document.getElementById('feedback-container'),
    feedbackContent: document.getElementById('feedback-content'),
    afterSubmission: document.getElementById('after-submission-blocks'),
    courseName: document.getElementById('course-name'),
    version: document.getElementById('frontend-version'),
    submitBtn: document.getElementById('submit-btn'),
    responseForm: document.getElementById('response-form'),
    introBlocks: document.getElementById('intro-blocks'),
    promptBlocks: document.getElementById('prompt-blocks'),
    responseFields: document.getElementById('response-fields')
  };

  const api = new Api(BACKEND_URL);
  const challengeRenderer = new ChallengeRenderer();
  const responseRenderer = new ResponseRenderer(els.responseForm, els.responseFields);
  const feedbackRenderer = new FeedbackRenderer();

  let appConfig = {};
  let currentChallenge = null;
  let submissionInProgress = false;

  function showLoading() {
    els.loading.classList.remove('hidden');
    els.error.classList.add('hidden');
    els.noChallenge.classList.add('hidden');
    els.challengeContainer.classList.add('hidden');
    els.feedbackContainer.classList.add('hidden');
  }

  function hideLoading() {
    els.loading.classList.add('hidden');
  }

  function showError(message) {
    els.error.textContent = message || 'An unexpected error occurred.';
    els.error.classList.remove('hidden');
    hideLoading();
  }

  function init() {
    loadApp();
  }

  async function loadApp() {
    showLoading();
    try {
      appConfig = await api.fetchConfig();
      if (appConfig.course_name) {
        els.courseName.textContent = appConfig.course_name;
      }
      if (appConfig.frontend_version) {
        els.version.textContent = 'v' + appConfig.frontend_version;
      }

      let students = [];
      try {
        students = await api.fetchStudents();
      } catch (e) {
        showError('Could not load student list. Please try again later.');
        return;
      }

      const selector = new StudentSelector(
        document.getElementById('student-input'),
        document.getElementById('student-suggestions'),
        document.getElementById('student-status'),
        {
          allowManual: String(appConfig.allow_manual_name).trim().toLowerCase() === 'true',
          students: students.filter(function(s) { return s && s.display_name; })
        }
      );
      window._selector = selector;

      let challenge = null;
      try {
        challenge = await api.fetchChallenge();
      } catch (e) {
        showError('Could not load the challenge. Please try again later.');
        return;
      }

      if (!challenge) {
        hideLoading();
        els.noChallenge.classList.remove('hidden');
        return;
      }

      currentChallenge = challenge;
      renderChallenge(challenge);
      hideLoading();
      els.challengeContainer.classList.remove('hidden');

    } catch (e) {
      showError('Failed to initialize the application: ' + e.message);
    }
  }

  function renderChallenge(challenge) {
    if (challenge.title) {
      const titleEl = document.createElement('h2');
      titleEl.textContent = challenge.title;
      els.promptBlocks.parentNode.insertBefore(titleEl, els.promptBlocks);
    }

    challengeRenderer.renderBlocks(challenge.intro, els.introBlocks);
    challengeRenderer.renderBlocks(challenge.prompt, els.promptBlocks);

    responseRenderer.render(challenge.response);

    updateSubmitButton();
  }

  function updateSubmitButton() {
    if (!window._selector) return;
    const info = window._selector.getSelectedInfo();
    els.submitBtn.disabled = !info;
  }

  document.getElementById('student-input').addEventListener('input', function () {
    if (els.feedbackContainer.classList.contains('hidden')) {
      updateSubmitButton();
    }
  });

  els.responseForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (submissionInProgress) return;

    const selector = window._selector;
    const studentInfo = selector ? selector.getSelectedInfo() : null;

    const studentError = selector ? selector.validate() : 'Please type or select your name.';
    if (studentError) {
      showError(studentError);
      return;
    }

    if (!responseRenderer.validate()) {
      return;
    }

    submissionInProgress = true;
    els.submitBtn.disabled = true;
    els.submitBtn.textContent = 'Submitting...';
    responseRenderer.setDisabled(true);
    if (selector) selector.input.disabled = true;

    const responseValues = responseRenderer.getValues();
    const feedbackModel = currentChallenge.feedback || null;

    const payload = {
      submission_id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      challenge_id: currentChallenge.challenge_id,
      challenge_version: currentChallenge.version || 1,
      student_id: studentInfo.student_id,
      student_display_name: studentInfo.display_name,
      student_source: studentInfo.source,
      response_json: responseValues,
      feedback_model: feedbackModel,
      frontend_version: appConfig.frontend_version || '1.0.0'
    };

    try {
      const result = await api.submitResponse(payload);
      submissionInProgress = false;
      els.challengeContainer.classList.add('hidden');
      feedbackRenderer.render(result.feedback || feedbackModel, responseValues, els.feedbackContent);
      challengeRenderer.renderBlocks(currentChallenge.after_submission, els.afterSubmission);
      els.feedbackContainer.classList.remove('hidden');
      els.submitBtn.textContent = 'Submitted';
    } catch (e) {
      submissionInProgress = false;
      els.submitBtn.textContent = 'Submit';
      els.submitBtn.disabled = false;
      responseRenderer.setDisabled(false);
      if (selector) selector.input.disabled = false;
      showError('Submission failed: ' + e.message);
    }
  });

  document.addEventListener('DOMContentLoaded', init);
})();
