const { Builder, By, until } = require('selenium-webdriver');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { default: createDriver } = require('./driver');



async function registerTest(name,email,password) {
  // Create a new browser instance (Chrome)
  const driver = await createDriver({headless:false});


  try {
    // Navigate to login page
    await driver.get('http://localhost:3000/login'); // 🔁 Replace with your login page URL
    await sleep(5000)

    // Click login button
    await driver.findElement(By.id('register')).click();
    await sleep(1000)

    // Wait until the email input is present
    await driver.wait(until.elementLocated(By.id('name')), 5000);

    // Fill in credentials
    await driver.findElement(By.id('name')).sendKeys(name);
    await sleep(1000)
    await driver.findElement(By.id('email')).sendKeys(email);
    await sleep(1000)
    await driver.findElement(By.id('password')).sendKeys(password);
    await sleep(5000)


    // Click login button
    await driver.findElement(By.css('button[type="submit"]')).click();
    await sleep(1000)


    // Wait for dashboard or expected redirect
    await driver.wait(until.urlContains('/login?from=%2Fdashboard'), 5000); // Adjust to match your app
    await sleep(5000)

    await driver.wait(until.elementLocated(By.id('email')), 5000);


    await driver.findElement(By.id('email')).sendKeys(email);
    await sleep(1000)
    await driver.findElement(By.id('password')).sendKeys(password);
    await sleep(5000)

    await driver.findElement(By.css('button[type="submit"]')).click();
    await sleep(1000)

    await driver.wait(until.urlContains('/dashboard'), 5000); // Adjust to match your app
    await sleep(5000)


    console.log('✅ Login successful!');
  } catch (error) {
    console.error('❌ Login failed:', error);
  } finally {
    // Always close the browser
    await driver.quit();
  }
}

registerTest('Janet','perezjanet6858@yahoo.com','Janet123');
// registerTest('Diego','laboy.swe@gmail.com','Diego');
