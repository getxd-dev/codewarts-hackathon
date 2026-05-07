# Example Subagent Brief

Use this shape when asking an independent agent to perform bounded work.

## Task

Review the MCP tool approval spec and identify missing security or authorization requirements.

## Scope

- Read-only.
- Inspect `specs/use-cases/use-case-003-mcp-tool-approval.md` and `docs/MCP_TRUST_BOUNDARY.md`.
- Do not edit files or change GitHub settings.

## Questions To Answer

- Are destructive tools approval-gated?
- Are credentials and secrets kept out of prompts and docs?
- Are tool scopes concrete enough to enforce in code?
- What tests or validation gates are missing?

## Output

Return findings first, ordered by severity. Include file references and the smallest concrete fix for each valid issue. If no issues are found, state residual risk.
