"""Validate that the sample software factory repository keeps its core surfaces."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "AGENTS.md",
    "DESIGN.md",
    "README.md",
    ".agents/skills/plan-before-code/SKILL.md",
    ".agents/skills/agentic-code-review/SKILL.md",
    ".cursor/rules/software-factory.mdc",
    ".github/workflows/ci.yml",
    ".github/pull_request_template.md",
    "docs/SOFTWARE_FACTORY.md",
    "docs/OPERATING_MODEL.md",
    "docs/DOCS_SPECS_PLANS_CONTRACT.md",
    "docs/REPOSITORY_GOVERNANCE.md",
    "docs/FACTORY_METRICS.md",
    "docs/MCP_TRUST_BOUNDARY.md",
    "docs/AI_CODE_REVIEW_LOOP.md",
    "docs/SECURITY_AND_PERMISSIONS.md",
    "docs/CONTAINERS_AND_RUNTIME_IMAGES.md",
    "docs/MODEL_RUNTIME.md",
    "docs/TDD_AND_VALIDATION.md",
    "docs/SUBAGENT_WORKFLOW.md",
    "docs/examples/EXAMPLE_SUBAGENT_BRIEF.md",
    "specs/use-cases/use-case-001-example.md",
    "specs/use-cases/use-case-002-agentic-review-loop.md",
    "specs/use-cases/use-case-003-mcp-tool-approval.md",
    "plans/PLAN_EXAMPLE_FEATURE.md",
    "plans/PLAN_AGENTIC_REVIEW_LOOP.md",
    "plans/PLAN_MCP_TOOL_APPROVAL.md",
    "plans/PLAN_TDD_IMPLEMENTATION_LOOP.md",
    ".agents/skills/spec-to-plan/SKILL.md",
    ".agents/skills/tdd-implementation-loop/SKILL.md",
    ".agents/skills/mcp-tool-policy-review/SKILL.md",
    ".agents/skills/subagent-supervisor/SKILL.md",
    ".agents/skills/factory-retrospective/SKILL.md",
]


def main() -> None:
    missing = [path for path in REQUIRED_FILES if not (ROOT / path).is_file()]
    if missing:
        formatted = "\n".join(f"- {path}" for path in missing)
        raise SystemExit(f"Missing required factory files:\n{formatted}")

    docs = ROOT / "docs"
    if len(list(docs.glob("*.md"))) < 11:
        raise SystemExit("Expected at least 11 docs files in docs/.")

    skills = ROOT / ".agents" / "skills"
    if len(list(skills.glob("*/SKILL.md"))) < 7:
        raise SystemExit("Expected at least 7 agent skills.")

    specs = ROOT / "specs" / "use-cases"
    if len(list(specs.glob("*.md"))) < 3:
        raise SystemExit("Expected at least 3 sample use-case specs.")

    templates = ROOT / "templates"
    if templates.exists():
        raise SystemExit("The templates/ folder should not exist.")

    print("factory validation passed")


if __name__ == "__main__":
    main()
