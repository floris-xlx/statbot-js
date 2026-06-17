import fs from "node:fs";
import path from "node:path";
import SwaggerParser from "@apidevtools/swagger-parser";
import YAML from "yaml";
import { describe, expect, it } from "vitest";
import { StatbotClient } from "../src/client.js";

interface OpenApiOperation {
  operationId: string;
}

interface OpenApiPathItem {
  get?: OpenApiOperation;
}

interface OpenApiDocument {
  openapi: string;
  paths: Record<string, OpenApiPathItem>;
}

const openapiDir = path.resolve(process.cwd(), "openapi");
const openapiJsonPath = path.join(openapiDir, "openapi.json");
const openapiYamlPath = path.join(openapiDir, "openapi.yaml");
const exampleRoutesDir = path.resolve(process.cwd(), "examples", "routes");

function readOpenApiJson() {
  return JSON.parse(fs.readFileSync(openapiJsonPath, "utf8")) as OpenApiDocument;
}

function readOpenApiYaml() {
  return YAML.parse(fs.readFileSync(openapiYamlPath, "utf8")) as OpenApiDocument;
}

function toExampleFileName(operationId: string) {
  return operationId.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase() + ".ts";
}

describe("OpenAPI artifacts", () => {
  it("keeps only generated JSON and YAML artifacts in the openapi directory", () => {
    const openapiFiles = fs
      .readdirSync(openapiDir)
      .filter((entry) => entry.endsWith(".json") || entry.endsWith(".yaml") || entry.endsWith(".md"));

    expect(openapiFiles.sort()).toStrictEqual(["openapi.json", "openapi.yaml"]);
  });

  it("keeps openapi.json and openapi.yaml structurally equivalent", () => {
    expect(readOpenApiYaml()).toStrictEqual(readOpenApiJson());
  });

  it("validates both OpenAPI artifacts with Swagger Parser", async () => {
    const validatedJson = (await SwaggerParser.validate(openapiJsonPath, {
      validate: { schema: true, spec: false },
    })) as unknown as OpenApiDocument;
    const validatedYaml = (await SwaggerParser.validate(openapiYamlPath, {
      validate: { schema: true, spec: false },
    })) as unknown as OpenApiDocument;

    expect(validatedJson.openapi).toBe("3.1.0");
    expect(validatedYaml.openapi).toBe("3.1.0");
    expect(Object.keys(validatedJson.paths)).toHaveLength(23);
    expect(Object.keys(validatedYaml.paths)).toHaveLength(23);
  });

  it("keeps one typed example file per OpenAPI operation", () => {
    const spec = readOpenApiJson();
    const operationIds = Object.values(spec.paths)
      .flatMap((pathItem) => (pathItem.get ? [pathItem.get.operationId] : []))
      .sort();

    const exampleFiles = fs
      .readdirSync(exampleRoutesDir)
      .filter((entry) => entry.endsWith(".ts"))
      .sort();

    expect(exampleFiles).toStrictEqual(operationIds.map(toExampleFileName).sort());
  });

  it("keeps StatbotClient methods aligned with OpenAPI operationIds", () => {
    const spec = readOpenApiJson();
    const operationIds = Object.values(spec.paths)
      .flatMap((pathItem) => (pathItem.get ? [pathItem.get.operationId] : []))
      .sort();

    const clientMethods = Object.getOwnPropertyNames(StatbotClient.prototype)
      .filter((methodName) => operationIds.includes(methodName))
      .sort();

    expect(clientMethods).toStrictEqual(operationIds);
  });
});
