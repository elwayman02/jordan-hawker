/**
 * Little SVGs that drift down the page when a holiday theme loads, keyed by holiday name.
 * Each is drawn on a 24×24 grid, and colored to read on both light and dark backgrounds.
 */
const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

const pumpkin = svg(
  `<path d="M12 6.5c-.6-2.4.4-4.2 2.6-5" fill="none" stroke="#4f7a2c" stroke-width="2" stroke-linecap="round"/>` +
    `<ellipse cx="7.6" cy="14.2" rx="5.6" ry="7.6" fill="#d9622b"/>` +
    `<ellipse cx="16.4" cy="14.2" rx="5.6" ry="7.6" fill="#d9622b"/>` +
    `<ellipse cx="12" cy="14.2" rx="4.8" ry="8" fill="#f0823a"/>`,
);

const candyCorn = svg(
  `<g stroke-linejoin="round" stroke-width="1">` +
    `<path d="M6.5 15h11L20 21H4z" fill="#f6c445" stroke="#f6c445"/>` +
    `<path d="M9.5 8h5l3 7h-11z" fill="#f0823a" stroke="#f0823a"/>` +
    `<path d="M12 2l2.5 6h-5z" fill="#fff6e8" stroke="#fff6e8"/>` +
    `</g>`,
);

const bat = svg(
  `<path fill="#7650b0" d="M12 8.6L12.8 8.6L13.4 7L13.8 9.4Q18 7.6 22 9.5Q20.2 10.4 20 12.5Q18.6 11.4 17.2 12.2Q16.6 13.4 16 14.4Q14.6 12.8 13.2 13.4L12 15.5L10.8 13.4Q9.4 12.8 8 14.4Q7.4 13.4 6.8 12.2Q5.4 11.4 4 12.5Q3.8 10.4 2 9.5Q6 7.6 10.2 9.4L10.6 7L11.2 8.6Z"/>`,
);

const ghost = svg(
  `<path d="M5 21V10a7 7 0 0 1 14 0v11l-2.3-1.8-2.4 1.8-2.3-1.8-2.3 1.8-2.4-1.8z" fill="#f6f2ff" stroke="#b8a6dc" stroke-width="1" stroke-linejoin="round"/>` +
    `<circle cx="9.6" cy="10.5" r="1.2" fill="#2e2040"/>` +
    `<circle cx="14.4" cy="10.5" r="1.2" fill="#2e2040"/>`,
);

const leaf = (fill: string, vein: string) =>
  svg(
    `<path d="M12 21.5C5 15.5 5 7 12 2.5c7 4.5 7 13 0 19z" fill="${fill}"/>` +
      `<path d="M12 22.5V5M12 10l3-2.5M12 10l-3-2.5M12 14.5l3.5-2.5M12 14.5l-3.5-2.5" fill="none" stroke="${vein}" stroke-width="1" stroke-linecap="round" opacity=".55"/>`,
  );

const acorn = svg(
  `<path d="M12 5.5c0-1.6.6-2.8 2-3.5" fill="none" stroke="#6b4226" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="M7 11h10v2.5c0 4-2.5 7.5-5 8.5-2.5-1-5-4.5-5-8.5z" fill="#c98a4b"/>` +
    `<path d="M5.5 11.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6z" fill="#6b4226"/>`,
);

/** A snowflake: one arm (drawn pointing up from the center), repeated six times around */
const sixfold = (color: string, arm: string, { width = 1.6, center = "" } = {}) =>
  svg(
    `<g fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">` +
      [0, 60, 120, 180, 240, 300]
        .map((angle) => `<g transform="rotate(${angle} 12 12)">${arm}</g>`)
        .join("") +
      `</g>` +
      center,
  );

/** Simple arms, each with a chevron near the tip */
const chevronFlake = sixfold("#78afe0", `<path d="M12 12V2.5M9.6 4.6 12 7l2.4-2.4"/>`);

/** Fine, feathery arms with two pairs of side branches */
const branchingFlake = sixfold(
  "#8fc1ec",
  `<path d="M12 12V2.2M12 8.6l-2.4-2.4M12 8.6l2.4-2.4M12 5.2l-1.6-1.6M12 5.2l1.6-1.6"/>`,
  { width: 1.3 },
);

/** A hexagonal plate at the center, with slender arms ending in small diamonds */
const plateFlake = sixfold(
  "#6aa0d6",
  `<path d="M12 8.4V4.6"/><path d="M12 2.2l.9 1.2-.9 1.2-.9-1.2z" fill="#6aa0d6" stroke-width=".5"/>`,
  {
    width: 1.1,
    center: `<path d="M12 8.4l3.1 1.8v3.6L12 15.6l-3.1-1.8v-3.6z" fill="#6aa0d6" fill-opacity=".25" stroke="#6aa0d6" stroke-width="1.1" stroke-linejoin="round"/><circle cx="12" cy="12" r="1" fill="#6aa0d6"/>`,
  },
);

