export interface LiqPayRequestData {
  // main params
  version: number; // current - 7
  action: LiqPayRequestAction;
  amount: number; // 7.34
  currency: LiqPayCurrency;
  description: string;
  order_id: string; // max 255 chars
  rro_info?: LiqPayRroInfo; // fiscalization
  expired_date?: string; // by UTC: 2016-04-24 00:00:00
  language?: LiqPayLanguage;
  paytypes?: LiqPayRequestPaytype;
  result_url?: string; // max 510 chars
  server_url?: string; // max 510 chars
  verifycode?: string; // for auth action
  split_rules?: string; // stringified SplitRule[]
  // sender params
  sender_address?: string;
  sender_city?: string;
  sender_country_code?: string;
  sender_first_name?: string;
  sender_last_name?: string;
  sender_postal_code?: string;
  // subscription params
  subscribe?: '1';
  subscribe_date_start?: string; // by UTC: 2015-03-31 00:00:00
  subscribe_periodicity?: LiqPaySubscribePeriodicity;
  // one click payment params
  customer?: string;
  recurringbytoken?: '1';
  customer_user_id?: string;
  // other params
  dae?: string; // stringified DetailAddenda
  info?: string; // external info for payment
  product_category?: string;
  product_description?: string;
  product_name?: string;
  product_url?: string;
}

export interface LiqPayRequest extends LiqPayRequestData {
  public_key: string;
}

export interface LiqPayPaymentResponse {
  data: string;
  signature: string;
}

export interface LiqPayPaymentData {
  acq_id: number;
  action: LiqPayResponseAction;
  agent_commission: number;
  amount: number;
  amount_bonus: number;
  amount_credit: number;
  amount_debit: number;
  authcode_credit: string;
  authcode_debit: string;
  card_token: string;
  commission_credit: number;
  commission_debit: number;
  completion_date: string;
  create_date: string;
  currency: string;
  currency_credit: string;
  currency_debit: string;
  customer: string;
  description: string;
  end_date: string;
  err_code: string;
  err_description: string;
  info: string;
  ip: string;
  is_3ds: boolean;
  liqpay_order_id: string;
  mpi_eci: 5 | 6 | 7;
  order_id: string;
  payment_id: number;
  paytype: LiqPayResponsePaytype;
  public_key: string;
  receiver_commission: number;
  redirect_to: string;
  refund_date_last: string;
  rrn_credit: string;
  rrn_debit: string;
  sender_bonus: number;
  sender_card_bank: string;
  sender_card_country: string;
  sender_card_mask2: string;
  sender_iban: string;
  sender_card_type: string;
  sender_commission: number;
  sender_first_name: string;
  sender_last_name: string;
  sender_phone: string;
  status: LiqPayPaymentStatus;
  wait_reserve_status: string;
  token: string;
  type: string;
  version: number;
  err_erc: string;
  product_category: string;
  product_description: string;
  product_name: string;
  product_url: string;
  refund_amount: number;
  verifycode: string;
}

export interface LiqPayCredentials {
  data: string; // stringified LiqPayRequestData
  signature: string;
}

export interface LiqPayRroInfo {
  items?: LiqPayRroInfoItem[];
  delivery_emails?: string[];
}

export interface LiqPayRroInfoItem {
  amount: number;
  cost: number;
  id: number;
  price: number;
}

export interface LiqPaySplitRule {
  public_key: string;
  amount: number;
  commission_payer: LiqPayCommisionPayer;
  server_url: string;
  rro_info?: LiqPayRroInfo;
}

export interface DetailAddenda {
  airLine: string;
  ticketNumber: string;
  passengerName: string;
  flightNumber: string;
  originCity: string;
  destinationCity: string;
  departureDate: string;
}

export type LiqPayRequestAction =
  | 'pay'
  | 'hold'
  | 'subscribe'
  | 'paydonate'
  | 'auth';

export type LiqPayResponseAction = 'pay' | 'hold' | 'subscribe' | 'regular';

export type LiqPayCurrency = 'USD' | 'EUR' | 'UAH';

export type LiqPayLanguage = 'uk' | 'en';

export type LiqPayRequestPaytype =
  | 'apay'
  | 'gpay'
  | 'card'
  | 'privat24'
  | 'moment_part'
  | 'paypart'
  | 'cash'
  | 'invoice'
  | 'qr';

export type LiqPayResponsePaytype =
  | 'card'
  | 'privat24'
  | 'masterpass'
  | 'moment_part'
  | 'cash'
  | 'invoice'
  | 'qr';

export type LiqPaySubscribePeriodicity = 'day' | 'week' | 'month' | 'year';

export type LiqPayPaymentStatus =
  | LiqPayResolvedPaymentStatus
  | LiqPayUnresolvedPaymentStatus
  | LiqPayOtherPaymentStatus;

export type LiqPayResolvedPaymentStatus =
  | 'error'
  | 'failure'
  | 'reversed'
  | 'subscribed'
  | 'success'
  | 'unsubscribed';

export type LiqPayUnresolvedPaymentStatus =
  | '3ds_verify'
  | 'captcha_verify'
  | 'cvv_verify'
  | 'ivr_verify'
  | 'otp_verify'
  | 'password_verify'
  | 'phone_verify'
  | 'pin_verify'
  | 'receiver_verify'
  | 'sender_verify'
  | 'senderapp_verify'
  | 'wait_qr'
  | 'wait_sender';

export type LiqPayOtherPaymentStatus =
  | 'cash_wait'
  | 'hold_wait'
  | 'invoice_wait'
  | 'prepared'
  | 'processing'
  | 'wait_accept'
  | 'wait_card'
  | 'wait_compensation'
  | 'wait_lc'
  | 'wait_reserve'
  | 'wait_secure';

export type LiqPayCommisionPayer = 'sender' | 'receiver';
