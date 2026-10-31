import { describe, expect, test } from "vitest";

import { linkGuides, parseElection, parseFolder, parseGuide } from "./votes.ts";

describe("parseFolder", () => {
  test("lists the Google Docs in a public folder", () => {
    const html = `
      <div class="flip-entry" id="entry-doc1">
        <a href="https://docs.google.com/document/d/doc1/edit?usp=drive_web">
          <div class="flip-entry-title">2026 Voter Guide - Nov General</div>
        </a>
      </div>
      <div class="flip-entry" id="entry-sheet">
        <a href="https://docs.google.com/spreadsheets/d/sheet1/edit">
          <div class="flip-entry-title">Notes</div>
        </a>
      </div>`;

    expect(parseFolder(html)).toEqual([{ id: "doc1", name: "2026 Voter Guide - Nov General" }]);
  });
});

describe("parseElection", () => {
  test.each([
    [
      "2026 Progressive Voter Guide - CA/Alameda/Hayward - General Election",
      "2026-november-general",
      "November 2026 General",
      "2026-11-01",
    ],
    [
      "2024 Progressive Voter Guide - CA/Alameda/Hayward - March Primary",
      "2024-march-primary",
      "March 2024 Primary",
      "2024-03-01",
    ],
    [
      "2022 Progressive Voter Guide - June Primary",
      "2022-june-primary",
      "June 2022 Primary",
      "2022-06-01",
    ],
    [
      "2022 Progressive Voter Guide - Nov General",
      "2022-november-general",
      "November 2022 General",
      "2022-11-01",
    ],
    [
      "2020 Progressive Voter Guide - California/Alameda County/Hayward",
      "2020-november-general",
      "November 2020 General",
      "2020-11-01",
    ],
    ["2025 Special Election Guide", "2025-november-special", "November 2025 Special", "2025-11-01"],
  ])("%s", (name, slug, label, election) => {
    expect(parseElection(name)).toEqual({ slug, label, election });
  });

  test("needs a year", () => {
    expect(parseElection("Voter Guide")).toBeUndefined();
  });
});

describe("parseGuide", () => {
  // Shaped like Docs' HTML export: styles live in generated classes
  const exported = `<html><head><style>.c1{font-weight:700}.c2{font-style:italic}</style></head><body>
    <p class="title"><span>2026 Voter Guide</span></p>
    <p class="subtitle"><span>California and Hayward</span></p>
    <p><span>Do your own </span><span class="c1">research</span><span>.</span></p>
    <p><span></span></p>
    <h1><span>Propositions</span></h1>
    <h2><span>Proposition 1: Affordable Housing - YES</span></h2>
    <p><a href="https://www.google.com/url?q=https://example.com/prop1&amp;sa=D">Read more</a></p>
    <h2><span>Proposition 2: Rainy Day Fund – no</span></h2>
    <h1><span>State Positions</span></h1>
    <h2><span>Governor: Jane Doe</span></h2>
    <ul><li><span class="c2">Endorsed by</span><span> everyone</span></li></ul>
    <p><a href="javascript:alert(1)">bad link</a><img src="x" onerror="alert(1)"></p>
  </body></html>`;

  const guide = parseGuide(exported);

  test("reads the title and subtitle", () => {
    expect(guide.title).toBe("2026 Voter Guide");
    expect(guide.subtitle).toBe("California and Hayward");
  });

  test("outlines sections and items, with yes/no picks from the headings", () => {
    expect(guide.outline).toEqual([
      {
        id: "propositions",
        title: "Propositions",
        items: [
          {
            id: "proposition-1-affordable-housing",
            title: "Proposition 1: Affordable Housing",
            pick: "yes",
          },
          {
            id: "proposition-2-rainy-day-fund",
            title: "Proposition 2: Rainy Day Fund",
            pick: "no",
          },
        ],
      },
      {
        id: "state-positions",
        title: "State Positions",
        items: [{ id: "governor-jane-doe", title: "Governor: Jane Doe" }],
      },
    ]);
  });

  test("renders clean HTML with anchored headings two levels down", () => {
    expect(guide.body).toContain("<p>Do your own <strong>research</strong>.</p>");
    expect(guide.body).toContain('<h3 id="propositions">Propositions</h3>');
    expect(guide.body).toContain(
      '<h4 id="proposition-1-affordable-housing">Proposition 1: Affordable Housing <span class="pick pick--yes">yes</span></h4>',
    );
    expect(guide.body).toContain('<a href="https://example.com/prop1"');
    expect(guide.body).toContain("<ul><li><em>Endorsed by</em> everyone</li></ul>");
    expect(guide.body).not.toContain("<p></p>");
  });

  test("drops unsafe markup", () => {
    expect(guide.body).not.toContain("javascript:");
    expect(guide.body).not.toContain("onerror");
    expect(guide.body).not.toContain("<img");
  });

  test("reads inline styles from Docs' lightweight view", () => {
    const light = parseGuide(`<html><body><div class="doc-content">
      <p class="title"><span>Guide</span></p>
      <p><span style="font-weight:700">YES</span><span> on everything</span></p>
    </div></body></html>`);

    expect(light.title).toBe("Guide");
    expect(light.body).toBe("<p><strong>YES</strong> on everything</p>");
  });

  test("keeps heading anchors unique", () => {
    const repeated = parseGuide(
      "<body><h1>Local</h1><h2>Measure A</h2><h1>County</h1><h2>Measure A</h2></body>",
    );

    expect(repeated.outline.flatMap((section) => section.items.map((item) => item.id))).toEqual([
      "measure-a",
      "measure-a-2",
    ]);
  });
});

describe("linkGuides", () => {
  test("points links to other guides at their pages on the site", () => {
    const html =
      '<a href="https://docs.google.com/document/d/old/" target="_blank" rel="noopener noreferrer">2022 guide</a> ' +
      '<a href="https://docs.google.com/document/d/other/" target="_blank" rel="noopener noreferrer">notes</a>';

    expect(linkGuides(html, new Map([["old", "2022-november-general"]]))).toBe(
      '<a href="/votes/2022-november-general">2022 guide</a> ' +
        '<a href="https://docs.google.com/document/d/other/" target="_blank" rel="noopener noreferrer">notes</a>',
    );
  });
});
