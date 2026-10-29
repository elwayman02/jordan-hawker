import type { Config } from "@netlify/functions";

import { getResume } from "../../server/resume.ts";
import { respond } from "../../server/respond.ts";

export default () => respond("resume", getResume, { maxAge: 900 });

export const config: Config = { path: "/api/resume" };
