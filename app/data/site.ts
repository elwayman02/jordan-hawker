import { SITE_NAME, SITE_URL } from "#shared/site.ts";

import type { IconName } from "#app/icons.ts";

export interface SocialLink {
  label: string;
  handle: string;
  url: string;
  icon: IconName;
}

const github = "https://github.com/elwayman02";
const blueskyHandle = "axle.jhawk.co";

export const site = {
  name: SITE_NAME,
  url: SITE_URL,
  email: "hawker.jordan@gmail.com",
  discord: "axlehellfire",
  discordUrl: "https://discord.com/users/103262044609863680",
  /** jhawk.co/resume → the published Google Doc */
  resumeUrl: "https://jhawk.co/resume",
  githubUrl: github,
  githubReposUrl: `${github}?tab=repositories`,
  repoUrl: `${github}/jordan-hawker`,
  linkedinUrl: "https://www.linkedin.com/in/jordanhawker/",
  blueskyHandle,
  blueskyUrl: `https://bsky.app/profile/${blueskyHandle}`,
  goodreadsUrl: "https://www.goodreads.com/axlehellfire",
} as const;

export const music = {
  alias: "Axle Hellfire",
  soundcloud: "https://soundcloud.com/axlehellfire",
  youtube: "https://www.youtube.com/axlehellfire",
  bandcamp: "https://axlehellfire.bandcamp.com",
} as const;

/** Professional profiles, shown first */
export const professionalLinks: SocialLink[] = [
  {
    label: "GitHub",
    handle: "elwayman02",
    url: site.githubUrl,
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "jordanhawker",
    url: site.linkedinUrl,
    icon: "linkedin",
  },
  {
    label: "Bluesky",
    handle: `@${site.blueskyHandle}`,
    url: site.blueskyUrl,
    icon: "bluesky",
  },
];

/** Music & personal */
export const personalLinks: SocialLink[] = [
  {
    label: "SoundCloud",
    handle: "axlehellfire",
    url: music.soundcloud,
    icon: "soundcloud",
  },
  {
    label: "YouTube",
    handle: "@axlehellfire",
    url: music.youtube,
    icon: "youtube",
  },
  {
    label: "Instagram",
    handle: "@axlehellfire",
    url: "https://www.instagram.com/axlehellfire",
    icon: "instagram",
  },
  {
    label: "Facebook",
    handle: "axlehellfire",
    url: "https://www.facebook.com/axlehellfire",
    icon: "facebook",
  },
  {
    label: "Goodreads",
    handle: "axlehellfire",
    url: site.goodreadsUrl,
    icon: "goodreads",
  },
];

export const discordLink: SocialLink = {
  label: "Discord",
  handle: `@${site.discord}`,
  url: site.discordUrl,
  icon: "discord",
};

/** Where to reach me directly, alongside email */
export const contactLinks: SocialLink[] = [...professionalLinks, discordLink];

export const socialLinks = [...professionalLinks, ...personalLinks];

export const hellaDrunk = {
  name: "Hella Drunk",
  url: "https://helladrunk.com/",
  instagram: "https://www.instagram.com/hella.drunk",
  instagramHandle: "@hella.drunk",
  tagline: "Honest ratings & reviews of wine and spirits, plus cocktail adventures on Instagram.",
} as const;
