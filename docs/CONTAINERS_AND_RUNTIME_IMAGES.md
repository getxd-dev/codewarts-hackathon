# Containers And Runtime Images

Containers make the factory reproducible.

## Principles

- Each deployable owns its runtime image.
- Runtime dependencies should live with the deployable that uses them.
- Images should not contain secrets.
- CI should be able to build and smoke-test images.
- Agent instructions, skills, and runtime config should be versioned with the code that ships them.

## Included Examples

- `apps/service/Dockerfile`: runs the sample backend tests.
- `apps/web/Dockerfile`: serves the static dummy UI.
- `.devcontainer/devcontainer.json`: gives contributors a repeatable Python environment.
- `apps/service/Dockerfile`: sample service image boundary.
- `apps/web/Dockerfile`: sample web image boundary.

## Example Commands

```bash
docker build -f apps/service/Dockerfile -t software-factory-service .
docker build -f apps/web/Dockerfile -t software-factory-web .
```
