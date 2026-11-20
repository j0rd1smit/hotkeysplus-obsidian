// Loads the built bundle the way Obsidian does: a CommonJS module whose
// `require('obsidian')` returns the app's classes. `Plugin` here is a native
// ES class, like Obsidian's own since 1.x, so an ES5 bundle throws
// "Class constructor ... cannot be invoked without 'new'".
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

class Plugin {
  constructor(app, manifest) {
    this.app = app;
    this.manifest = manifest;
    this.commands = [];
  }
  addCommand(command) {
    this.commands.push(command);
    return command;
  }
}

const obsidian = { Plugin, MarkdownView: class MarkdownView {} };

function loadBundle(path) {
  const code = readFileSync(path, 'utf8');
  const module = { exports: {} };
  const require = (id) => {
    if (id === 'obsidian') return obsidian;
    throw new Error(`unexpected require: ${id}`);
  };
  new Function('module', 'exports', 'require', code)(module, module.exports, require);
  return module.exports.default ?? module.exports;
}

const bundle = process.env.BUNDLE ?? 'main.js';

test('the plugin can be constructed and loaded', () => {
  const HotkeysPlus = loadBundle(bundle);
  const plugin = new HotkeysPlus({}, { id: 'hotkeysplus-obsidian' });

  plugin.onload();

  assert.ok(plugin instanceof Plugin);
  assert.ok(plugin.commands.some((c) => c.id === 'better-toggle-todo'));
});
