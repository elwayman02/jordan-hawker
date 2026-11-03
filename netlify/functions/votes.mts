import type { Config } from "@netlify/functions";

import { getVotes } from "../../server/votes.ts";
import { HOUR, respond } from "../../server/respond.ts";

// Guides get edited right up to election day, so they refresh more often than most sources.
export default () => respond("votes", getVotes, { maxAge: 3 * HOUR });

export const config: Config = { path: "/api/votes" };
