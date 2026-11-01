/**
 * Every icon the site uses, as raw SVG strings (see unplugin-icons in vite.config.mjs).
 *
 * UI icons: Lucide. Brand icons: Remix Icon (Simple Icons for what Remix lacks).
 */
import arrowLeft from "~icons/lucide/arrow-left";
import arrowRight from "~icons/lucide/arrow-right";
import arrowUpRight from "~icons/lucide/arrow-up-right";
import audioLines from "~icons/lucide/audio-lines";
import briefcase from "~icons/lucide/briefcase";
import cake from "~icons/lucide/cake";
import chevronLeft from "~icons/lucide/chevron-left";
import chevronRight from "~icons/lucide/chevron-right";
import codeXml from "~icons/lucide/code-xml";
import fileText from "~icons/lucide/file-text";
import flower from "~icons/lucide/flower";
import ghost from "~icons/lucide/ghost";
import gitFork from "~icons/lucide/git-fork";
import heart from "~icons/lucide/heart";
import leaf from "~icons/lucide/leaf";
import martini from "~icons/lucide/martini";
import messageCircle from "~icons/lucide/message-circle";
import monitor from "~icons/lucide/monitor";
import moon from "~icons/lucide/moon";
import partyPopper from "~icons/lucide/party-popper";
import penLine from "~icons/lucide/pen-line";
import pi from "~icons/lucide/pi";
import play from "~icons/lucide/play";
import quote from "~icons/lucide/quote";
import rainbow from "~icons/lucide/rainbow";
import repeat from "~icons/lucide/repeat-2";
import snowflake from "~icons/lucide/snowflake";
import star from "~icons/lucide/star";
import sun from "~icons/lucide/sun";
import treePalm from "~icons/lucide/tree-palm";
import vote from "~icons/lucide/vote";
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
  audioLines,
  bandcamp,
  bluesky,
  briefcase,
  cake,
  chevronLeft,
  chevronRight,
  codeXml,
  discord,
  facebook,
  fileText,
  flower,
  ghost,
  gitFork,
  github,
  heart,
  instagram,
  leaf,
  linkedin,
  mail,
  martini,
  messageCircle,
  monitor,
  moon,
  partyPopper,
  penLine,
  pi,
  play,
  quote,
  rainbow,
  repeat,
  snowflake,
  soundcloud,
  star,
  sun,
  treePalm,
  vote,
  youtube,
} as const;

export type IconName = keyof typeof icons;
