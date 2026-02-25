import { createHash } from 'crypto';
import {
  LiqPayData,
  LiqPayPaymentData,
  LiqPayPaymentResponse,
  LiqPayRequestData,
} from '../interfaces';

export class LiqPay {
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor(publicKey: string, privateKey: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  getEncodedData(liqPayData: LiqPayData | LiqPayPaymentData) {
    const data: LiqPayRequestData | LiqPayPaymentData = {
      ...liqPayData,
      public_key: this.publicKey,
    };
    const dataString = JSON.stringify(data);
    return Buffer.from(dataString).toString('base64');
  }

  getDecodedData(paymentData: string): LiqPayPaymentData {
    const dataString = Buffer.from(paymentData, 'base64').toString('utf-8');
    return JSON.parse(dataString);
  }

  createSignature(encodedData: string) {
    const signatureString = `${this.privateKey}${encodedData}${this.privateKey}`;
    return createHash('sha3-256').update(signatureString).digest('base64');
  }

  getCredentials(liqPayData: LiqPayData) {
    const encoded = this.getEncodedData(liqPayData);
    const signature = this.createSignature(encoded);
    return { data: encoded, signature };
  }

  getFormButton(buttonText: string, liqPayData: LiqPayData) {
    const { data, signature } = this.getCredentials(liqPayData);
    return `<form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8"> 
              <input type="hidden" name="data" value="${data}" /> 
              <input type="hidden" name="signature" value="${signature}" /> 
              <script type="text/javascript" src="https://static.liqpay.ua/libjs/sdk_button.js"></script> 
              <sdk-button label="${buttonText}" background="#77CC5D" onClick="submit()"></sdk-button> 
            </form>`;
  }

  getCheckoutUrl(liqPayData: LiqPayData) {
    const { data, signature } = this.getCredentials(liqPayData);
    return `https://www.liqpay.ua/api/3/checkout?data=${data}&signature=${signature}`;
  }

  isValidSignature(paymentResponse: LiqPayPaymentResponse) {
    const signature = this.createSignature(paymentResponse.data);
    return signature === paymentResponse.signature;
  }
}
