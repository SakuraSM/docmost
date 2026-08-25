# Project knowledge

This directory stores stable facts that are expensive to rediscover from source.
It does not mirror code line by line or hold task plans.

- [Development map](dev-map.md): entrypoints, modules, dependency direction,
  generated code, and external boundaries.
- [Module contexts](contexts.md): responsibilities, contracts, hidden
  dependencies, and validation paths.
- [Stable flows](flows.md): user/data flows, permission semantics, failure
  behavior, and external effects.

Read `AGENTS.md` first, then load only the smallest relevant knowledge file.
Update these documents when an entrypoint, responsibility, public contract,
stable data flow, or validation strategy changes.
