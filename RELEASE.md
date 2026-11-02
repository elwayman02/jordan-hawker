# Release Process

Releases are automated with [release-plan](https://github.com/embroider-build/release-plan/), set up the same way as [ember.nvp](https://github.com/NullVoxPopuli/ember.nvp)'s own releases. This site isn't published to npm: a release bumps the version, updates [CHANGELOG.md](./CHANGELOG.md), tags the commit (`vX.Y.Z`), and creates a GitHub release.

Pull requests don't change the version themselves; their labels decide it.

## Label every pull request

`release-plan` needs **every** pull request merged since the last release to have one of these labels. The highest one decides the version bump:

| Label           | For                                                                   | Bump  |
| --------------- | --------------------------------------------------------------------- | ----- |
| `breaking`      | a change that breaks existing URLs, links or behaviour people rely on | major |
| `enhancement`   | something new or changed that visitors can see                        | minor |
| `bug`           | a fix for something already released                                  | patch |
| `documentation` | docs only                                                             | patch |
| `internal`      | refactors, tooling, tests, dependencies, anything else                | patch |

PR titles become changelog entries, so make them read well to a visitor. [keepachangelog.com](https://keepachangelog.com/en/1.1.0/) explains why: changelogs are for humans, not machines.

## Release

1. After each merge to `master`, the **Plan Release** workflow opens (or updates) a pull request titled **Prepare Release x.y.z**. It bumps `package.json`, adds the new section to `CHANGELOG.md` and records the plan in `.release-plan.json`.
2. When you're ready to release, merge that pull request.
3. The **Release** workflow then tags the merge commit `vX.Y.Z` and creates the GitHub release with the same changelog text.

Releases can be batched: leave the Prepare Release PR open while merging more work and it keeps itself up to date.

Netlify deploys every merge to `master` as usual; a release is a record of what shipped, not a separate deploy step.

## Version history

Releases through 2.6.0 were bumped by hand and tagged without the `v` prefix (`2.6.0`). release-plan finds the previous release from the most recent tag either way.

The changelog entries before 2.0.0 were rebuilt from git history and the original GitHub release notes. Work merged after 1.1.0 (2018–2020) was deployed but never versioned, so it's listed as "Unreleased". New entries are always added at the top, so editing older ones is safe.
