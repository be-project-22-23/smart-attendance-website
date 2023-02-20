import CryptoJS from "crypto-js";

const secretPass = "XkhZG4fW2t2W";

export function encrypt(text: String) {
  const data = CryptoJS.AES.encrypt(
    JSON.stringify(text),
    secretPass
  ).toString();

  return data;
}

export function decrypt(text: string | CryptoJS.lib.CipherParams) {
  const bytes = CryptoJS.AES.decrypt(text, secretPass);
  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return data;
}
