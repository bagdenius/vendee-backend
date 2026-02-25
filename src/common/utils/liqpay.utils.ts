import axios from 'axios';
import { createHash } from 'crypto';
import {
  LiqPayPaymentData,
  LiqPayPaymentResponse,
  LiqPayRequest,
  LiqPayRequestData,
} from '../interfaces';

const hostUrl = 'https://www.liqpay.ua';
const apiUrl = `${hostUrl}/api`;
const apiRequestUrl = `${apiUrl}/request`;
const apiUrlV3 = `${apiUrl}/3`;
const checkoutUrl = `${apiUrlV3}/checkout`;

export class LiqPay {
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor(publicKey: string, privateKey: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  encodeData(liqPayData: LiqPayRequestData) {
    const requestData: LiqPayRequest = {
      ...liqPayData,
      public_key: this.publicKey,
    };
    const requestDataString = JSON.stringify(requestData);
    return Buffer.from(requestDataString).toString('base64');
  }

  decodeData(encodedData: string): LiqPayPaymentData {
    const decodedDataString = Buffer.from(encodedData, 'base64').toString(
      'utf-8',
    );
    return JSON.parse(decodedDataString);
  }

  createSignature(encodedData: string) {
    const signatureString = `${this.privateKey}${encodedData}${this.privateKey}`;
    return createHash('sha3-256').update(signatureString).digest('base64');
  }

  isValidSignature(paymentResponse: LiqPayPaymentResponse) {
    const signature = this.createSignature(paymentResponse.data);
    return signature === paymentResponse.signature;
  }

  getCredentials(liqPayData: LiqPayRequestData) {
    const encoded = this.encodeData(liqPayData);
    const signature = this.createSignature(encoded);
    return { data: encoded, signature };
  }

  getCheckoutButton(buttonText: string, liqPayData: LiqPayRequestData) {
    const { data, signature } = this.getCredentials(liqPayData);
    return `<form method="POST" action="${checkoutUrl}" accept-charset="utf-8"> 
              <input type="hidden" name="data" value="${data}" /> 
              <input type="hidden" name="signature" value="${signature}" /> 
              <script type="text/javascript" src="https://static.liqpay.ua/libjs/sdk_button.js"></script> 
              <sdk-button label="${buttonText}" background="#77CC5D" onClick="submit()"></sdk-button> 
            </form>`;
  }

  getCheckoutUrl(liqPayData: LiqPayRequestData) {
    const { data, signature } = this.getCredentials(liqPayData);
    return `${checkoutUrl}?data=${data}&signature=${signature}`;
  }

  async post(liqPayData: LiqPayRequestData, path: string = 'request') {
    const url = URL.parse(`${hostUrl}${path}`)?.href;
    if (!url) throw new Error('Invalid url. Path must starts with "/"');
    const credentials = this.getCredentials(liqPayData);
    try {
      const response = await axios.post(apiRequestUrl, credentials, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (response.status === 200) return response.data;
      throw new Error(`Request failed with status code: ${response.status}`);
    } catch (error) {
      throw error;
    }
  }
}
