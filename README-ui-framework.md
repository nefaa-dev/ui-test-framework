# UI Testing Framework

A scalable, maintainable **UI test automation framework** built with **Playwright** and
**TypeScript**, following the Page Object Model, component objects, and web-first-assertion
discipline. The reference application under test is
[saucedemo.com](https://www.saucedemo.com).

---

## Features

- **Page Object Model, done right** — each screen is a page object that exposes *actions
  and state*, never raw locators, and contains **no assertions** (tests own those).
- **Component objects** — reusable UI fragments (e.g. the header/cart badge) modeled once
  and composed into every page that uses them.
- **Deliberate locator strategy** — user-facing locators first (`getByRole`, `getByLabel`,
  `getByPlaceholder`, `getByText`), `getByTestId` (`data-test`) as a considered fallback.
- **Dependency injection** — page objects are injected into tests via Playwright fixtures.
- **Auth state reuse** — log in once in a setup project, save the session, and inject it so
  every test starts authenticated (login is tested only in the login specs).
- **Test data builders** — the Builder + Factory patterns (with `faker`) for maintainable,
  intention-revealing data.
- **Web-first assertions, enforced** — auto-waiting only; `page.waitForTimeout` is a lint
  error via `eslint-plugin-playwright`.
- **Tagging** — `@smoke`, `@regression` lanes.
- **Quality gates** — ESLint (flat config) + Prettier + type checking.
- **Reporting & CI** — Playwright HTML report, trace/screenshot/video on failure, and a
  GitHub Actions pipeline.

---

## Tech stack

Node 20 · TypeScript 6 · Playwright Test · @faker-js/faker · @axe-core/playwright ·
ESLint + typescript-eslint + eslint-plugin-playwright (flat config) · Prettier.

> **Note on TypeScript:** pinned to the 6.x line. TypeScript 7 (the native compiler) is not
> yet supported by typescript-eslint; bump when the linting toolchain certifies it.

---

## Prerequisites

- **Node.js 18+** (20 LTS recommended)
- **Playwright browsers** — installed via `npx playwright install chromium`

---

## Project structure

```
ui-test-framework/
├── .github/workflows/ci.yml
├── src/
│   ├── config/        # typed config, environments, user personas, auth-storage path
│   ├── pages/         # one Page Object per screen (+ BasePage)
│   ├── components/    # reusable UI fragments (HeaderComponent)
│   ├── fixtures/      # dependency injection for page objects
│   ├── builders/      # test-data builders (CheckoutInfoBuilder)
│   ├── models/        # typed data (User, CheckoutInfo)
│   └── utils/         # helpers (accessibility scan)
└── tests/
    ├── auth.setup.ts  # logs in once, saves storageState
    ├── auth/          # login happy + negative (run logged-out)
    ├── inventory/
    ├── cart/
    ├── checkout/
    ├── visual/        # @visual — pixel-diff snapshots
    └── a11y/          # @a11y — accessibility scans
```

---

## Getting started

```bash
git clone <your-repo-url>
cd ui-test-framework
npm ci
npx playwright install chromium
cp .env.example .env      # then set SAUCE_PASSWORD
npm test
```

---

## Configuration

- Per-environment settings live in `src/config/environments.ts` (`baseURL`, timeouts).
- The password is the one secret, supplied via environment variable (see `.env.example`):

  | Variable         | Description                    | Example         |
  | ---------------- | ------------------------------ | --------------- |
  | `TEST_ENV`       | Which environment block to use | `production`    |
  | `SAUCE_PASSWORD` | saucedemo password             | `secret_sauce`  |

- **User personas** are defined in `src/config/index.ts` (`standard`, `lockedOut`,
  `problem`, `performanceGlitch`) and accessed type-safely as `config.users.standard`.

The same code reads the password from a local `.env`, CI secrets, or Docker `-e` — no changes.

---

## Running tests

```bash
npm test                      # everything (tag-agnostic)
npm run test:smoke            # @smoke — fast critical path
npm run test:regression       # @regression — full functional suite
npm run test:headed           # visible browser
npm run test:ui               # Playwright interactive UI mode
```

The auth **setup project runs automatically** as a dependency of any selected subset, so
every run is authenticated without tagging the setup.

---

## Auth state reuse

`tests/auth.setup.ts` logs in once and saves the session to `.auth/standard.json` (gitignored).
The main project loads it via `storageState`, so tests start authenticated. Login specs
override this with `test.use({ storageState: { cookies: [], origins: [] } })` to run
logged-out. For multiple roles, add one setup + one state file per role, and point tests at
each with `test.use({ storageState })` or dedicated per-role projects.

---

## Reporting

```bash
npm run report   # open the Playwright HTML report
```

On failure, a **trace** (`npx playwright show-trace`), **screenshot**, and **video** are
retained automatically. Allure can be added exactly as in the API framework if trend history
is needed.

---

## Linting, formatting & type checking

```bash
npm run lint         # ESLint (incl. eslint-plugin-playwright web-first rules)
npm run lint:fix
npm run format       # Prettier (write)
npm run format:check
npm run typecheck    # tsc --noEmit
```

Rules of note: `test`/`expect` may not be imported from `@playwright/test` inside `tests/`
(use `@fixtures`), and `page.waitForTimeout` is forbidden.

---

## Visual regression & baselines

Baselines are **platform-specific** (filenames carry a `-chromium-linux` suffix). A baseline
generated on macOS/Windows will **not** match a Linux CI runner. Generate baselines in the
same environment CI uses (a Linux container or CI itself), commit them, and keep `@visual`
tests out of the main functional lane.

---

## Continuous integration

`.github/workflows/ci.yml` runs on every push/PR: **lint → typecheck → install browser →
test (excluding `@visual`)**, uploading the report and failure artifacts. Set `SAUCE_PASSWORD`
as a repository secret (Settings → Secrets and variables → Actions). Browsers are installed
with `npx playwright install --with-deps chromium`.

---

## Architecture overview

| Layer         | Responsibility                                                        |
| ------------- | --------------------------------------------------------------------- |
| `config`      | Typed, validated settings, environments, and user personas            |
| `pages`       | How to drive each screen — actions & state, no assertions             |
| `components`  | Reusable UI fragments shared across pages                             |
| `fixtures`    | Dependency injection of page objects; auth-state wiring               |
| `builders`    | Valid, overridable test data                                          |
| `utils`       | Cross-cutting helpers (a11y scan)                                     |
| `tests`       | Verification only — act and assert                                    |

**Key rules:** page objects expose actions/state and never assert; tests own all assertions;
locators are user-facing first; never manually wait (rely on auto-waiting + web-first
assertions).

---

## Adding a new page

The architecture is designed so a new screen touches only leaf files:

1. **Page object** — add `src/pages/x.page.ts` extending `BasePage`; export from
   `src/pages/index.ts`.
2. **Component** *(if it introduces reusable UI)* — add to `src/components/`.
3. **Fixture** — add one line in `src/fixtures/test.fixtures.ts` to inject `xPage`.
4. **Builder/model** *(if it needs data)* — add to `src/builders/` and `src/models/`.
5. **Tests** — add `tests/x/*.spec.ts`.

You do **not** modify `BasePage`, existing components, config, or the fixture infrastructure.

---

## Design patterns used

| Pattern                         | Where                                    | Problem it solves                              |
| ------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| Page Object Model               | `pages/`                                 | Encapsulate each screen; stop selector drift   |
| Component Object                | `components/`                            | Reuse shared UI without duplicating locators   |
| Locator strategy (role-first)   | all page objects                         | Resilience to markup/styling changes           |
| Web-first assertions            | all tests (lint-enforced)                | Eliminate flakiness; no manual waits           |
| Dependency Injection            | `fixtures/`                              | Tests receive ready page objects; no wiring    |
| Auth state reuse (storageState) | `auth.setup.ts` + fixtures               | Fast tests; login tested only where it belongs |
| Builder + Factory               | `builders/`                              | Maintainable, intention-revealing test data    |
| Single config source + personas | `config/`                                | Typed environments and test identities         |
| Barrel exports                  | `index.ts` files                         | Short, stable import paths                      |
| Tagging                         | `@smoke`/`@regression`/`@visual`/`@a11y` | Run the right subset for the right moment       |
