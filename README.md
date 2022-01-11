# Selenium 4 performance review

Relating to https://github.com/SeleniumHQ/docker-selenium/issues/1444

## Requirements

1. NodeJS v17 or later (current stable)
1. Selenium 3.X running on port 5444
1. Selenium 4.X running on port 4444
1. Firefox and Chrome with their appropriate drivers (chromedriver, geckodriver)

## Configuration
By default, 50 iterations of both Firefox, and Chrome, against both versions of Selenium are run.

You can create a `.env` file to configure the number of iterations and the browser set to test against using the settings:

```
ITERATIONS=5
BROWSERS="chrome"
```

See the `.env.defaults` file for defaults values.


## Instructions

1. Install dependencies:
```
npm ci
```
1. Run tests
node index.js
