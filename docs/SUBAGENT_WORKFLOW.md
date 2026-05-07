# Subagent Workflow

Use subagents when work is independent enough to parallelize.

## Good Uses

- One agent maps backend surfaces while another maps frontend surfaces.
- One agent implements a scoped module while another writes docs.
- One read-only review agent inspects a PR while the main agent prepares validation.

## Bad Uses

- Two agents editing the same file.
- Delegating the immediate critical-path blocker.
- Asking multiple agents the same vague question.
- Letting a subagent mutate external systems without explicit scope.

## Supervisor Contract

The supervisor agent owns:

- scope
- task split
- integration
- validation
- final report

Subagents return evidence. The supervisor decides what to accept.

