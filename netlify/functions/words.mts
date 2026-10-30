import type { Config } from "@netlify/functions";

import { getWords } from "../../server/words.ts";
import { HOUR, respond } from "../../server/respond.ts";

export default () => respond("words", getWords, { maxAge: 12 * HOUR });

export const config: Config = { path: "/api/words" };
