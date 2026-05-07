# Software Factory Principles

## 1. Contracts Before Code

Write down the standards the agent must follow:

- `AGENTS.md` for operating rules.
- `DESIGN.md` for UI taste and constraints.
- `specs/` for intended behavior.
- `plans/` for implementation strategy.

## 2. Specs Drive Development

Agents should research first, then plan, then code. The plan should name concrete files, APIs, models, tests, and docs.

## 3. Tools Need Trust Boundaries

MCP and external tools should be scoped by explicit authorization. Prompts can guide behavior, but backend policy should enforce permissions.

## 4. Review Is A Loop

Use code review agents to inspect diffs. Valid findings become fixes, tests, docs, or skills.

## 5. The Factory Learns

Repeated work becomes a skill. Bugs become tests. Product decisions become specs. Operational lessons become docs.

