---
outline: deep
---

# Content Scripts

To add a content script, refer to [Entrypoint Types > Content Script](/guide/entrypoint-types/content-script). This page discusses the nuonces of writing content scripts with WXT.

## Context

The first argument to a content script's `main` function is it's "context".

```ts
// entrypoints/content.ts
export default defineContentScript({
  main(ctx) {},
});
```

This object is responsible for tracking whether or not the content script's context is "invalidated". Most browsers, by default, do not stop content scripts if the extension is uninstalled, updated, or disabled. When this happens, content scripts start reproting this error:

```
Error: Extension context invalidated.
```

The `ctx` object provides several helpers to stop asynchronous code from running once the context is invalidated:

```ts
ctx.addEventListener(...);
ctx.setTimeout(...);
ctx.setInterval(...);
ctx.requestAnimationFrame(...);
// and more
```

You can also check if the context is invalidated manually:

```ts
if (ctx.isValid) {
  // do something
}
// OR
if (ctx.isInvalid) {
  // do something
}
```

## CSS

In regular web extensions, CSS for content scripts is usually a separate CSS file, that is added to a CSS array in the manifest:

```json
{
  "content_scripts": [
    {
      "css": ["content/style.css"],
      "js": ["content/index.js"],
      "matches": ["*://*/*"]
    }
  ]
}
```

In WXT, to add CSS to a content script, simply import the CSS file into your JS entrypoint, and WXT will automatically add the bundled CSS output to the `css` array.

```ts
// entrypoints/content/index.ts
import './style.css';

export default defineContentScript({
  // ...
});
```

To create a standalone content script that only includes a CSS file:

1. Create the CSS file: `entrypoints/example.content.css`
2. Use the `build:manfiestGenerated` hook to add the content script to the manifest:
   ```ts
   // wxt.config.ts
   export default defineConfig({
     hooks: {
       "build:manifestGenerated": (wxt, manifest) => {
         manifest.content_scripts ??= [];
         manifest.content_scripts.push({
           // Build extension once to see where your CSS get's written to
           css: ["content-scripts/example.css"],
           matches: ["*://*/*"]
         )
       }
     }
   })
   ```

## UI

WXT provides 3 built-in utilities for adding UIs to a page from a content script:

