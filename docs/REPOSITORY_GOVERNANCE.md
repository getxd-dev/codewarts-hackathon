# Repository Governance

The starter repository is intentionally public so outside contributors can create pull requests. Maintainers still control what changes land.

## Current Governance Surfaces

- `.github/CODEOWNERS` names `@artreimus` as the repository owner.
- `main` is protected on GitHub.
- CI must pass before protected-branch changes land.
- Force pushes and branch deletion are disabled for `main`.
- PR conversations must be resolved before merge.

## Recommended Pull Request Flow

1. Create a branch from `main`.
2. Update the relevant spec, plan, docs, skills, or tests.
3. Run local validation:

```bash
make lint
make test
make validate-factory
```

4. Open a PR with the factory checklist completed.
5. Run an agentic code review pass.
6. Fix valid findings.
7. Merge only after CI passes and conversations are resolved.

## Access Model

For a personal GitHub repository, branch push restriction lists are not available through the branch-protection API. The practical control is:

- keep write/admin collaborators limited to trusted maintainers
- use CODEOWNERS for review ownership
- require CI on protected branches
- leave the repository public so external contributors can fork and open PRs

For an organization repository, add branch restrictions for the exact users, teams, or apps that are allowed to push or merge into protected branches.