const mitten = svg(
  `<ellipse cx="7.2" cy="12.4" rx="1.8" ry="3.2" transform="rotate(-28 7.2 12.4)" fill="#4f86c6"/>` +
    `<path d="M8.6 18.5V8.6a3.9 3.9 0 0 1 7.8 0v9.9z" fill="#5d93d2"/>` +
    `<path d="M9.8 12.2h5.4" stroke="#eef5fc" stroke-width="1.2" stroke-linecap="round" stroke-dasharray=".1 1.8"/>` +
    `<rect x="8" y="17.4" width="9" height="4.2" rx="1.2" fill="#eef5fc" stroke="#bcd3ec" stroke-width=".6"/>`,
);

/* New Year's */

const confetti = (color: string) =>
  svg(`<rect x="9" y="4" width="6" height="16" rx="1.4" fill="${color}"/>`);

const streamer = svg(
  `<path d="M8 3c5 2 5 5 1 7s-4 5 1 7 5 4 3 5" fill="none" stroke="#ef6fa6" stroke-width="2.4" stroke-linecap="round"/>`,
);

const star = (color: string) =>
  svg(
    `<path d="M12 2.5l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 16.8l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8z" fill="${color}" stroke-linejoin="round"/>`,
  );

/* Valentine's Day */

const HEART =
  "M12 20.5C5.5 16 3 12.5 3 9.2 3 6.6 5 4.6 7.5 4.6c1.8 0 3.5 1 4.5 2.6 1-1.6 2.7-2.6 4.5-2.6C19 4.6 21 6.6 21 9.2c0 3.3-2.5 6.8-9 11.3z";

const heart = (fill: string, stroke = fill) =>
  svg(
    `<path d="${HEART}" fill="${fill}" stroke="${stroke}" stroke-width=".8" stroke-linejoin="round"/>`,
  );

const loveLetter = svg(
  `<rect x="3" y="6" width="18" height="13" rx="1.6" fill="#fff4f6" stroke="#e8809b"/>` +
    `<path d="M3.6 6.8 12 13l8.4-6.2" fill="none" stroke="#e8809b" stroke-linejoin="round"/>` +
    `<path transform="translate(9 10.6) scale(.25)" d="${HEART}" fill="#e0394f"/>`,
);

/* Birthday */

const cupcake = svg(
  `<path d="M6 13h12l-1.6 8H7.6z" fill="#5bb8c4"/>` +
    `<path d="M9 13.5l.6 7M12 13.5v7M15 13.5l-.6 7" stroke="#3f97a3" stroke-width=".8"/>` +
    `<path d="M5 13.2c0-2.8 2-4.6 4.4-4.6.6-2.4 2.3-3.8 4.2-3.4 2 .4 3.2 2.1 3 4 1.6.5 2.4 2 2.4 4z" fill="#f7a8cf"/>` +
    `<circle cx="12.6" cy="4.6" r="1.6" fill="#e0394f"/>`,
);

const partyHat = svg(
  `<path d="M12 3.5 18.5 20h-13z" fill="#8b6ce0" stroke-linejoin="round"/>` +
    `<circle cx="11" cy="11" r="1" fill="#f7c84a"/><circle cx="13.6" cy="14.6" r="1" fill="#f7c84a"/><circle cx="9.4" cy="17" r="1" fill="#f7c84a"/>` +
    `<path d="M5 20.3h14" stroke="#f7a8cf" stroke-width="1.8" stroke-linecap="round"/>` +
    `<circle cx="12" cy="3.2" r="1.9" fill="#f7a8cf"/>`,
);

const gift = svg(
  `<rect x="4" y="10" width="16" height="11" rx="1.2" fill="#e0394f"/>` +
    `<rect x="3" y="7" width="18" height="4" rx="1" fill="#f0566b"/>` +
    `<rect x="10.8" y="7" width="2.4" height="14" fill="#f7c84a"/>` +
    `<path d="M12 7c-1.5-3-5-3.5-5-1.5 0 1.6 3 1.7 5 1.5zM12 7c1.5-3 5-3.5 5-1.5 0 1.6-3 1.7-5 1.5z" fill="#f7c84a"/>`,
);

/* Spring */

