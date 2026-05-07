import { describe, expect, it } from "vitest";
import { calculateOpportunityAnalysis, classifyScore, detectSkills } from "./opportunityEngine";
import { demoProfile } from "./demoProfile";

describe("opportunityEngine", () => {
  it("classifies support levels from score ranges", () => {
    expect(classifyScore(40)).toBe("High support needed");
    expect(classifyScore(58)).toBe("Moderate support needed");
    expect(classifyScore(86)).toBe("Opportunity-ready");
  });

  it("detects common skills from profile and OCR text", () => {
    const skills = detectSkills("I know Excel, email, typing, and customer service.");

    expect(skills).toContain("Excel");
    expect(skills).toContain("Email");
    expect(skills).toContain("Typing");
    expect(skills).toContain("Customer service");
  });

  it("returns a complete bounded recommendation analysis", () => {
    const analysis = calculateOpportunityAnalysis(
      demoProfile,
      "Resume detected: typing, email, basic computer skills, data entry, and customer service.",
    );

    expect(analysis.score).toBeGreaterThanOrEqual(0);
    expect(analysis.score).toBeLessThanOrEqual(100);
    expect(analysis.topJobs).toHaveLength(3);
    expect(analysis.topCourses).toHaveLength(3);
    expect(analysis.topSupportPrograms.length).toBeGreaterThan(0);
    expect(analysis.nextSteps).toHaveLength(3);
    expect(analysis.sdgImpact["SDG 4"]).toBeGreaterThan(0);
  });
});
