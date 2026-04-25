# Eileen — Agent Rules

## Changelog routine
After every user-requested change, append an entry to `CHANGELOG.txt` at the project root.

Format:
```
[YYYY-MM-DD]
- [PageOrComponent] Short description of what changed and why
```

Page/component tags to use:
- `[Shelf]` — src/pages/Submissions.tsx
- `[Stores]` — src/pages/Stores.tsx
- `[Drawer]` — src/components/SubmissionDrawer.tsx
- `[Sidebar]` — src/components/layout/Sidebar.tsx
- `[App]` — src/App.tsx
- `[Global]` — src/index.css or changes that affect all pages
- `[Component: <name>]` — any shared UI component (e.g. Toast, ShareDialog)

Rules:
- One bullet per logical change (not per file edited).
- Always prefix each bullet with the relevant `[Tag]`.
- Append under the correct date block; create a new date block if the date changed.
- Do this before committing, so the changelog is included in the same commit.
- Do not duplicate entries already present.
