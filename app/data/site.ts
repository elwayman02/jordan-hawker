import type { IconName } from "#app/icons.ts";

export interface SocialLink {
  label: string;
  handle: string;
  url: string;
  icon: IconName;
}

export const site = {
  name: "Jordan Hawker",
  url: "https://www.jordanhawker.com",
  email: "hawker.jordan@gmail.com",
  discord: "axlehellfire",
  discordUrl: "https://discord.com/users/103262044609863680",
  /** jhawk.co/resume → the published Google Doc */
  resumeUrl: "https://jhawk.co/resume",
  repoUrl: "https://github.com/elwayman02/jordan-hawker",
  blueskyHandle: "axle.jhawk.co",
} as const;

/** Professional profiles, shown first */
export const professionalLinks: SocialLink[] = [
  {
    label: "GitHub",
    handle: "elwayman02",
    url: "https://github.com/elwayman02",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "jordanhawker",
    url: "https://www.linkedin.com/in/jordanhawker/",
    icon: "linkedin",
  },
  {
    label: "Bluesky",
    handle: "@axle.jhawk.co",
    url: "https://bsky.app/profile/axle.jhawk.co",
    icon: "bluesky",
  },
];

/** Music & personal */
export const personalLinks: SocialLink[] = [
  {
    label: "SoundCloud",
    handle: "axlehellfire",
    url: "https://soundcloud.com/axlehellfire",
    icon: "soundcloud",
  },
  {
    label: "YouTube",
    handle: "@axlehellfire",
    url: "https://www.youtube.com/axlehellfire",
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
];

export const socialLinks = [...professionalLinks, ...personalLinks];

export const music = {
  alias: "Axle Hellfire",
  soundcloud: "https://soundcloud.com/axlehellfire",
  youtube: "https://www.youtube.com/axlehellfire",
  bandcamp: "https://axlehellfire.bandcamp.com",
} as const;

export const hellaDrunk = {
  name: "Hella Drunk",
  url: "https://helladrunk.com/",
  instagram: "https://www.instagram.com/hella.drunk",
  instagramHandle: "@hella.drunk",
  tagline: "Honest ratings & reviews of wine and spirits, plus cocktail adventures on Instagram.",
} as const;
