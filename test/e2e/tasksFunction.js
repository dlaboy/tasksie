const { Builder, By, until } = require('selenium-webdriver');
const { default: createDriver } = require('./driver');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function taskTest(title,description) {
  // Create a new browser instance (Chrome)
//   const driver = await new Builder().forBrowser('chrome').build();
  const driver = await createDriver({headless:true});


  try {
    await driver.get('http://localhost:3000/login');

    await driver.findElement(By.id('register')).click();
    await driver.wait(until.elementLocated(By.id('name')), 10000);
    if (name !== ""){
        await driver.findElement(By.id('name')).sendKeys("Juan");
    }
    if (email !== ""){
        await driver.findElement(By.id('email')).sendKeys("Juanpablo@gmail.com");
    }
    if (password !== ""){
        await driver.findElement(By.id('password')).sendKeys("JP123");
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



    await driver.findElement(By.id('new_task')).click();
    await sleep(1000)
    // console.log("Arrived to new task page...")

    await driver.findElement(By.id('title')).sendKeys(title);
    
    await sleep(1000)
    // console.log("Entered title...")

    await driver.findElement(By.id('description')).sendKeys(description);
    await sleep(1000)
    // console.log("Entered description...")


    // Click login button
    await driver.findElement(By.css('button[type="submit"]')).click();
    await sleep(1000);
    // console.log("Created task...")


    // Delete task created
    await driver.findElement(By.id('delete_modal')).click();
    await sleep(1000)

    // await sleep(5000);
    // console.log("Am I sure I want to delete this task? Yes...")


    await driver.findElement(By.id('delete_button')).click();
    await sleep(1000)
    // await sleep(5000);
    // console.log("Task deleted")


    // console.log('✅ Login successful!');
  } catch (error) {
    throw error
  } finally {
    // Always close the browser
    await driver.quit();
  }
}

module.exports = taskTest;