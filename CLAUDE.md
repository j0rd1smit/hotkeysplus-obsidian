# CLAUDE.md - hotkeysplus-obsidian (maintained fork)

Fork of [argenos/hotkeysplus-obsidian](https://github.com/argenos/hotkeysplus-obsidian), unmaintained upstream since 2021.
j0rd1smit owns this fork and installs it via BRAT.
Optimize for "does it work for me", not upstream-mergeability.

## Layout
- `main.ts`: the whole plugin (one `Plugin` subclass, one command per hotkey).
- `esbuild.config.mjs`: bundles `main.ts` into `main.js` (gitignored).
- `tests/`: `node:test` suites, run against the built `main.js`.
- `version-bump.mjs`: copies the `package.json` version into `manifest.json` and `versions.json`.

## Branching
- Work directly on `master`, the default branch.
- Small, focused commits.

## Constraints
- Keep the plugin id `hotkeysplus-obsidian` and existing command ids.
  Obsidian stores user hotkeys by `<plugin id>:<command id>`, so renaming either drops the user's bindings.
- Build target must stay ES2015 or later.
  Obsidian's `Plugin` is a native class, and an ES5 `extends` throws `Class constructor ... cannot be invoked without 'new'` on load.
- Don't add settings or UI that isn't actually used.

## Commands
- `npm install`: install dependencies.
- `npm run dev`: watch build.
- `npm run build`: production build to `main.js`.
- `npm run typecheck`: `tsc --noEmit`.
- `npm run format` / `npm run format:check`: prettier.
- `npm test`: run `tests/` against `main.js` (build first).
- `npm run ci`: everything CI runs, in order.

Before finishing a change run `npm run ci`.

## Releases
Releases are cut by the user, not by agents: Actions -> "Release Obsidian plugin" -> "Run workflow" on `master`, choosing patch / minor / major.
It bumps the version, runs `npm run ci`, commits, tags and publishes `main.js` + `manifest.json`, which is what BRAT installs.
Tags have no `v` prefix (Obsidian convention).
