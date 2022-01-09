declare global {
  interface Window {
    grecaptcha: {
      execute: (key: string, action: { action: string }) => Promise<string>;
    };
  }
}

// Large modifications from https://stackoverflow.com/a/64427166
export default class ReCAPTCHA {
  siteKey: string;

  action: string;

  constructor(siteKey: string, action: string) {
    this.siteKey = siteKey;
    this.action = action;
  }

  async getToken() {
    const token = await window.grecaptcha.execute(this.siteKey, {
      action: this.action,
    });
    return token as string;
  }
}
