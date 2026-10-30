import type { Config } from "@netlify/functions";

import { getHella } from "../../server/hella.ts";
import { HOUR, respond } from "../../server/respond.ts";

export default () => respond("hella", getHella, { maxAge: 24 * HOUR });

export const config: Config = { path: "/api/hella" };
