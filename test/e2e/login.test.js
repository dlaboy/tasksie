const { Builder, By, until } = require('selenium-webdriver');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { default: createDriver } = require('./driver');



async function loginTest(email,password) {
  // Create a new browser instance (Chrome)
  const driver = await createDriver({headless:false});


  try {
    // Navigate to login page
    await driver.get('http://localhost:3000/login'); // 🔁 Replace with your login page URL

    // Wait until the email input is present
    await driver.wait(until.elementLocated(By.id('email')), 5000);

    // Fill in credentials
    await driver.findElement(By.id('email')).sendKeys(email);
    await sleep(1000)
    await driver.findElement(By.id('password')).sendKeys(password);
    await sleep(1000)


    // Click login button
    await driver.findElement(By.css('button[type="submit"]')).click();
    await sleep(1000)


    // Wait for dashboard or expected redirect
    await driver.wait(until.urlContains('/dashboard'), 5000); // Adjust to match your app
    await sleep(1000)


    console.log('✅ Login successful!');
  } catch (error) {
    console.error('❌ Login failed:', error);
  } finally {
    // Always close the browser
    await driver.quit();
  }
}

loginTest('laboy.swe@gmail.com','Diego');
// loginTest('perezjanet6858@yahoo.com','Janet');
