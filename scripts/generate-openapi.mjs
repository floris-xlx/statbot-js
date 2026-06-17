import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { createComponents } from "./openapi/components.mjs";
import { createOperations } from "./openapi/operations.mjs";
import { loadRoutePages } from "./openapi/source-pages.mjs";

const OUTPUT_DIR = path.resolve("openapi");
const OPENAPI_JSON_PATH = path.join(OUTPUT_DIR, "openapi.json");
const OPENAPI_YAML_PATH = path.join(OUTPUT_DIR, "openapi.yaml");

const routePages = loadRoutePages();
const pathsObject = createOperations(routePages);
const routeCount = Object.keys(pathsObject).length;

const document = {
  openapi: "3.1.0",
  info: {
    title: "Statbot API",
    version: "1.0.0",
    description:
      "Generated from the markdown route captures under `openapi/page-*.md`. This document models the current public GET endpoints captured on June 17, 2026.",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "https://api.statbot.net",
      description: "Production",
    },
  ],
  tags: [
    {
      name: "Activities",
      description: "Guild activity and global activity endpoints.",
    },
    {
      name: "Messages",
      description: "Guild message stats endpoints.",
    },
    {
      name: "Voice",
      description: "Guild voice stats endpoints.",
    },
    {
      name: "Guild Counts",
      description: "Guild member, participant, and presence count endpoints.",
    },
    {
      name: "Invites",
      description: "Guild invite analytics and invite resource endpoints.",
    },
    {
      name: "Channels",
      description: "Guild channel resource endpoints.",
    },
  ],
  security: [{ BearerAuth: [] }],
  paths: pathsObject,
  components: createComponents(),
  "x-generated-from": {
    routeMarkdownCount: routePages.size,
    documentedOperations: routeCount,
    generatedAt: new Date().toISOString(),
  },
};

fs.writeFileSync(OPENAPI_JSON_PATH, `${JSON.stringify(document, null, 2)}\n`);
fs.writeFileSync(OPENAPI_YAML_PATH, YAML.stringify(document));

console.log(`Wrote ${OPENAPI_JSON_PATH}`);
console.log(`Wrote ${OPENAPI_YAML_PATH}`);
console.log(`Generated ${routeCount} OpenAPI operations from ${routePages.size} route pages.`);
