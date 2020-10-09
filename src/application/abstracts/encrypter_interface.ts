export interface IEncrypter {
  //Encrypt value
  encrypt: (value: string) => Promise<string>;

    //compare values
    compare: (value1: string, value2: string) =>Promise<boolean>;
}
