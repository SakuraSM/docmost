# Harness templates

## Impact map

```md
- Goal:
- Behavior change:
- Touched paths:
- Dependencies and consumers:
- Risk domains:
- No-touch paths:
- Focused validation:
- Broad validation:
- Knowledge update:
```

## Verification record

```md
# Verification

## Automated checks

| Command | Commit/tree | Status | Evidence |
| --- | --- | --- | --- |
| | | not-run | |

## Manual or external checks

- Environment/path:
- Steps:
- Assertions:

## Skipped or blocked checks

- Check / reason / substitute / confidence impact

## Conclusion

- not-ready / ready-with-warnings / ready
```

## Review record

```md
# Review

- Behavior impact:
- Architecture and boundary impact:
- Authentication/authorization impact:
- Data, migration, and cleanup impact:
- External consumer impact:
- Accessibility and UI evidence:
- Verification evidence:
- Rollback or recovery:
- Follow-up:
```

## Decision record

```md
- Date:
- Context:
- Decision:
- Alternatives:
- Evidence:
- Consequences:
- Revisit trigger:
```

## Default-fail acceptance

```json
{
  "criterion": "Observable user or system behavior",
  "passes": false,
  "evidence": [],
  "reviewedBy": null
}
```
