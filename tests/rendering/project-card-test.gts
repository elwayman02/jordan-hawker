import { render } from "@ember/test-helpers";
import { describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";

import ProjectCard from "#components/codes/project-card.gts";
import { codes } from "#test-helpers/fake-api.ts";

describe("<ProjectCard>", () => {
  renderingTest("shows name, description, stats and topics", async ({ element }) => {
    const repo = codes.active[0]!;

    await render(<template><ProjectCard @repo={{repo}} /></template>);

    const link = element.querySelector<HTMLAnchorElement>(".project-card__name a");

    expect(link?.href).toBe("https://github.com/elwayman02/ember-user-activity");
    expect(element.querySelector(".project-card__description")?.textContent).toContain("idling");
    expect(element.querySelector(".project-card__meta")?.textContent).toContain("111");
    expect([...element.querySelectorAll(".chip")].map((chip) => chip.textContent)).toEqual([
      "ember",
      "addon",
    ]);
  });

  renderingTest("hides star counts under 10", async ({ element }) => {
    const repo = { ...codes.active[0]!, stars: 7, forks: 0 };

    await render(<template><ProjectCard @repo={{repo}} /></template>);

    expect(element.querySelector("[title='Stars']")).toBeNull();
    expect(element.querySelector(".project-card__meta")?.textContent).not.toContain("7");
  });
});
