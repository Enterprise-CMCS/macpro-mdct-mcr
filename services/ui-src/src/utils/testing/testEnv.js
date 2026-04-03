// From https://github.com/mswjs/jest-fixed-jsdom
import JSDOMEnvironment from "jest-environment-jsdom";

class FixedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);
    this.global.TextEncoder = TextEncoder;
    // Expose JSDOM's reconfigure so tests can change window.location.origin,
    // which is non-configurable and cannot be mocked with Object.defineProperty.
    this.global.reconfigureJsdomLocation = (url) =>
      this.dom.reconfigure({ url });
  }
}

module.exports = FixedJSDOMEnvironment;
