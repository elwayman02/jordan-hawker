/**
 * Every icon the site uses, as raw SVG strings (see unplugin-icons in vite.config.mjs).
 *
 * UI icons: Lucide. Brand icons: Remix Icon (Simple Icons for what Remix lacks).
 */
import arrowLeft from "~icons/lucide/arrow-left";
import arrowRight from "~icons/lucide/arrow-right";
import arrowUpRight from "~icons/lucide/arrow-up-right";
import chevronLeft from "~icons/lucide/chevron-left";
import chevronRight from "~icons/lucide/chevron-right";
import fileText from "~icons/lucide/file-text";
import gitFork from "~icons/lucide/git-fork";
import heart from "~icons/lucide/heart";
import martini from "~icons/lucide/martini";
import messageCircle from "~icons/lucide/message-circle";
import monitor from "~icons/lucide/monitor";
import moon from "~icons/lucide/moon";
import play from "~icons/lucide/play";
import quote from "~icons/lucide/quote";
import repeat from "~icons/lucide/repeat-2";
import star from "~icons/lucide/star";
import sun from "~icons/lucide/sun";
import bluesky from "~icons/ri/bluesky-fill";
import discord from "~icons/ri/discord-fill";
import facebook from "~icons/ri/facebook-circle-fill";
import github from "~icons/ri/github-fill";
import instagram from "~icons/ri/instagram-line";
import linkedin from "~icons/ri/linkedin-box-fill";
import mail from "~icons/ri/mail-line";
import soundcloud from "~icons/ri/soundcloud-fill";
import youtube from "~icons/ri/youtube-fill";
import bandcamp from "~icons/simple-icons/bandcamp";

export const icons = {
  arrowLeft,
  arrowRight,
  arrowUpRight,
  bandcamp,
  bluesky,
  chevronLeft,
  chevronRight,
  discord,
  facebook,
  fileText,
  gitFork,
  github,
  heart,
  instagram,
  linkedin,
  mail,
  martini,
  messageCircle,
  monitor,
  moon,
  play,
  quote,
  repeat,
  soundcloud,
  star,
  sun,
  youtube,
} as const;

export type IconName = keyof typeof icons;
