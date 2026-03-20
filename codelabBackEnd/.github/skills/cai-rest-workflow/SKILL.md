---
name: cai-rest-workflow
description: "Use when implementing or refactoring CAI REST APIs with range and date sequence validations, including create, list, and latest vigente endpoints."
---

# CAI REST Workflow

## Outcome

Implement CAI endpoints with business-safe validations:
- Create a new CAI with emission range.
- List all issued CAI records including availability status.
- Return only the latest vigente CAI.

## Input Contract (Create)

Expected request fields:
- codigo
- fechaInicio
- fechaFin
- inicioRango
- finalRango

Do not accept from client:
- id_cai (autoincrement)
- activo (set true by default)

## Step-by-step

1. Validate request body shape
- Request must be an object.
- Required fields must exist and be non-empty.

2. Validate dates
- Parse fechaInicio and fechaFin as valid dates.
- Reject when fechaInicio > fechaFin.
- Fetch the previous CAI by max fechaFin.
- Reject when new fechaInicio <= previous fechaFin.
- Reject when new fechaFin <= previous fechaFin.

3. Validate ranges
- Parse inicioRango and finalRango as positive integers.
- Reject when inicioRango > finalRango.
- Fetch previous range by max final_rango.
- Reject when inicioRango <= previous final_rango.
- Reject when finalRango <= previous final_rango.

4. Validate uniqueness
- Reject if codigo already exists.

5. Persist atomically
- Create CAI with activo=true.
- Create RangoEmision linked by id_cai.
- Use transaction to avoid partial inserts.

6. Build list endpoint
- Return all CAI with nested range.
- Include computed disponible:
  - true when activo=true and fechaFin >= now
  - false otherwise

7. Build latest vigente endpoint
- Query CAI where:
  - activo=true
  - fechaInicio <= now
  - fechaFin >= now
- Return latest one by fechaInicio desc (and id desc as tie-breaker).
- Return 404 when none exists.

## Quality checks

- Validation errors return 400.
- Conflicts (duplicate code or invalid sequence vs previous data) return 409.
- Missing vigente CAI returns 404.
- Responses keep project convention:
  - success: true/false
  - data payload
  - message for create success
- Controllers delegate logic to services and repositories.

## Branching decisions

- If there is no previous CAI, skip chronological sequence check.
- If there is no previous range, skip range continuity check.
- If business later needs overlap by date, replace strict greater-than with explicit overlap windows.
