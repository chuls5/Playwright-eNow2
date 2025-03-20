# Playwright eNow2 Test Automation

This repository contains automated end-to-end tests for the eNow2 application using Playwright. These tests are designed to ensure the application functions correctly across different browsers and scenarios.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- npm (comes with Node.js)

### Installation

1. Clone this repository:
   ```bash
   git clone [repository-url]
   cd playwright-eNow2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file to include your specific configuration values.

### Installing Browsers

Playwright tests run on Chromium, Firefox, and WebKit. Install the browsers:

```bash
npx playwright install
```

## 🧪 Running Tests

### Run all tests

```bash
npx playwright test
```

### Run tests in a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run a single test file

```bash
npx playwright test tests/example.spec.js
```

### Run tests in UI mode

```bash
npx playwright test --ui
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

### View test report

```bash
npx playwright show-report
```

## 📁 Project Structure

```
playwright-eNow2/
├── .github/workflows/       # CI/CD workflows
├── playwright/              # Playwright artifacts (auth states, etc.)
├── playwright-report/       # Generated test reports
├── test-results/            # Screenshots, videos, and logs
├── tests/                   # Test files
├── tests-examples/          # Example test files
├── .env                     # Environment variables (gitignored)
├── .env.example             # Example environment file
├── playwright.config.js     # Playwright configuration
└── package.json             # Project dependencies and scripts
```

## 🔧 Configuration

The project uses `playwright.config.js` to configure test execution. Key configuration options include:

- Browsers to test (Chromium, Firefox, WebKit)
- Viewport sizes
- Test timeouts
- Screenshot and video capture settings
- Parallel execution options

## 🔒 Authentication

Authentication states are stored in the `playwright/.auth` directory. These can be used to skip login steps in tests that require authentication.

Example of using authentication in tests:

```javascript
test.use({ storageState: 'playwright/.auth/user.json' });

test('test with authenticated user', async ({ page }) => {
  // Test starts with user already logged in
});
```

## 🔄 Continuous Integration

This project is configured to run tests in CI using GitHub Actions. The workflow configuration is located in `.github/workflows/`.

## 📝 Writing Tests

Tests are written using Playwright's test framework. Here's a basic example:

```javascript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
  await expect(page.locator('h1')).toContainText('Example Domain');
});
```

### Best Practices

1. Use page objects to encapsulate page-specific selectors and actions
2. Organize tests by feature or page
3. Make tests independent from each other
4. Use descriptive test names
5. Avoid hardcoded timeouts with `waitFor` functions instead
6. Use test data helpers for generating test data

## 📚 Further Reading

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

## 📄 License

[Add your license information here]

## 👥 Contributing

[Add your contribution guidelines here]