/** Five round petals around a sunny center */
const blossom = (petal: string, edge = petal) =>
  svg(
    [
      [12, 7],
      [16.76, 10.45],
      [14.94, 16.05],
      [9.06, 16.05],
      [7.24, 10.45],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="3.6" fill="${petal}" stroke="${edge}" stroke-width=".6"/>`,
      )
      .join("") + `<circle cx="12" cy="12" r="2" fill="#f7d35c"/>`,
  );

const petal = svg(
  `<path d="M12 3c4 3.5 6 8 4.5 12.5-1 3-3 5-4.5 5.5-1.5-.5-3.5-2.5-4.5-5.5C6 11 8 6.5 12 3z" fill="#f7b6cc"/>`,
);

/* Summer */

const watermelon = svg(
  `<path d="M2.5 9h19a9.5 9.5 0 0 1-19 0z" fill="#3f9a4a"/>` +
    `<path d="M3.8 9h16.4a8.2 8.2 0 0 1-16.4 0z" fill="#f0f7e6"/>` +
    `<path d="M4.8 9h14.4a7.2 7.2 0 0 1-14.4 0z" fill="#f2546a"/>` +
    [
      [9, 11.4],
      [12, 13.4],
      [15, 11.4],
      [12, 10.4],
    ]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx=".5" ry=".9" fill="#3a2a2a"/>`)
      .join(""),
);

const beachBall = svg(
  `<circle cx="12" cy="12" r="9" fill="#fff"/>` +
    // curved panels meeting at the poles: red | white | yellow | white | blue
    `<path d="M12 3C7 6 7 18 12 21A9 9 0 0 1 12 3z" fill="#f2546a"/>` +
    `<path d="M12 3C17 6 17 18 12 21A9 9 0 0 0 12 3z" fill="#3aa0e0"/>` +
    `<path d="M12 3C10.2 7 10.2 17 12 21 13.8 17 13.8 7 12 3z" fill="#f7c84a"/>` +
    `<circle cx="12" cy="12" r="9" fill="none" stroke="#c9d0d8" stroke-width=".8"/>`,
);

const popsicle = svg(
  `<rect x="10.8" y="15" width="2.4" height="6.5" rx="1.2" fill="#d9b483"/>` +
    `<path d="M7.5 7a4.5 4.5 0 0 1 9 0v8.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z" fill="#f58a5c"/>` +
    `<path d="M7.5 9.8h9v2.4h-9z" fill="#f7b267"/>`,
);

/**
 * A blazing sun: sixteen slender spikes, alternating long and short, around a round core.
 * The same burst is the summer badge in site-header.css and public/favicon-summer.svg.
 */
const hotSun = svg(
  `<path d="M12 0.6L13.25 5.72L15.6 3.32L15.56 6.68L20.06 3.94L17.32 8.44L20.68 8.4L18.28 10.75L23.4 12L18.28 13.25L20.68 15.6L17.32 15.56L20.06 20.06L15.56 17.32L15.6 20.68L13.25 18.28L12 23.4L10.75 18.28L8.4 20.68L8.44 17.32L3.94 20.06L6.68 15.56L3.32 15.6L5.72 13.25L0.6 12L5.72 10.75L3.32 8.4L6.68 8.44L3.94 3.94L8.44 6.68L8.4 3.32L10.75 5.72Z" fill="#ff7a3d" stroke="#ff7a3d" stroke-width=".5" stroke-linejoin="round"/>` +
    `<circle cx="12" cy="12" r="6.6" fill="#ff9a3c"/><circle cx="12" cy="12" r="5" fill="#ffd34d"/>`,
);

/* New Year's: the mirrored ball that drops at midnight */
const midnightBall = svg(
  `<path d="M12 1.5v3" stroke="#8e9bb3" stroke-width="1.4" stroke-linecap="round"/>` +
    `<circle cx="12" cy="13" r="8.5" fill="#dfe5f0"/>` +
    `<path d="M12 21.5a8.5 8.5 0 0 1 0-17 5 8.5 0 0 0 0 17z" fill="#b9c4da"/>` +
    `<g fill="none" stroke="#97a6c2" stroke-width=".7">` +
    `<path d="M4.25 9.5h15.5M3.5 13h17M4.25 16.5h15.5M12 4.5v17"/>` +
    `<ellipse cx="12" cy="13" rx="4.3" ry="8.5"/></g>` +
    `<path d="M14.6 8.7h2.9v2.6h-2.9z" fill="#f2c14e"/><path d="M8.6 13.5h3v2.8h-3z" fill="#f7a8cf"/><path d="M15 16.8h2.6v2.2H15z" fill="#a8c7f2"/>` +
    `<circle cx="12" cy="13" r="8.5" fill="none" stroke="#8e9bb3" stroke-width=".8"/>` +
    `<path d="M17.2 3.2l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="#fff6c8"/>` +
    `<path d="M5.4 6.4l.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4z" fill="#fff6c8"/>`,
);

