import type { Config } from "@netlify/functions";

import { getListening } from "../../server/listening.ts";
import { HOUR, respond } from "../../server/respond.ts";

// Not a live feed: every few hours is plenty
export default () => respond("listening", getListening, { maxAge: 3 * HOUR });

export const config: Config = { path: "/api/listening" };
