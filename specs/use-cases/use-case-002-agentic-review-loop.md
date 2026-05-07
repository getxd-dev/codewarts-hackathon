# Use Case 002 - Agentic Review Loop

## Problem

AI-assisted teams can move quickly but may also repeat the same mistakes when review findings are not converted into durable guardrails.

## Target User

Maintainers who want every meaningful diff to receive an independent review before merge.

## Product Behavior

The factory should provide a clear review loop where an implementation agent creates a scoped diff, a review agent checks it against repository contracts, and valid findings become fixes, tests, docs, or skills.

## Non-Goals

- Replacing human merge judgment.
- Treating review-agent output as automatically correct.
- Requiring multiple agents for trivial changes.

## Acceptance Criteria

- [ ] PRs include a review checklist.
- [ ] Review agents lead with actionable findings.
- [ ] Valid findings are fixed or explicitly rejected with rationale.
- [ ] Repeated findings become tests, docs, rules, examples, or skills.
- [ ] Review output references affected files and validation gaps.

## Required Artifacts

- [ ] Implementation plan: `plans/PLAN_AGENTIC_REVIEW_LOOP.md`
- [ ] Review skill: `.agents/skills/agentic-code-review/SKILL.md`
- [ ] Example report: `docs/examples/EXAMPLE_REVIEW_REPORT.md`
