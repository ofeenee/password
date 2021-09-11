import { assert } from 'chai';


import Password from '../Password.js';
import validator from 'validator';

const validPassword = 'Pa55W0rd!';
const invalidPassword = 'password';
const passwordToTest = process.env.password;


describe('Password.validate():', function () {
    const password = Password();

  it(`validate(${validPassword}) to return true`, function () {
    assert.isTrue(password.validate(validPassword));
  });
  it(`validate(${invalidPassword}) to return false`, function () {
    assert.isFalse(password.validate(invalidPassword));
  });
});

describe(`new Password()`, function () {
  const password = new Password();
  it(`successful instance of the class Password()`, function () {
    assert.instanceOf(password, Password);
  });

  it(`getPassword() should return null`, function () {
    const currentPassword = password.getPassword();
    assert.isNull(currentPassword);
    assert.isDefined(currentPassword);
  });

  it(`setPassword(${validPassword}) to password instance (successfully)`, async function() {
    try {
      const hash = await password.setPassword(validPassword);
      assert.isDefined(hash);
      assert.isString(hash);
      assert.notEqual(hash, validPassword);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`setPassword(${invalidPassword}) to password instance (throws error)`, async function() {
    try {
      const hash = await password.setPassword(invalidPassword);
      assert.fail(`${invalidPassword} is supposed to throw an error, but it did not.`);

    } catch (error) {
      const match = await password.compare(invalidPassword);
      console.log(match);
      assert.isFalse(match);

      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, 'password value is invalid.');
    }
  });
  it(`getPassword() value of password instance return the hash of ${validPassword}`, async function() {
    try {
      const hash = password.getPassword();
      assert.isDefined(hash);

      const match = await password.compare(validPassword);
      assert.isTrue(match);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

if (passwordToTest) {
  describe(`Testing passed password: ${passwordToTest}`, function() {
    const isValid = validator.isStrongPassword(passwordToTest);
    const password = Password();
    it(`Instantiate a successful instance of the class password`, function() {
      assert.instanceOf(password, Password);
    });

    it(`getPassword() should return null`, function() {
      assert.isNull(password.getPassword());
    });

    if(isValid) {
      it(`setPassword(${passwordToTest}) to password instance (valid: successfully)`, async function() {
        try {
          const hash = await password.setPassword(passwordToTest);
          assert.isString(hash);
          assert.notEqual(hash, passwordToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`getPassword() should return hash value of ${passwordToTest}`, async function() {
        try {
          assert.isTrue(await password.compare(passwordToTest));
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`setPassword('Kuwait123!) to update current password (successfully)`, async function(){
        try {
          const hash = await password.setPassword('Kuwait123!');
          assert.isString(hash);
          assert.notEqual(hash, 'Kuwait123!');

          // confirm password has been changed successfully
          const match = await password.compare(passwordToTest);
          assert.isFalse(match);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`setPassword('kuwait123) to update current password (throws error)`, async function() {
        try {
          const hash = await password.setPassword('kuwait123');
          assert.isUndefined(hash);
          assert.fail('set password should have thrown an error, but it did not');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'password value is invalid.');

          const hash = password.getPassword();
          assert.isString(hash);

          const match = await password.compare('kuwait123');
          assert.isFalse(match);
        }
      });

      it(`get() should return hash value of Kuwait123!`, async function() {
        try {
          const hash = password.getPassword();
          assert.isString(hash);

          const match = await password.compare('Kuwait123!');
          assert.isTrue(match);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
    }
    else {
      it(`set(${passwordToTest}) to password instance (invalid: throw error)`, async function() {
        try {
          const hash = await password.setPassword(passwordToTest);
          assert.isUndefined(hash);
          assert.fail('set password should have thrown an error, but it did not');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'password value is invalid.');
        }
      });

      it(`get() should return null (password was not set)`, function () {
        assert.isNull(password.getPassword());
      });
    }

  });
}