- [Integrated](#integrated) - `createIntegratedUi`
- [Shadow Root](#shadow-root) -`createShadowRootUi`
- [IFrame](#iframe) - `createIframeUi`

Each has their own set of advantages and disadvantages.

| Method      | Isolated Styles |   Isolated Events   | HMR | Use page's context |
| ----------- | :-------------: | :-----------------: | :-: | :----------------: |
| Integrated  |       ❌        |         ❌          | ❌  |         ✅         |
| Shadow Root |       ✅        | ✅ (off by default) | ❌  |         ✅         |
| IFrame      |       ✅        |         ✅          | ✅  |         ❌         |

### Integrated

Integrated content script UIs are injected alongside the content of a page. This means that they are affected by CSS on that page.

:::code-group

```ts [Vanilla]
// entrypoints/example-ui.content.ts
export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Append children to the container
        const app = document.createElement('p');
        app.textContent = '...';
        container.append(app);
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

```ts [Vue]
// entrypoints/example-ui.content/index.ts
import { createApp } from 'vue';
import App from './App.vue';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create the app and mount it to the UI container
        const app = createApp(App);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app.unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

```tsx [React]
// entrypoints/example-ui.content/index.tsx
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root.unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

```ts [Svelte]
// entrypoints/example-ui.content/index.ts
import App from './App.svelte';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create the Svelte app inside the UI container
        const app = new App({
          target: container,
        });
        return app;
      },
      onRemove: (app) => {
        // Destroy the app when the UI is removed
        app.$destroy();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

```tsx [Solid]
// entrypoints/example-ui.content/index.ts
import { render } from 'solid-js/web';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Render your app to the UI container
        const unmount = render(() => <div>...</div>, container);
      },
      onRemove: (unmount) => {
        // Unmount the app when the UI is removed
        unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

:::

See the [API Reference](/api/reference/wxt/client/functions/createIntegratedUi) for the complete list of options.

### Shadow Root

Often in web extensions, you don't want your content script's CSS affecting the page, or vise-versa. The [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) API is ideal for this.

WXT's [`createShadowRootUi`](/api/reference/wxt/client/functions/createShadowRootUi) abstracts all the `ShadowRoot` setup away, making it easy to create UIs whose styles are isolated from the page. It also supports an optional `isolateEvents` parameter to further isolate user interactions.

To use `createShadowRootUi`, follow these steps:

1. Import your CSS file at the top of your content script
2. Set [`cssInjectionMode: "ui"`](/api/reference/wxt/interfaces/BaseContentScriptEntrypointOptions#cssinjectionmode) inside `defineContentScript`
3. Define your UI with `createShadowRootUi()`
4. Mount the UI so it is visible to users

:::code-group

```ts [Vanilla]
// 1. Import the style
import './style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        // Define how your UI will be mounted inside the container
        const app = document.createElement('p');
        app.textContent = 'Hello world!';
        container.append(app);
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

```ts [Vue]
// 1. Import the style
import './style.css';
import { createApp } from 'vue';
import App from './App.vue';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Define how your UI will be mounted inside the container
        const app = createApp(App);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app?.unmount();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

```tsx [React]
// 1. Import the style
import './style.css';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement('div');
        container.append(app);

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

```ts [Svelte]
// 1. Import the style
import './style.css';
import App from './App.svelte';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create the Svelte app inside the UI container
        const app = new App({
          target: container,
        });
        return app;
      },
      onRemove: (app) => {
        // Destroy the app when the UI is removed
        app?.$destroy();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

```tsx [Solid]
// 1. Import the style
import './style.css';
import { render } from 'solid-js/web';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Render your app to the UI container
        const unmount = render(() => <div>...</div>, container);
      },
      onRemove: (unmount) => {
        // Unmount the app when the UI is removed
        unmount?.();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

:::

See the [API Reference](/api/reference/wxt/client/functions/createShadowRootUi) for the complete list of options.

Full examples:

- [react-content-script-ui](https://github.com/wxt-dev/examples/tree/main/examples/react-content-script-ui)
- [tailwindcss](https://github.com/wxt-dev/examples/tree/main/examples/tailwindcss)

### IFrame

If you don't need to run your UI in the same frame as the content script, you can use an IFrame to host your UI instead. Since an IFrame just hosts an HTML page, **_HMR is supported_**.

WXT provides a helper function, [`createIframeUi`](/api/reference/wxt/client/functions/createIframeUi), which simplifies setting up the IFrame.

1. Create an HTML page that will be loaded into your IFrame
   ```html
   <!-- entrypoints/example-iframe.html -->
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Your Content Script IFrame</title>
     </head>
     <body>
       <!-- ... -->
     </body>
   </html>
   ```
1. Add the page to the manifest's `web_accessible_resources`
   ```ts
   // wxt.config.ts
   export default defineConfig({
     manifest: {
       web_accessible_resources: [
         {
           resources: ['example-iframe.html'],
           matches: [...],
         },
       ],
     },
   });
   ```
1. Create and mount the IFrame

   ```ts
   export default defineContentScript({
     matches: ['<all_urls>'],

     main(ctx) {
       // Define the UI
       const ui = createIframeUi(ctx, {
         page: '/example-iframe.html',
         position: 'inline',
         anchor: 'body',
         onMount: (wrapper, iframe) => {
           // Add styles to the iframe like width
           iframe.width = '123';
         },
       });

       // Show UI to user
       ui.mount();
     },
   });
   ```

See the [API Reference](/api/reference/wxt/client/functions/createIframeUi) for the complete list of options.
