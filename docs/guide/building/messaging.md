# Messaging

[Chrome Docs](https://developer.chrome.com/docs/extensions/develop/concepts/messaging) • [Firefox Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#communicating_with_background_scripts)

The vanilla APIs for sending messages are difficult to use, but possible. Read the docs linked above to learn more.

## Alternatives

Instead of using the APIs directly, it's recommended to install an NPM package that wraps around the vanilla APIs.

Here are some popular messaging libraries that support all browsers and work with WXT:

- [`trpc-chrome`](https://www.npmjs.com/package/trpc-chrome) - [tRPC](https://trpc.io/) adapter for Web Extensions.
- [`webext-bridge`](https://www.npmjs.com/package/webext-bridge) - Messaging in WebExtensions made super easy. Out of the box.
- [`@webext-core/messaging`](https://www.npmjs.com/package/@webext-core/messaging) - Light weight, type-safe wrapper around the web extension messaging APIs
- [`@webext-core/proxy-service`](https://www.npmjs.com/package/@webext-core/proxy-service) - A type-safe wrapper around the web extension messaging APIs that lets you call a function from anywhere, but execute it in the background.
