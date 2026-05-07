# Use Case 003 - MCP Tool Approval

## Problem

Agents need tools, but tool access can expose credentials, customer data, destructive write actions, or expensive operations.

## Target User

Engineering teams adding MCP servers, provider integrations, local automation, or other agent-callable tools.

## Product Behavior

The factory should require every new tool surface to document its trust boundary, scopes, approval behavior, logging expectations, and validation plan before it is used by default.

## Non-Goals

- Building a production MCP gateway in this starter.
- Granting every agent access to every provider tool.
- Storing real credentials in example configs.

## Acceptance Criteria

- [ ] Tool policy names allowed operations and denied operations.
- [ ] Destructive or external-write tools require explicit approval.
- [ ] Secrets stay out of prompts, docs, examples, and screenshots.
- [ ] Logs are useful without storing sensitive payloads.
- [ ] Tests or manual validation prove policy is enforced outside the prompt.

## Required Artifacts

- [ ] Implementation plan: `plans/PLAN_MCP_TOOL_APPROVAL.md`
- [ ] Trust-boundary doc: `docs/MCP_TRUST_BOUNDARY.md`
- [ ] Tool approval checklist: `docs/MCP_TRUST_BOUNDARY.md`
- [ ] Policy review skill: `.agents/skills/mcp-tool-policy-review/SKILL.md`
