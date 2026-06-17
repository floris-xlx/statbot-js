## Tenant Wildcard Hostnames for Athena HTTP + Public PG Contract

### Summary
Make `tenant.v3.athena-cluster.com` the canonical public tenant hostname shape for Athena, with `tenant` mapped through `public_gateway_routes` only. Keep Athena responsible for HTTP wildcard resolution and Postgres hostname metadata, but not for Cloudflare or TCP/TLS proxy management.

### Implementation Changes
- Align the wildcard defaults and docs to `*.v3.athena-cluster.com`.
  - Update the documented/default operator path to use `ATHENA_WILDCARD_HOST_PATTERN=*.v3.athena-cluster.com`.
  - Remove stale `athena-db.com` wildcard examples where they describe this tenant-hostname feature.
- Keep HTTP wildcard resolution on the existing runtime path.
  - Do not add direct `athena_clients.client_name` fallback.
  - `tenant.v3.athena-cluster.com` must resolve only when an active `public_gateway_routes.route_key = tenant` row exists.
  - Preserve existing single-label validation rules for the wildcard prefix: lowercase-normalized, no dots, allowed chars `[a-z0-9-_]`.
- Add one idempotent admin onboarding API for tenant hostnames.
  - New endpoint: `PUT /admin/tenant-hostnames/{tenant}`.
  - Request body:
    - `client_name?: string` default = `{tenant}`
    - `allowed_ops?: string[]` default = `["delete","fetch","insert","query","update"]`
    - `enable_http_route?: boolean` default = `true`
    - `enable_postgres_binding?: boolean` default = `true`
    - `public_host?: string` default = derived from wildcard pattern and `{tenant}`
    - `public_port?: u16` default = source Postgres URI port, else `5432`
    - `route_metadata?: json` optional, merged into `public_gateway_routes.metadata`
    - `persist_in_catalog?: boolean` default = `true`
  - Response body:
    - `tenant`
    - `derived_host`
    - `http_route` with the upserted route row or `null`
    - `postgres_binding` with `public_pg_uri`, binding metadata, and DNS lookup status or `null`
    - `wildcard_pattern`
- Define exact onboarding behavior.
  - Validate `{tenant}` with the existing route-binding/host-label rules.
  - Upsert `public_gateway_routes` using `route_key = tenant`, `client_name = body.client_name ?? tenant`, and the effective `allowed_ops`.
  - When PG binding is enabled, derive a binding using the existing catalog/public-proxy helpers and store it under `athena_clients.metadata.network.pg_route_bindings[tenant]`.
  - Preserve existing private/source URI metadata.
  - Only overwrite top-level `athena_clients.pg_uri` with the derived `public_pg_uri` when the current configured/source URI targets loopback or another managed-local endpoint; otherwise keep the existing `pg_uri` and store the public hostname only in metadata.
- Keep the Cloudflare boundary explicit.
  - Document that Athena HTTP wildcard host routing is first-class.
  - Document that raw Postgres on the same tenant hostname requires external TCP/TLS infrastructure and is not proxied by Athena itself.
  - Do not add Cloudflare API calls, Spectrum provisioning, or certificate management.

### Public API / Type Additions
- Add `UpsertTenantHostnameRequest` and response types for `PUT /admin/tenant-hostnames/{tenant}`.
- Reuse existing route-key and public-host normalization rules instead of introducing new tenant-specific validation.
- No new tables or SQL migrations; reuse:
  - `public_gateway_routes`
  - `athena_clients.metadata.network.pg_route_bindings`

### Test Plan
- Wildcard HTTP resolution:
  - `tenant.v3.athena-cluster.com` resolves to the route’s `client_name` when the route exists and is active.
  - Missing or inactive route does not resolve.
  - Hostnames with dots in the tenant label are rejected.
  - Hyphen/underscore/digits continue to work.
- Onboarding API:
  - First call creates the public route and PG binding.
  - Repeated identical call is idempotent and does not duplicate state.
  - Default `client_name = tenant` and default allowed ops are applied correctly.
  - Explicit `client_name` override is honored.
- PG binding behavior:
  - Derived `public_pg_uri` uses `{tenant}.v3.athena-cluster.com`.
  - Loopback/local source URIs may promote the public URI to top-level `pg_uri`.
  - Non-loopback source URIs keep their original top-level `pg_uri` and only gain route-binding metadata.
- Documentation/config:
  - `.env.example` and README examples consistently use the v3 wildcard shape.

### Assumptions
- `public_gateway_routes` remains the only HTTP wildcard lookup source.
- One Athena process uses one wildcard suffix pattern at a time.
- Cloudflare/Spectrum setup is handled outside Athena.
- Tenant tokens are single-label hostnames and do not require dots or multi-segment parsing.
