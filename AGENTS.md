# Eileen — Agent Rules

## Changelog routine
After every user-requested change, append an entry to `CHANGELOG.txt` at the project root.

Format:
```
[YYYY-MM-DD]
- Short description of what changed and why
```

Rules:
- One bullet per logical change (not per file edited).
- Append under the correct date block; create a new date block if the date changed.
- Do this before committing, so the changelog is included in the same commit.
- Do not duplicate entries already present.
