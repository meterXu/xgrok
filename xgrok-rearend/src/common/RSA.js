import crypto from  'crypto'
import {Buffer} from 'safe-buffer'

function RSA () {
  let MAX_DECRYPT_BLOCK = 128
  let publicKey = ``
  let privateKey = `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJ6eh5FcvWF/uxPU
N//srkWYAAyFUFgtL4xOOr1E7eSvr9kMKL3+FjZV6rko0Rv6VmXjmSlOR4yx6w1o
OtU2Wlj8pyunceQwEreW5D2I0yEX8JqcLVwpof+rr674LUTzstlQNsTxi5nUi9mp
8utR44vCmscPDbuMNrD16OXOMnbdAgMBAAECgYBrfYrpWyuLcv/YBCye5kmDJ+qA
kadM2fIq5qivspJ0Mwq7z52cgx+SWs7iA2MRzqfWDFKyxzV9huR/BW85Jcg7DHyA
b9t4kDzOni03psBMz9xuZi+ldi92t6J1m5teAbxVtqWQ3UWMK0bxZDS0hyhViHnQ
FfPFXWR7H2I0lRPhgQJBAMsBlVIWLMlsuHFLnsQigUThzR1VgYW5HVdA0r7t008f
xyrTn7fmxZBi+myK6GOPTy1/2fSAFnV85KH2W8Fgr4kCQQDIBqyasNEWhJ3x8ydh
VpzrGVOgApp8UNeXLQC17v1EyG10+864/vM0KdBCAW1ogJIqK96mAHjKNmrYK7KE
2cO1AkA44kyxH72VA337YTEvzGtkndEX8ynECscJ+AQVtBaOCV2JxprusR+TAeki
GRpdK38IRNcSCAJDEagPKjUzzp/hAkAnVeirown7O6kz43VjFv1U3m4rkVeACwXa
nOb+4Di+RgwAbWSBzOFW6MIjuNQjMOWNlYL7cixO19S7HhzFM23hAkEAtC0mbgcF
ycNz5ziP+p0bsExvGIkt+O/IhbG+uA8MtleA4jQy8baCcCDZNVwVIsVZO14rjGSk
PWSibni50c6ORA==
-----END PRIVATE KEY-----`
  this.encrypt=function(data) {
    let buf = new Buffer(data, "utf-8");
    let inputLen = buf.byteLength;
    let bufs = [];
    let offSet = 0;
    let endOffSet = MAX_ENCRYPT_BLOCK;
    while (inputLen - offSet > 0) {
      if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
        let bufTmp = buf.slice(offSet, endOffSet);
        bufs.push(crypto.publicEncrypt({key: publicKey, padding: crypto.RSA_PKCS1_PADDING}, bufTmp));
      } else {
        let bufTmp = buf.slice(offSet, inputLen);
        bufs.push(crypto.publicEncrypt({key: publicKey, padding: crypto.RSA_PKCS1_PADDING}, bufTmp));
      }
      offSet += MAX_ENCRYPT_BLOCK;
      endOffSet += MAX_ENCRYPT_BLOCK;
    }
    let result = Buffer.concat(bufs);
    let base64Str = result.toString("base64");
    console.log(base64Str);
    return base64Str;
  };
  this.decrypt = function (data) {
    let buf = new Buffer(data, 'base64')
    let inputLen = buf.byteLength
    let bufs = []
    let offSet = 0
    let endOffSet = MAX_DECRYPT_BLOCK
    while (inputLen - offSet > 0) {
      if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
        let bufTmp = buf.slice(offSet, endOffSet)
        bufs.push(crypto.privateDecrypt({key: privateKey, padding: crypto.RSA_PKCS1_PADDING}, bufTmp))
      } else {
        let bufTmp = buf.slice(offSet, inputLen)
        bufs.push(crypto.privateDecrypt({key: privateKey, padding: crypto.RSA_PKCS1_PADDING}, bufTmp))
      }
      offSet += MAX_DECRYPT_BLOCK
      endOffSet += MAX_DECRYPT_BLOCK
    }
    let result = Buffer.concat(bufs).toString()
    console.log(result)
    return result
  }
}
export default new RSA()
