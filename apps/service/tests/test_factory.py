import unittest

from software_factory_sample import create_artifact
from software_factory_sample.factory import ArtifactKind


class FactoryArtifactTests(unittest.TestCase):
    def test_create_artifact_generates_slug(self) -> None:
        artifact = create_artifact(ArtifactKind.SPEC, "Deep Work PRD", owner="pm")

        self.assertEqual(artifact.slug(), "deep-work-prd")
        self.assertEqual(artifact.owner, "pm")

    def test_create_artifact_rejects_blank_title(self) -> None:
        with self.assertRaises(ValueError):
            create_artifact(ArtifactKind.PLAN, " ")


if __name__ == "__main__":
    unittest.main()

