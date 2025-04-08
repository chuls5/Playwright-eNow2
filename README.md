# 🎭 Playwright eNow2 Test Automation

![Tests Status](https://img.shields.io/badge/tests-passing-brightgreen)
![Playwright](https://img.shields.io/badge/playwright-v1.40+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 About
Automated test framework using Playwright for testing the eNow2 application. This repository contains end-to-end tests designed to validate application functionality across different browsers and user scenarios, ensuring the application works correctly in various environments.

## 🧪 Test Structure
Tests are organized to cover core application functionality and follow best practices for maintainability and reliability. The framework employs Page Object Model patterns and leverages Playwright's powerful testing capabilities.

## 🤖 Automation
The test suite includes tests for authentication flows, user interface elements, and core application features. Tests mimic real user behavior and validate expected outcomes across different browsers (Chromium, Firefox, and WebKit).

## ✅ Practices
The framework follows Playwright's best practices, including:
- 📚 Page Object Model for improved test maintenance
- 🔑 Authentication state storage to optimize test performance
- ⚙️ Environment configuration through dotenv
- 🌐 Cross-browser testing capabilities
- 🖼️ Visual comparison testing when needed
- 📊 Detailed reporting for test results analysis

## 🏁 Getting Started

### 📋 Prerequisites
- [Node.js](https://nodejs.org/) (v14 or newer)
- npm (comes with Node.js)

### 💻 Installation
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

### 🌐 Installing Browsers
Install the browsers needed for testing:
```bash
npx playwright install
```

## ▶️ Running Tests

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
├── node_modules/            # Project dependencies
├── playwright/              # Playwright artifacts (auth states, etc.)
├── playwright-report/       # Generated test reports
├── test-results/            # Screenshots, videos, and logs
├── tests/                   # Test files
├── tests-examples/          # Example test files
├── .env                     # Environment variables (gitignored)
├── .env.example             # Example environment file
├── playwright.config.js     # Playwright configuration
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

## ⚙️ Configuration
The project uses `playwright.config.js` to configure test execution. Key configuration options include:
- 🌐 Browsers to test (Chromium, Firefox, WebKit)
- 📱 Viewport sizes
- ⏱️ Test timeouts
- 📸 Screenshot and video capture settings
- ⚡ Parallel execution options

## 🔐 Authentication
Authentication states are stored in the `playwright/.auth` directory. These can be used to skip login steps in tests that require authentication.

Example of using authentication in tests:
```javascript
test.use({ storageState: 'playwright/.auth/user.json' });
test('test with authenticated user', async ({ page }) => {
  // Test starts with user already logged in
});
```

## 🔄 CI Pipeline
This project is configured to run tests in CI using GitHub Actions. The workflow configuration is located in `.github/workflows/`.

## 📊 Viewing Test Reports
After running tests, HTML reports are generated that show detailed test results:

1. Run tests with the report option:
   ```bash
   npx playwright test
   ```

2. View the generated report:
   ```bash
   npx playwright show-report
   ```

This will open a browser with detailed test results, including screenshots and traces for failed tests.

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

### 💡 Best Practices
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

## 👥 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
