import QRCode from "qrcode"
import path from 'path';
import { __dirname,__filename } from "./dotevUtils.js";

const generateQR = async (url, fileName) => {
  try {
    const filePath = path.join(__dirname, '..', '..', 'public', 'qr', fileName);
    await QRCode.toFile(filePath, url, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return `/qr/${fileName}.png`; // Return the public URL path
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default generateQR;





