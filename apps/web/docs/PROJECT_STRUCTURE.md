# Project Structure

The Web application lives at `apps/web`. It uses the Next.js App Router with a feature-first organization for tool modules and a shared layer for reusable platform code.

## Directory Layout

```text
src/
├── app/                    # Next.js routes, layouts, and route-level composition
│   ├── page.tsx            # Toolbox home page
│   └── tools/              # Tool route entry points
├── shared/                 # Cross-feature application layer
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React context providers
│   ├── data/               # Shared catalog/configuration data
│   ├── hooks/              # Reusable React hooks
│   ├── services/           # Cross-cutting client services and API adapters
│   ├── types/              # Shared TypeScript contracts
│   └── utils/              # Pure utilities and browser storage helpers
└── tools/                  # Feature modules for each toolbox item
    ├── academic-center/
    ├── crypto-tool/
    ├── dev-tools/
    ├── mini-games/
    └── usa-identity/
```

## Architectural Rules

1. **Routes compose, features own behavior**
   - Files under `src/app` should stay thin and focus on route-level layout and composition.
   - Tool-specific state, data, components, and utilities belong under `src/tools/<tool-name>`.

2. **Shared code must be truly reusable**
   - Put reusable UI, hooks, utilities, services, and shared data in `src/shared`.
   - Avoid moving tool-specific logic into `shared` just to shorten import paths.

3. **Prefer absolute imports**
   - Use `@/shared/...` and `@/tools/...` for cross-directory imports.
   - Relative imports are acceptable inside the same feature folder when they improve locality.

4. **Services are side-effect adapters**
   - Network/API/cache adapters live in `src/shared/services`.
   - Pure helpers live in `src/shared/utils`.

5. **Feature modules follow a consistent shape**
   - `components/`: tool UI pieces
   - `data/`: static tool data and constants
   - `types/`: feature-specific TypeScript types
   - `utils/`: feature-only utilities and storage helpers
   - `context/` or `hooks/`: feature state when needed

## Current Refactor Notes

- The shared tool catalog now lives at `src/shared/data/tools.ts`.
- News and translation adapters now live at `src/shared/services`.
- The global header component is flattened to `src/shared/components/Header.tsx` because there was no broader layout component group yet.
