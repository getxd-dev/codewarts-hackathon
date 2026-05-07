# Security And Permissions

AI agents should operate inside explicit permission boundaries.

## Rules

- Do not store secrets in prompts, screenshots, Markdown examples, Dockerfiles, or committed env files.
- Prefer short-lived credentials for tool execution.
- Gate write actions behind explicit policy.
- Keep destructive operations separate from read-only exploration.
- Log enough metadata to audit tool usage without logging secret payloads.
- Treat MCP tools as integration surfaces, not harmless utilities.

## Agent Permission Levels

| Level | Allowed |
| --- | --- |
| Read-only | Search, inspect, summarize, report |
| Plan | Create specs/plans/docs without changing runtime behavior |
| Code | Edit scoped files and tests |
| Write tools | Execute approved external writes |
| Destructive | Requires explicit human approval |

## Prompt Versus Policy

Prompts guide behavior. Code and policy enforce behavior.

If a safety requirement matters, implement it in:

- API validation
- service policy
- tool allowlists
- tests
- CI checks

