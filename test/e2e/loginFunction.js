const { By, until } = require('selenium-webdriver');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { default: createDriver } = require('./driver');

async function loginTest(email,password) {
    // Create a new browser instance (Chrome)
    const driver = await createDriver({headless:true});
  
    try {
      // Navigate to login page
      await driver.get('http://localhost:3000/login'); // 🔁 Replace with your login page URL
  
      // VALID CREDENTIALS (USER IS REGISTERED)
    
      // Wait until the email input is present
      await driver.wait(until.elementLocated(By.id('email')), 10000);
      await sleep(1000)

  
    
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
      
    //   console.error('❌ Login failed:', error);
      throw error;
    } finally {
      // Always close the browser
      await driver.quit();
    }
  }

  module.exports = loginTest;
