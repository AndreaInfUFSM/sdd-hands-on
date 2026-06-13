function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  switch (action) {
    case 'config':
      return jsonResponse_(getConfig_());
    case 'students':
      return jsonResponse_(getActiveStudents_());
    case 'challenge':
      return jsonResponse_(getChallenge_());
    default:
      return jsonResponse_({ error: 'Unknown action' }, 400);
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ error: 'Missing request body' }, 400);
    }
    const data = JSON.parse(e.postData.contents);
    const error = validateSubmission_(data);
    if (error) {
      return jsonResponse_({ error: error }, 400);
    }
    const feedback = computeFeedback_(data);
    const row = buildRow_(data, feedback);
    appendRow_('Responses', row);
    return jsonResponse_({ success: true, feedback: feedback });
  } catch (err) {
    return jsonResponse_({ error: 'Invalid payload: ' + err.message }, 400);
  }
}

function jsonResponse_(data, statusCode) {
  statusCode = statusCode || 200;
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error('Sheet not found: ' + name);
  }
  return sheet;
}

function getRows_(sheetName) {
  const sheet = getSheet_(sheetName);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function getConfig_() {
  const rows = getRows_('AppConfig');
  var config = {
    course_name: 'Programming Paradigms',
    timezone: 'America/Sao_Paulo',
    allow_manual_name: false,
    frontend_version: '1.0.0',
    challenge_selection_mode: 'daily'
  };
  rows.forEach(function(row) {
    if (row.key && row.value !== undefined) {
      config[row.key] = row.value;
    }
  });
  return config;
}

function getActiveStudents_() {
  const rows = getRows_('Students');
  var result = [];
  rows.forEach(function(row) {
    if (row.active !== false && row.active !== 'FALSE' && row.active !== 'false') {
      result.push({
        student_id: String(row.student_id || ''),
        display_name: String(row.display_name || '')
      });
    }
  });
  return result;
}

function getChallenge_() {
  const rows = getRows_('Challenges');
  if (!rows || rows.length === 0) {
    return null;
  }
  const tz = 'America/Sao_Paulo';
  const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var active = null;
  rows.forEach(function(row) {
    if (row.active === false || row.active === 'FALSE' || row.active === 'false') return;
    if (String(row.date) === today) {
      try {
        active = JSON.parse(row.challenge_json);
      } catch (e) {
        active = null;
      }
    }
  });
  return active;
}

function validateSubmission_(data) {
  if (!data.challenge_id) return 'Missing challenge_id';
  if (!data.student_display_name) return 'Missing student_display_name';
  if (data.student_source !== 'listed' && data.student_source !== 'manual') {
    return 'Invalid student_source';
  }
  if (!data.response_json) return 'Missing response_json';
  if (typeof data.response_json !== 'object') return 'response_json must be an object';
  return null;
}

function computeFeedback_(data) {
  if (!data.feedback_model) return null;
  return data.feedback_model;
}

function buildRow_(data, feedback) {
  var now = new Date();
  var tz = 'America/Sao_Paulo';
  return [
    Utilities.formatDate(now, tz, 'yyyy-MM-dd HH:mm:ss'),
    data.challenge_id,
    data.challenge_version || 1,
    data.student_id || '',
    data.student_display_name,
    data.student_source,
    JSON.stringify(data.response_json),
    JSON.stringify(feedback || {}),
    data.elapsed_seconds || 0,
    data.frontend_version || '1.0.0'
  ];
}

function appendRow_(sheetName, row) {
  const sheet = getSheet_(sheetName);
  sheet.appendRow(row);
}
