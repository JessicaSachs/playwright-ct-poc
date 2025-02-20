# Playwright Component Testing POC

This repository demonstrates a lightweight approach to component testing using Playwright, without requiring the full component testing infrastructure. Starting a Vite dev server (though this would work with any bundler that can import modules) and using `page.evaluate` with a single mount function is enough to get started.

## Concept

Traditional component testing often requires complex setup and infrastructure. This proof of concept shows how you can achieve similar results with a simpler approach using a normal website as an automatable playground:

1. A global `mount` function is added to a page that Playwright will navigate to
2. Playwright tests use `page.evaluate()` to dynamically import components in the window context
3. Once the module is returned, the module can be interacted with as normal

## Key Points

1. BYO framework - No integration with a component library is required.
2. BYO server - No special build step is required.
3. BYO bundler - No dependency on a bundler is required.
4. BYO mounting library - import what you want (React Testing Library, Vue Test Utils, Enzyme, `document.createElement`, whatever)
5. Mix Browser-side and Playwright-side stuff if you _really_ want to 🤷🏼‍♀️ but be wary of context boundaries.

## How does this work?

1. Dynamic imports are now natively supported in the browser, and if the user chooses to start a Vite dev server, the component will be transpiled on-demand.
2. However, any method that returns the exports of a module can be used - including webpack dynamic imports.

## Harness Requirements

1. The HTML page must contain a `test-container` element that can be used to mount components.
2. There must be a way to load user code into the page and either
    1. Return the exports of the module
    2. Register the module in a global, accessible namespace
3. The test must be able to wait for the module to be ready.
4. Once the module is ready, the test must have the opportunity to call the module's functions.

## Mounting Function

Once the module is ready and the user is in the browser scope, there are a few options to render the component.

1. Directly mutate the `test-container` DOM element.
2. Use a `mount` function that is provided by the harness (like this example).
3. Dynamically import a `mount` function from their favorite testing library.

### Mounting Function API

Because `page.evaluate` is a strict boundary, your mounting function will feel a little chunky and hard to abstract.

You can think of it as your "Browser Setup" time, and then once the DOM is done, you should be automating the browser state as if it were a normal Playwright E2E test.

If you _need_ to share state between `page.evaluate` calls, the harness will need to keep browser-side state on what modules were loaded or what the result of `mount` is. (This is where custom mounting functions come in handy.)

## Oh cool, what are some limitations?

1. **Context Boundary**: `page.evaluate` is executed in the browser and cannot share non-serializable values back to the spec scope. This makes abstractions and code reuse little awkward.

## Demo

Here's the component test in action, showing the Counter component being tested:

![Counter Component Test Demo](./demo.png)

## Prerequisites

- Node.js (LTS version recommended)
- pnpm

## Installation

```bash
  pnpm install
```

## Project Structure

```
├── src/
│   ├── counter.js     # Exported Counter Component
│   └── style.css      # Component styles
├── tests/
│   └── component.spec.js  # Playwright test specifications
└── index.html         # Test container HTML with `mount` function
```

## Running Tests

Start the development server and run tests:

```bash
  # Run tests in headless mode
  pnpm test

  # Run tests with UI mode
  pnpm test:ui
```

## Development

Start the development server:

```bash
  pnpm dev
```

## Configuration

The setup uses standard Playwright configuration with a web server integration:

```javascript
  webServer: {
    command: 'pnpm dev', // Vite (or any other web server that knows how to request that your code finds its way onto the page)
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  }
```

This ensures the development server is running during tests.
