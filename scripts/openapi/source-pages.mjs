import fs from "node:fs";
import path from "node:path";

const OPENAPI_SOURCE_DIR = path.resolve("openapi");

function normalizeDocValue(value) {
  return value.replaceAll("\\_", "_");
}

function normalizePathFromUrl(url) {
  return normalizeDocValue(new URL(url).pathname).replaceAll(/:([a-z_]+)/g, "{$1}");
}

function extractDescription(text, url) {
  const marker = `## ${url}`;
  const remainder = text.split(marker)[1];
  if (!remainder) {
    return "";
  }

  const afterHeading = remainder.trimStart();
  const description = afterHeading.split("\n\n## Request")[0]?.trim() ?? "";
  return normalizeDocValue(description);
}

export function loadRoutePages() {
  const pages = new Map();

  for (const entry of fs.readdirSync(OPENAPI_SOURCE_DIR).sort()) {
    if (!/^page-.*\.md$/.test(entry)) {
      continue;
    }

    const absolutePath = path.join(OPENAPI_SOURCE_DIR, entry);
    const text = fs.readFileSync(absolutePath, "utf8");
    const methodMatch = text.match(/^(GET|POST|PUT|PATCH|DELETE)\s*$/m);
    const urlMatch = text.match(/^## (https:\/\/api\.statbot\.net\/[^\r\n]+)/m);

    if (!methodMatch || !urlMatch) {
      continue;
    }

    const title =
      normalizeDocValue(text.match(/^# (.+?) \| Statbot/m)?.[1] ?? entry).trim();
    const url = normalizeDocValue(urlMatch[1]);
    const normalizedPath = normalizePathFromUrl(url);

    if (pages.has(normalizedPath)) {
      continue;
    }

    pages.set(normalizedPath, {
      file: entry,
      method: methodMatch[1].toLowerCase(),
      path: normalizedPath,
      summary: title,
      description: extractDescription(text, url),
    });
  }

  return pages;
}
