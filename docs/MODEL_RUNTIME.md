# Model Runtime Strategy

Use state-of-the-art models, but do not build the architecture around one model.

## Principles

- Treat models as replaceable engines.
- Keep product logic in code, specs, tools, and state.
- Use stronger models for planning, synthesis, architecture, review, and hard debugging.
- Use cheaper or faster models for narrow mechanical tasks when quality risk is low.
- Record model-sensitive assumptions in docs or configuration.

## Runtime Boundary

```mermaid
flowchart LR
    Agent["Agent workflow"] --> Gateway["Model gateway or runtime"]
    Gateway --> ModelA["Frontier model"]
    Gateway --> ModelB["Fast model"]
    Agent --> Tools["Tools and MCP"]
    Tools --> Policy["Policy layer"]
```

The factory should improve even when the model changes.

