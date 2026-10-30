import type { Config } from "@netlify/functions";

import { getSound } from "../../server/sound.ts";
import { HOUR, respond } from "../../server/respond.ts";

export default () => respond("sound", getSound, { maxAge: 12 * HOUR });

export const config: Config = { path: "/api/sound" };
