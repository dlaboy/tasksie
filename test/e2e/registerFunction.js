const { By, until } = require('selenium-webdriver');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { default: createDriver } = require('./driver');

async function registerTest(name, email, password) {
  const driver = await createDriver({ headless: true });

  try {
    await driver.get('http://localhost:3000/login');

    await driver.findElement(By.id('register')).click();
    await driver.wait(until.elementLocated(By.id('name')), 10000);
    if (name !== ""){
        await driver.findElement(By.id('name')).sendKeys(name);
    }
    if (email !== ""){
        await driver.findElement(By.id('email')).sendKeys(email);
    }
    if (password !== ""){
        await driver.findElement(By.id('password')).sendKeys(password);
    }

    await driver.findElement(By.css('button[type="submit"]')).click();
    await sleep(5000)


    await driver.wait(until.urlContains('/login?from=%2Fdashboard'), 10000);

// Wait until the email input is present
    await driver.wait(until.elementLocated(By.id('email')), 10000);


    // Fill in credentials
    if (email !== ""){
        await driver.findElement(By.id('email')).sendKeys(email);
        await sleep(1000)
        
    }
    if (password !== ""){
        await driver.findElement(By.id('password')).sendKeys(password);
        await sleep(1000)

    }
    // await sleep(1000)
    // await sleep(1000)

    // Click login button
    await driver.findElement(By.css('button[type="submit"]')).click();
    await sleep(5000)


    // Wait for dashboard or expected redirect
    await driver.wait(until.urlContains('/dashboard'), 10000); // Adjust to match your app
    // await sleep(1000)

  } catch (error) {
    // console.error('❌ Register failed:', error);
    throw error;
  } finally {
    await driver.quit();
  }
}

module.exports = registerTest;
