import { IEncrypter } from "../../application/abstracts/encrypter_interface";
import bcrypt from "bcrypt";

export class Encrypter implements IEncrypter {
  encrypt = (value: string): Promise<string> => {
    return new Promise((reject, resolve) => {
      bcrypt.hash(value, 10, (err : Error, hashed : string) => {
        if (err) {
          throw err;
        } else {
          resolve(hashed);
        }
      })
    });
  };

  compare = (value1: string, value2: string): Promise<boolean> => {
    return new Promise((reject, resolve) => {
      bcrypt.compare(value1, value2, (err : Error, res : boolean) => {
        if (err) {
          throw err;
        } else {
          resolve(res);
        }
      })
    });
  };
}
