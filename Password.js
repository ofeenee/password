import isStrongPassword from 'validator/lib/isStrongPassword.js';
import {hash, verify} from 'argon2';


class Password {
  #password;

  constructor() {
    try {
      this.#password = null;
    }
    catch (error) {
      throw error;
    }
  }

  async set(password) {
    try {
      const valid = isStrongPassword(password);

      if (!valid) throw new Error('password value is invalid.');

      if (this.#password) {
        const match = await verify(this.#password, password);
        if (match) return this.#password;
      }

      this.#password = await hash(password);
      return this.#password;

    }
    catch (error) {
      throw error;
    }
  }

  get() {
    if (this.#password) return this.#password;
    else return null;
  }

  async compare(password) {
    try {
      if (!this.#password) return false;
      if (!password || typeof password !== 'string' || !isStrongPassword(password)) return false;

      const match = await verify(this.#password, password);
      return match;
    }
    catch (error) {
      throw error;
    }
  }

  static validate(password) {
    try {
      if (!password || typeof password !== 'string' || !isStrongPassword(password)) {
        return false;
      }
      else {
        return true;
      }
    }
    catch (error) {
      throw error;
    }
  }
  static isHash(string) {
    const regex = new RegExp(/^\$argon2i\$v=19\$m=4096,t=3,p=1\$[0-z+/]{22,22}\$[0-z/+]{43,43}$/);
    const test = regex.test(string);
    if (test) return true;
    else return false;
  }
}

export default Password;