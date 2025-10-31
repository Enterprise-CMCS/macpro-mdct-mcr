// From https://github.com/mswjs/jest-fixed-jsdom
import JSDOMEnvironment from "jest-environment-jsdom";

class FixedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);
    this.global.TextEncoder = TextEncoder;
  }
}

module.exports = FixedJSDOMEnvironment;
