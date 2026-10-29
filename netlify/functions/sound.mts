import type { Config } from "@netlify/functions";

import { getSound } from "../../server/sound.ts";
import { respond } from "../../server/respond.ts";

export default () => respond("sound", getSound, { maxAge: 3600 });

export const config: Config = { path: "/api/sound" };
