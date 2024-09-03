---
outline: deep
---

# Entrypoints

[[toc]]

## Overview

All files inside the `entrypoints/` directory are built by WXT and bundled into the `.output` directory. They can be HTML, JS, CSS, or any variant of those file types supported by Vite (Pug, TS, JSX, SCSS, etc).

Here's an example set of entrypoints:

```
entrypoints/
├─ popup/
│  ├─ index.html
│  ├─ main.ts
│  └─ style.css
├─ background.ts
└─ content.ts
```

## Listed vs Unlisted

For web extensions, there are two types of entrypoints:

1. **Listed**: Referenced in the `manifest.json`
2. **Unlisted**: Not referenced in the `manifest.json`

Throughout the rest of WXT's documentation, listed files are refered to by name. For example:

- Popup
- Options
- Background
- Content Scripts
- Etc.

Some examples of "unlisted" entrypoints:

- A welcome page shown when the extension is installed
- JS files injected by content scripts into the page's main world

:::tip
Regardless of whether a entrypoint is listed or unlisted, it will still be bundled into your extension and be available at runtime.
:::

## Adding Entrypoints

Once again, refer to the [Entrypoint Types](#entrypoint-types) below for the allowed file patterns for each entrypoint type.

In general, each type of entrypoint can be defined as a single file or directory with an `index` file inside it.

:::code-group

```txt [Single File]
entrypoints/
└─ background.ts
```

```txt [Directory]
entrypoints/
└─ background/
   ├─ index.ts
   └─ ...
```

:::

## Defining Manifest Options

Most listed entrypoints have options that need to be added to the `manifest.json`. With WXT however, instead of defining the options in a separate file, _you define these options inside the entrypoint file itself_.

For example, here's how to define `matches` for content scripts:

```ts
// entrypoints/content.ts
export default defineContentScript({
  matches: ['*://*.wxt.dev/*'],
});
```

> Refer to the [Entrypoint Types](#entrypoint-types) sections for a list of options configurable inside each entrypoint, and how to define them.

When building your extension, WXT will look at the options defined in your entrypoints, and generate the manifest accordingly.

## Entrypoint Types

### Background

### Bookmarkds

### Content Scripts

###

###

###

###

###

###

###

###

###

###
