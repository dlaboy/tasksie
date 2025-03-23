
import registerTest from './registerFunction';
import loginTest from './loginFunction';

describe('Login E2E Test', () => {
  it('Edge Case: Empty Credentials', async () => {
    await loginTest('', '');
  },100000);
});
describe('Login E2E Test', () => {
  it('Edge Case: Invalid Email Syntax', async () => {
    await loginTest('randomgmail.com', 'pass');
  },100000);
});
describe('Login E2E Test', () => {
  it('Edge Case: User Not Registered', async () => {
    await loginTest('random@gmail.com', 'pass');
  },100000);
});
describe('Login E2E Test', () => {
  it('Edge Case: Missing password', async () => {
    await loginTest('laboy.swe@gmail.com', '');
  },100000);
});
describe('Login E2E Test', () => {
  it('Register User to Successfully Login', async () => {
    await registerTest('Caito','caito@gmail.com','Pass');
  },100000);
});
// describe('Login E2E Test', () => {
//   it('Login User Successfully', async () => {
//     await loginTest('caito@gmail.com', 'Pass');
//   },100000);
// });
// loginTest('perezjanet6858@yahoo.com','Janet');
