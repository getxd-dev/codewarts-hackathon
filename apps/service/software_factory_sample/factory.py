"""Tiny standard-library domain module used by the sample CI."""

from dataclasses import dataclass
from enum import Enum


class ArtifactKind(str, Enum):
    SPEC = "spec"
    PLAN = "plan"
    DOC = "doc"
    SKILL = "skill"
    TEST = "test"


@dataclass(frozen=True)
class FactoryArtifact:
    kind: ArtifactKind
    title: str
    owner: str

    def slug(self) -> str:
        normalized = self.title.lower().replace("_", "-")
        return "-".join(part for part in normalized.split() if part)


def create_artifact(kind: ArtifactKind, title: str, owner: str = "agent") -> FactoryArtifact:
    if not title.strip():
        raise ValueError("title is required")
    if not owner.strip():
        raise ValueError("owner is required")
    return FactoryArtifact(kind=kind, title=title.strip(), owner=owner.strip())

