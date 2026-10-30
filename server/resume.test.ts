import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { parseResume } from "./resume.ts";

const page = readFileSync(new URL("fixtures/resume.html", import.meta.url), "utf8");

describe("parseResume", () => {
  const resume = parseResume(page);

  test("reads the name and intro lines", () => {
    expect(resume.name).toBe("Pat Example");
    expect(resume.intro).toEqual([
      '<a href="https://github.com/example" target="_blank" rel="noopener noreferrer">GitHub</a> ✦ Somewhere, CA',
    ]);
  });

  test("splits sections on all-caps bold headings", () => {
    expect(resume.sections.map((section) => section.title)).toEqual(["EXPERIENCE", "PUBLICATIONS"]);
  });

  test("tells organizations from roles by type size, and splits columns", () => {
    expect(resume.sections[0]!.blocks.slice(0, 2)).toEqual([
      { kind: "line", level: "org", left: "<strong>Acme &amp; Co</strong>", right: "Remote" },
      {
        kind: "line",
        level: "role",
        left: "<strong>Staff Engineer</strong>",
        right: "2020 - 2026",
      },
    ]);
  });

  test("keeps emphasis in bullets and escapes text", () => {
    expect(resume.sections[0]!.blocks[2]).toEqual({
      kind: "list",
      items: ["Shipped <strong>a lot</strong> of &lt;things&gt;", "Led a team"],
    });
  });

  test("merges split links, unwraps Google redirects, and handles indented lines", () => {
    expect(resume.sections[1]!.blocks).toEqual([
      {
        kind: "line",
        level: "text",
        left: '<a href="https://example.com/talk" target="_blank" rel="noopener noreferrer">“A Talk”</a>',
        right: "SomeConf, 2021",
      },
      { kind: "line", level: "text", left: "by Pat Example &amp; Friends" },
    ]);
  });

  test("builds a structured experience summary", () => {
    expect(resume.structured).toBe(true);
    expect(resume.experience).toEqual([
      {
        org: "Acme & Co",
        location: "Remote",
        roles: [
          {
            title: "Staff Engineer",
            dates: "2020 - 2026",
            highlights: ["Shipped a lot of <things>", "Led a team"],
          },
        ],
      },
      {
        org: "Globex",
        location: "Springfield",
        roles: [{ title: "Engineer", dates: "2015 - 2020", highlights: ["Built things"] }],
      },
    ]);
  });

  test("keeps a sanitized copy of the original document", () => {
    expect(resume.original.html).toContain('class="c21 doc-content"');
    expect(resume.original.html).not.toContain("<script");
    expect(resume.original.html).not.toContain("publish-banner");
    expect(resume.original.css).not.toContain("@import");
  });

  test("rejects pages that aren't a published doc", () => {
    expect(() => parseResume("<html><body>Sign in</body></html>")).toThrow(/unexpected structure/);
  });
});
