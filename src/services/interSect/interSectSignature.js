import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

export function generateApiSignature() {
  const idempotencyKeyForThisRequest = uuidv4();
  const message = process.env.TEST_API_KEY + idempotencyKeyForThisRequest;
  const key = process.env.API_SECRET;
  const hash = CryptoJS.HmacSHA256(message, key);
  const signature = CryptoJS.enc.Base64.stringify(hash);
  const api = process.env.API_URL_PAYMENTS;

  return { x_idempotency_key: idempotencyKeyForThisRequest, x_signature: signature, apiUrl: api };
}
