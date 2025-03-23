import taskTest from './tasksFunction';
import registerTest from './registerFunction';


describe('Tasks E2E Test', () => {
  it('Registering User to use for tasks', async () => {
    await registerTest('Juan', 'Juanpablo@gmail.com', 'JP123');
  }, 100000);
});
describe('Tasks E2E Test', () => {
  it('Edge Case: Missing Title', async () => {
    await taskTest("",'Task');
  },20000);
});

describe('Tasks E2E Test', () => {
  it('Edge Case: Missing Description', async () => {
    await taskTest('Title','');
  },20000);
});

describe('Tasks E2E Test', () => {
  it('Edge Case: Empty Content', async () => {
    await taskTest('','');
  },20000);
});

describe('Tasks E2E Test', () => {
  it('Create Task Succesfully', async () => {
    await taskTest('Selenium Tasks','Task');
  },20000);
});


// taskTest('','Task');
// loginTest('perezjanet6858@yahoo.com','Janet');
