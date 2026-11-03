import type { Config } from "@netlify/functions";

import { getVotes } from "../../server/votes.ts";
import { HOUR, respond } from "../../server/respond.ts";

export default () => respond("votes", getVotes, { maxAge: 24 * HOUR });

export const config: Config = { path: "/api/votes" };
