import { defineConfig } from 'vitepress';
import typedocSidebar from '../api/reference/typedoc-sidebar.json';
import {
  menuGroup,
  menuItem,
  menuRoot,
  navItem,
  prepareTypedocSidebar,
} from './utils/menus';
import { meta, script } from './utils/head';
import { version as wxtVersion } from '../../packages/wxt/package.json';
import { version as i18nVersion } from '../../packages/i18n/package.json';

const title = 'Next-gen Web Extension Framework';
const titleSuffix = ' – WXT';
const description =
  "WXT provides the best developer experience, making it quick, easy, and fun to develop chrome extensions for all browsers. With built-in utilities for building, zipping, and publishing your extension, it's easy to get started.";
const ogTitle = `${title}${titleSuffix}`;
const ogUrl = 'https://wxt.dev';
const ogImage = 'https://wxt.dev/social-preview.png';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  titleTemplate: `:title${titleSuffix}`,
  title: 'WXT',
  description,
  vite: {
    clearScreen: false,
  },
  lastUpdated: true,
  sitemap: {
    hostname: 'https://wxt.dev',
  },

  head: [
    meta('og:type', 'website'),
    meta('og:title', ogTitle),
    meta('og:image', ogImage),
    meta('og:url', ogUrl),
    meta('og:description', description),
    meta('twitter:card', 'summary_large_image', { useName: true }),
    script('https://umami.aklinker1.io/script.js', {
      'data-website-id': 'c1840c18-a12c-4a45-a848-55ae85ef7915',
      async: '',
    }),
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      src: '/logo.svg',
      alt: 'WXT logo',
    },

    editLink: {
      pattern: 'https://github.com/wxt-dev/wxt/edit/main/docs/:path',
    },

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/ZFsZqGery9' },
      { icon: 'github', link: 'https://github.com/wxt-dev/wxt' },
    ],

    nav: [
      navItem('Guide', '/guide/get-started/installation'),
      navItem('Examples', '/examples'),
      navItem('API', '/api/reference/wxt'),
      navItem('---', [
        navItem('wxt', [
          navItem(`v${wxtVersion}`, '/'),
          navItem(
            `Changelog`,
            'https://github.com/wxt-dev/wxt/blob/main/packages/wxt/CHANGELOG.md',
          ),
        ]),
        navItem('@wxt-dev/i18n', [
          navItem(`v${i18nVersion}`, '/i18n'),
          navItem(
            `Changelog`,
            'https://github.com/wxt-dev/wxt/blob/main/packages/i18n/CHANGELOG.md',
          ),
        ]),
      ]),
    ],

    sidebar: {
      '/guide/': menuRoot([
        menuGroup('Get Started', '/guide/get-started/', [
          menuItem('Introduction', 'introduction.md'),
          menuItem('Installation', 'installation.md'),
          menuItem('Migrate to WXT', 'migrate.md'),
        ]),
        menuGroup('Core Concepts', '/guide/core-concepts/', [
          menuItem('Project Structure', 'project-structure.md'),
          menuItem('Entrypoints', 'entrypoints.md'),
          menuItem('Browser Support', 'browser-support.md'),
          menuItem('Vite', 'vite.md'),
        ]),
        menuGroup('Configuration', '/guide/config/', [
          menuItem('wxt.config.ts', 'wxt.md'),
          menuItem('Manifest', 'manifest.md'),
          menuItem('Frontend Frameworks', 'frontend-frameworks.md'),
          menuItem('Browser Startup', 'browser-startup.md'),
          menuItem('Runtime Config', 'runtime.md'),
          menuItem('TypeScript', 'typescript.md'),
        ]),
        menuGroup('Extension APIs', '/guide/extension-apis/', [
          menuItem('Basic Usage', 'basic-usage.md'),
          menuItem('I18n', 'i18n.md'),
          menuItem('Messaging', 'messaging.md'),
          menuItem('Scripting', 'scripting.md'),
          menuItem('Storage', 'storage.md'),
        ]),
        menuGroup('Assets', '/guide/assets/', [
          menuItem('Images', 'images.md'),
          menuItem('CSS', 'css.md'),
          menuItem('WASM', 'wasm.md'),
        ]),
        menuGroup('Content Scripts', '/guide/content-scripts/', [
          menuItem('UI', 'ui.md'),
          menuItem('Content Script Context', 'context.md'),
        ]),
        menuGroup('WXT Modules', '/guide/wxt-modules/', [
          menuItem('Using Modules', 'using-modules.md'),
          menuItem('Writing Modules', 'writing-modules.md'),
          menuItem('Recipes', 'recipes.md'),
        ]),
        menuGroup('Maintain Your Project', '/guide/maintainence/', [
          menuItem('Upgrading WXT', 'upgrading.md'),
          menuItem('Unit Testing', 'unit-testing.md'),
          menuItem('E2E Testing', 'e2e-testing.md'),
          menuItem('Debugging', 'debugging.md'),
        ]),
        menuGroup('Going to Production', '/guide/production/', [
          menuItem('Publishing', 'publishing.md'),
          menuItem('Bundle Remote Code', 'remote-code.md'),
          menuItem('Testing Updates', 'testing-updates.md'),
        ]),
        menuGroup('Entrypoint Types', '/guide/entrypoint-types/', [
          menuItem('Background', 'background.md'),
          menuItem('Bookmarks', 'bookmarks.md'),
          menuItem('Content Script', 'content-scripts.md'),
          menuItem('Devtools', 'devtools.md'),
          menuItem('History', 'history.md'),
          menuItem('Newtab', 'newtab.md'),
          menuItem('Options', 'options.md'),
          menuItem('Popup', 'popup.md'),
          menuItem('Sandbox', 'sandbox.md'),
          menuItem('Sidepanel', 'sidepanel.md'),
          menuItem('Unlisted CSS', 'unlisted-css.md'),
          menuItem('Unlisted HTML', 'unlisted-pages.md'),
          menuItem('Unlisted Script', 'unlisted-scripts.md'),
        ]),
        menuGroup('Resources', '/guide/resources/', [
          menuItem('Compare', 'compare.md'),
          menuItem('How WXT Works', 'how-wxt-works.md'),
        ]),
      ]),
      '/i18n/': menuRoot([
        menuGroup('@wxt-dev/i18n', '/i18n/', [
          menuItem('Introduction', 'introduction.md'),
          menuItem('Installation', 'installation.md'),
          menuItem('Messages File Format', 'messages-file-format.md'),
          menuItem('Build Integrations', 'build-integrations.md'),
          menuItem('Editor Support', 'editor-support.md'),
        ]),
      ]),
      '/api/': menuRoot([
        menuGroup('CLI', '/api/cli/', [
          menuItem('wxt', 'wxt.md'),
          menuItem('wxt build', 'wxt-build.md'),
          menuItem('wxt zip', 'wxt-zip.md'),
          menuItem('wxt prepare', 'wxt-prepare.md'),
          menuItem('wxt clean', 'wxt-clean.md'),
          menuItem('wxt init', 'wxt-init.md'),
          menuItem('wxt submit', 'wxt-submit.md'),
          menuItem('wxt submit init', 'wxt-submit-init.md'),
        ]),
        menuGroup('API Reference', prepareTypedocSidebar(typedocSidebar)),
      ]),
    },
  },
});
