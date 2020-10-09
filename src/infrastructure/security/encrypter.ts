import { IEncrypter } from "../../application/abstracts/encrypter_interface";

export class Encrypter implements IEncrypter {
  encrypt: (value: string) => Promise<string>;
  compare: (value1: string, value2: string) => Promise<boolean>;
}
