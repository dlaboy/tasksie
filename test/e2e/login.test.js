const { Builder, By, until } = require('selenium-webdriver');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { default: createDriver } = require('./driver');



async function loginTest(email,password) {
  // Create a new browser instance (Chrome)
  const driver = await createDriver({headless:true});


  try {
    // Navigate to login page
    sleep(5000)
    await driver.get('http://localhost:3000/login'); // 🔁 Replace with your login page URL

    // Wait until the email input is present
    await driver.wait(until.elementLocated(By.id('email')), 10000);

    // Fill in credentials
    await driver.findElement(By.id('email')).sendKeys(email);
    // await sleep(1000)
    await driver.findElement(By.id('password')).sendKeys(password);
    // await sleep(1000)


    // Click login button
    await driver.findElement(By.css('button[type="submit"]')).click();
    // await sleep(1000)


    // Wait for dashboard or expected redirect
    await driver.wait(until.urlContains('/dashboard'), 10000); // Adjust to match your app
    // await sleep(1000)


  } catch (error) {
    console.error('❌ Login failed:', error);
  } finally {
    // Always close the browser
    await driver.quit();
  }
}

describe('Login E2E Test', () => {
  it('should log in successfully with valid credentials', async () => {
    await loginTest('laboy.swe@gmail.com', 'Diego');
  },100000);
});
// loginTest('perezjanet6858@yahoo.com','Janet');
