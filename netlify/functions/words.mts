import type { Config } from "@netlify/functions";

import { getWords } from "../../server/words.ts";
import { respond } from "../../server/respond.ts";

export default () => respond("words", getWords, { maxAge: 3600 });

export const config: Config = { path: "/api/words" };
