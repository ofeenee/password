import isStrongPassword from 'validator/lib/isStrongPassword.js';

import bcrypt from 'bcrypt';
const { hashSync, hash, verify } = bcrypt;



class Password {
  #password;

  constructor(password) {
    try {
      if (isStrongPassword(password)) {
        this.#password = hashSync(password);
      }
      else {
        throw new Error('Password value is invalid.');
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }

  static validate(password) {
    try {
      if (!password || typeof password !== 'string' || !isStrongPassword(password)) {
        throw new Error('Password value is invalid.');
      }
      else {
        return true;
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }

  async update(password) {
    try {
      const match = await verify(this.#password, password);
      if (isStrongPassword(password) && !match) {
        this.#password = await hash(password);
      }
      else if (match) {
        throw new Error('update is not necessary.');
      }
      else {
        throw new Error('password value is invalid.');
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }

  get() {
    return this.#password;
  }
}

export default Password;