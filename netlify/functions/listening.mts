import type { Config } from "@netlify/functions";

import { getListening } from "../../server/listening.ts";
import { HOUR, respond } from "../../server/respond.ts";

// What I'm listening to changes by the minute; a quarter hour keeps it current enough
export default () => respond("listening", getListening, { maxAge: HOUR / 4 });

export const config: Config = { path: "/api/listening" };
