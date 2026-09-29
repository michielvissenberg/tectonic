# tectonic

Always-on instructions for agents in this repo. Keep this file short. Topic guidance lives in Cursor rules and in skills, not here.

## Layout

- `.cursor/rules/testing.mdc` — tests and the red → green loop
- `.cursor/rules/architecture.mdc` — modules, interfaces, seams, depth
- `.cursor/rules/documentation.mdc` — `GLOSSARY.md`, ADRs, writing for agents
- `.agents/skills/` — Matt Pocock skills (installer canonical copy; lockfile `skills-lock.json`)

## Working here

- Small, deliberate steps. One vertical slice at a time.
- Name things with the glossary once `GLOSSARY.md` exists. If it is missing, proceed silently; do not invent a parallel vocabulary.
- Read ADRs under `docs/adr/` that touch the area you are changing. Create that directory only when the first ADR is needed.
- Confirm seams with the human before writing tests. Tests sit at public interfaces, not internals.

## Skills

Skills are installed from [`mattpocock/skills`](https://github.com/mattpocock/skills) into `.agents/skills/`.

Run `/setup-matt-pocock-skills` once before using engineering skills (`to-tickets`, `triage`, `implement`, `grill-with-docs`, and the rest). That skill writes the `## Agent skills` block below and `docs/agents/*`. Until it has run, do not guess an issue-tracker workflow.

Unsure which skill fits? Use `/ask-matt`.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues and are managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

This is a single-context repo with root `GLOSSARY.md` and `docs/adr/` documentation. See `docs/agents/domain.md`.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
