import { IEncrypter } from "../../application/abstracts/encrypter_interface";
import bcrypt from "bcrypt";

export class Encrypter implements IEncrypter {
  //Encrypter
  async encrypt(value: string): Promise<string> {
    //
    try {
      const encrypted = await bcrypt.hash(value, 10);

      return encrypted;
    } catch (err) {
      //Logger
      console.log("Encrypter encyption error ", err.message);

      throw err.message;
    }
  }

  //Compare 2 values
  async compare(value1: string, value2: string): Promise<boolean> {
    //Return
    try {
      const result = bcrypt.compare(value1, value2);

      return result;
    } catch (err) {
      //Logger
      console.log("Encrypter Compare Error ", err.message);

      throw err.message;
    }
  }
}
