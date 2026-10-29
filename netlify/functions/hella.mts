import type { Config } from "@netlify/functions";

import { getHella } from "../../server/hella.ts";
import { respond } from "../../server/respond.ts";

export default () => respond("hella", getHella, { maxAge: 21600 });

export const config: Config = { path: "/api/hella" };
