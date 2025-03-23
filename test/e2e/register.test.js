import registerTest from './registerFunction';

describe('Tasks E2E Test', () => {
  it('Edge Case: Missing Password', async () => {
    await registerTest('Diego', 'webdevdiego58@gmail.com', '');
  }, 100000);
});
describe('Tasks E2E Test', () => {

  it('Edge Case: Missing Email', async () => {
    await registerTest('Diego', '', 'Diego123');
  }, 100000);


});
describe('Tasks E2E Test', () => {

  it('Edge Case: Email Invalid', async () => {
    await registerTest('Diego', 'webdevdiego58gmail.com', 'Diego123');
  }, 100000);


});
describe('Tasks E2E Test', () => {

  it('New User Registered Successfully', async () => {
    await registerTest('Diego', 'webdevdiego58@gmail.com', 'Diego123');
  }, 100000);
});