/* Pi Day */

const piSymbol = (color: string) =>
  svg(
    `<g fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">` +
      `<path d="M4.2 8.2c.9-1.8 2.3-2.6 4.2-2.6h11.2"/>` +
      `<path d="M9.6 5.8c0 5.2-.7 9.8-2.8 13.2"/>` +
      `<path d="M15.4 5.8c-.3 4.6-.3 8.9.8 12 .6 1.6 1.9 1.8 3.1.8"/></g>`,
  );

/** A slice of pumpkin pie, from above: crust along the outer edge, a dollop of cream */
const pieSlice = svg(
  `<path d="M4 20L9.8 4A17 17 0 0 1 20 14.2Z" fill="#e99a4a" stroke="#d58436" stroke-width=".6" stroke-linejoin="round"/>` +
    `<path d="M9.8 4A17 17 0 0 1 20 14.2" fill="none" stroke="#c98a3e" stroke-width="2.6" stroke-linecap="round"/>` +
    `<circle cx="12.6" cy="12" r="1.9" fill="#fff8ee"/>`,
);

/** A whole cherry pie with a lattice top */
const latticePie = svg(
  `<circle cx="12" cy="12" r="9.5" fill="#d9a35a"/><circle cx="12" cy="12" r="7.4" fill="#c0392b"/>` +
    `<g stroke="#f0c27a" stroke-width="1.6" stroke-linecap="round">` +
    `<path d="M12 4.8v14.4M8.8 5.6v12.8M15.2 5.6v12.8M4.8 12h14.4M5.6 8.8h12.8M5.6 15.2h12.8"/></g>`,
);

/* Pride Month */

/** The rainbow flag's six colors */
const PRIDE = ["#e8453c", "#f28c28", "#f2c91f", "#3fae5a", "#3b7dd8", "#8a4fc9"];

const rainbowArc = svg(
  `<g fill="none" stroke-width="1.7" stroke-linecap="round">` +
    PRIDE.map((color, index) => {
      const r = 10 - index * 1.6;

      return `<path d="M${12 - r} 18a${r} ${r} 0 0 1 ${2 * r} 0" stroke="${color}"/>`;
    }).join("") +
    `</g>`,
);

/**
 * The intersex-inclusive Progress Pride flag: the six rainbow stripes, with a chevron at the
 * hoist (black, brown, light blue, pink, white) around a yellow triangle and purple ring.
 * Each chevron band is the outermost triangle shifted toward the hoist, so they stay parallel.
 */
const progressFlag = svg(
  PRIDE.map(
    (color, index) =>
      `<rect x="2" y="${(5 + (index * 14) / 6).toFixed(2)}" width="20" height="2.4" fill="${color}"/>`,
  ).join("") +
    ["#1c1c1c", "#784f17", "#5bcefa", "#f5a9b8", "#ffffff", "#fdd817"]
      .map((color, index) => {
        const shift = index * 1.6;
        const edge = (5 + (7 / 12) * shift).toFixed(2);

        return `<path d="M2 ${edge}L${14 - shift} 12L2 ${(24 - +edge).toFixed(2)}z" fill="${color}"/>`;
      })
      .join("") +
    `<circle cx="3.5" cy="12" r=".85" fill="none" stroke="#66338b" stroke-width=".5"/>` +
    `<rect x="2" y="5" width="20" height="14" fill="none" stroke="#1c1c1c" stroke-opacity=".3" stroke-width=".5"/>`,
);

export const PIECES: Record<string, string[]> = {
  newyear: [confetti("#e3b341"), streamer, midnightBall, star("#f2c14e")],
  valentine: [heart("#e0394f"), heart("#9b5de5"), loveLetter, heart("#f9c2d1", "#e8809b")],
  birthday: [cupcake, partyHat, gift, confetti("#4fc1c9")],
  spring: [
    blossom("#f5a3c0", "#ec8fb0"),
    blossom("#fdf2f6", "#f0b6cb"),
    petal,
    leaf("#7cc46a", "#3f7a32"),
  ],
  pi: [piSymbol("#4a6fd6"), pieSlice, piSymbol("#e0894a"), latticePie],
  pride: [rainbowArc, progressFlag, ...PRIDE.map((color) => heart(color))],
  summer: [watermelon, beachBall, popsicle, hotSun],
  halloween: [pumpkin, candyCorn, bat, ghost],
  thanksgiving: [
    leaf("#c2410c", "#7c2d12"),
    leaf("#e8891c", "#9a4a0c"),
    acorn,
    leaf("#dcab2c", "#80600e"),
  ],
  // three kinds of snowflake, and a mitten
  winter: [chevronFlake, branchingFlake, plateFlake, mitten],
};
