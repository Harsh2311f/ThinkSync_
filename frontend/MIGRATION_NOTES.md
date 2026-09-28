# Migration Notes

## What was intentionally preserved

- `style.css` and all page CSS files: unchanged.
- `theme-sync.js`: unchanged.
- Existing variable names, dataset names, render function names, comments and manually written page logic: preserved.
- Original `train_banner.jpg`: preserved.
- Original source files: copied unchanged into `/original`.

## What changed only because React requires it

- Each original HTML body became a React page in `src/pages/`.
- JSX-required attributes were converted (`class` -> `className`, `for` -> `htmlFor`, etc.).
- Inline HTML `style="..."` attributes became React style objects.
- `<input>` elements became JSX self-closing elements.
- Page navigation links changed from `tasks.html`, `map.html`, etc. to React routes such as `/tasks`, `/map`, etc.
- Each page JavaScript engine has only its outer `DOMContentLoaded` wrapper adapted so it runs after React mounts that page. The application logic inside is preserved.
- Vite/React bootstrap files and React Router were added.
- `src/services/api.js` was added for later FastAPI integration. Existing mock data has not been removed yet so visual behavior remains stable.

## Why the page engines were preserved

This migration is deliberately conservative. Rewriting every DOM renderer into React state/hooks in one pass would make the code unfamiliar to the team and increase regression risk. The current version gives the project React/Vite routing and JSX pages while keeping the team's manually written logic recognizable. Backend/API replacement can now happen incrementally.
