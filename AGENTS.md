# AGENTS.md

This is the operating contract for AI agents and contributors in this repository.

## Core Rules

- Research before planning. Inspect the repo, read relevant docs/specs, and verify assumptions before writing a plan.
- Plan before meaningful code changes. Use `plans/PLAN_<NAME>.md` for non-trivial implementation work.
- Follow the plan when coding, and explicitly update the plan or docs if live code proves an assumption wrong.
- Preserve user work. Do not revert unrelated changes.
- Keep changes scoped to the requested task.
- Do not create commits unless explicitly asked.
- Validate before finalizing. Run the strongest practical tests, lint, type checks, builds, or review checks available.
- Record durable lessons in docs, specs, skills, or tests instead of leaving them only in chat.
- Use subagents only for independent work with clear ownership and no overlapping write sets.
- Use review agents for meaningful diffs before final handoff.

## Artifact Boundaries

- `specs/`: intended behavior, product requirements, constraints, acceptance criteria.
- `plans/`: task-specific implementation strategy, file-level changes, data flow, tests, rollout.
- `docs/`: current-state architecture, operations, setup, and implementation reference.
- `.agents/skills/`: reusable agent workflows.
- `.cursor/rules/`: editor/agent rules for Cursor-compatible environments.

## Skill Routing

- Use `.agents/skills/spec-to-plan/SKILL.md` when converting a product spec into an implementation plan.
- Use `.agents/skills/plan-before-code/SKILL.md` before non-trivial code changes.
- Use `.agents/skills/tdd-implementation-loop/SKILL.md` when implementing behavior from an approved plan.
- Use `.agents/skills/agentic-code-review/SKILL.md` for review passes on meaningful diffs.
- Use `.agents/skills/mcp-tool-policy-review/SKILL.md` for MCP, tool, credential, or permission changes.
- Use `.agents/skills/subagent-supervisor/SKILL.md` when splitting independent work across agents.
- Use `.agents/skills/factory-retrospective/SKILL.md` after incidents, regressions, or repeated review findings.

## Engineering Standards

- Prefer simple, typed, testable code.
- Keep business rules out of UI-only helpers when they belong in services or policy layers.
- Put deterministic guardrails in code, not only prompts.
- Treat prompts as behavior guidance, not authorization.
- Use explicit permission boundaries for MCP and external tools.
- Add tests for new behavior and regression fixes.
- Keep example artifacts copyable: avoid secrets, private endpoints, and hidden dependencies.

## Review Loop

Every meaningful change should pass through a self-enforcing loop:

1. Implementation agent writes the change against the plan.
2. Review agent inspects the diff against `AGENTS.md`, `DESIGN.md`, specs, docs, and tests.
3. Implementation agent fixes valid findings.
4. Validation runs again.
5. Durable lessons become tests, docs, rules, or skills.

## Documentation Loop

- If intended behavior changes, update `specs/`.
- If implementation strategy changes, update `plans/`.
- If current architecture, setup, operations, or governance changes, update `docs/`.
- If the same workflow repeats twice, promote it into `.agents/skills/`, `docs/`, or a focused example file.

## Required Checks

Run these before finalizing meaningful changes:

```bash
make lint
make test
make validate-factory
```

## Container And Runtime Rules

- Treat containers as repeatability boundaries.
- Keep runtime dependencies owned by the deployable that uses them.
- Do not put secrets in Dockerfiles, `.env.example`, prompts, MCP configs, or screenshots.
- Prefer examples that are safe to copy over examples that require hidden credentials.
