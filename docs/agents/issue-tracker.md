# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Name an issue**: use `<type>/<area>/<slug>` for the issue title, matching its branch name. Use types such as `feat`, `fix`, or `chore`, and areas such as `frontend` or `backend`; for example, `feat/frontend/settings-form`.
- **Create the branch**: create the matching branch before making changes, and keep agents off `main`.
- **Create an issue**: `gh issue create --title "..." --body "..."`
- **Read an issue**: `gh issue view <number> --comments`
- **List issues**: `gh issue list`
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply or remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repository from `git remote -v`; `gh` does this automatically inside this clone.

## Pull requests as a triage surface

**PRs as a request surface: no.**

When a skill says to publish to the issue tracker, create a GitHub issue. When it says to fetch a ticket, run `gh issue view <number> --comments`.

## Pull request scope

- Give each large issue its own pull request.
- A pull request may contain a few closely related small issues; keep the issue references explicit in the description.
- Include no more than one PRD (product requirements document) in a pull request.