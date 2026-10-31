import type { Config } from "@netlify/functions";

import { getVotes } from "../../server/votes.ts";
import { HOUR, respond } from "../../server/respond.ts";

// Guides get edited right up to election day, so refresh hourly.
export default () => respond("votes", getVotes, { maxAge: HOUR });

export const config: Config = { path: "/api/votes" };
