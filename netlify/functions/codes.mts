import type { Config } from "@netlify/functions";

import { getCodes } from "../../server/codes.ts";
import { respond } from "../../server/respond.ts";

export default () => respond("codes", getCodes, { maxAge: 3600 });

export const config: Config = { path: "/api/codes" };
