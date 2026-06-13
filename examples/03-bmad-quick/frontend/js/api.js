class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.timeout = 15000;
  }

  async _fetch(url, options) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(timer);
    }
  }

  async fetchConfig() {
    const url = this.baseUrl + '?action=config';
    const res = await this._fetch(url);
    if (!res.ok) throw new Error('Failed to load configuration');
    const data = await res.json();
    if (data && data.error) throw new Error(data.error);
    return data;
  }

  async fetchStudents() {
    const url = this.baseUrl + '?action=students';
    const res = await this._fetch(url);
    if (!res.ok) throw new Error('Failed to load student list');
    const data = await res.json();
    if (data && data.error) throw new Error(data.error);
    return data;
  }

  async fetchChallenge() {
    const url = this.baseUrl + '?action=challenge';
    const res = await this._fetch(url);
    if (!res.ok) throw new Error('Failed to load challenge');
    const data = await res.json();
    if (data && data.error) throw new Error(data.error);
    return data;
  }

  async submitResponse(payload) {
    const res = await this._fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data && data.error) throw new Error(data.error);
    return data;
  }
}
