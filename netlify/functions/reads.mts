import type { Config } from "@netlify/functions";

import { getReads } from "../../server/reads.ts";
import { HOUR, respond } from "../../server/respond.ts";

export default () => respond("reads", getReads, { maxAge: 6 * HOUR });

export const config: Config = { path: "/api/reads" };
