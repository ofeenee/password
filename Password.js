import validator from 'validator';
const {isStrongPassword} = validator;

import {hash as argon2Hash, verify as argon2Verify} from 'argon2';


function Password() {
  try {
    if (new.target === undefined) return new Password();
    let hash = null;

    async function comparePassword(string) {
      try {
        if (validatePassword(string)) {
          const match = await argon2Verify(hash, string);
          return match;
        }
        else return false
      }
      catch (error) {
        throw error;
      }
    }

    return Object.defineProperties(this, {
      validate: {
        value: validatePassword,
        enumerable: true
      },
      setPassword: {
        value: async function createHash(string) {
          try {
            // if string value is invalid (not strong password)
            if (!validatePassword(string) && !isHash(string)) throw new Error('password value is invalid.');

            // if value is the same as current
            if (hash && isHash(hash)) {
              if (string === hash || await comparePassword(string)) return hash;
            }

            // assign string as is to hash,
            // or hash plain string then assign it to hash
            if (isHash(string)) {
              hash = string;
              return hash;
            }
            else {
              hash = await argon2Hash(string);
              return hash;
            }
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      getPassword: {
        value: function getHash() {
          try {
            if (isHash(hash)) return hash;
            else return null;
          } catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      compare: {
        value: comparePassword,
        enumerable: true
      },
    });
  }
  catch (error) {
    throw error;
  }
}

export default Password;



// HELPER FUNCTIONS
function validatePassword(string) {
  try {
    if (typeof string !== 'string' || !string) throw new Error('value is invalid.');
    return isStrongPassword(string);
  }
  catch (error) {
    throw error;
  }
}

function isHash(string) {
  const regex = new RegExp(/^\$argon2i\$v=19\$m=4096,t=3,p=1\$[0-z+/]{22,22}\$[0-z/+]{43,43}$/);
  const test = regex.test(string);
  if (test) return true;
  else return false;
}
