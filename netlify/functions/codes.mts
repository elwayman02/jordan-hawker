import type { Config } from "@netlify/functions";

import { getCodes } from "../../server/codes.ts";
import { HOUR, respond } from "../../server/respond.ts";

export default () => respond("codes", getCodes, { maxAge: 6 * HOUR });

export const config: Config = { path: "/api/codes" };
