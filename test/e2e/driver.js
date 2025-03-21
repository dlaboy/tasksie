// driverFactory.js
import { Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

async function createDriver({ headless = true } = {}) {
  const options = new Options();

  if (headless) {
    options.addArguments('--headless');
  }

  options.addArguments('--window-size=1920,1080');
  options.addArguments('--disable-gpu'); // optional for Windows
  options.addArguments('--no-sandbox');  // optional for CI

  return await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

export default createDriver;
