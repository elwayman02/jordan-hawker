import type { Config } from "@netlify/functions";

import { getResume } from "../../server/resume.ts";
import { HOUR, respond } from "../../server/respond.ts";

export default () => respond("resume", getResume, { maxAge: 3 * HOUR });

export const config: Config = { path: "/api/resume" };
