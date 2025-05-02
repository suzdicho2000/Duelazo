import { validationResult } from 'express-validator';
import axios from 'axios';
import { generateApiSignature } from '../services/interSect/interSectSignature.js';
import { getPackageByReference } from './packages.utils.js';
import { createTransaction } from '../services/google/utilsGoogle.js';
const sheetTransactions = process.env.TRANSACTIONS;
export const createPurchasesController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      planReferenceId,
      cardName,
      cardNumber,
      cvv,
      expMonth,
      expYear,
      address,
      countryCode,
      stateProvince,
      city,
      postalCode,
      ipAddress,
      amount,
    } = req.body;
    let valuePlan;
    if (planReferenceId === 'Free' && amount) {
      valuePlan = amount;
    } else {
      valuePlan = await getPackageByReference(planReferenceId);
      if (!valuePlan) {
        return res.status(400).json({ errors: 'No se ha encontrado el paquete especificado' });
      }
    }
    const data = await generateApiSignature();
    const transactionId = 'txn_ref_' + Date.now();
    const requestBody = {
      customer: {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        phoneNumber: phoneNumber,
        dateOfBirth: null,
        customerReferenceId: planReferenceId,
      },
      card: {
        name: cardName,
        number: cardNumber,
        cvv: cvv,
        month: expMonth,
        year: expYear,
        address: {
          line1: address,
          line2: null,
          countryCode: countryCode,
          stateProvince: stateProvince,
          city: city,
          postalCode: postalCode,
        },
      },
      amount: valuePlan,
      currency: 'USD',
      transactionReferenceId: transactionId,
      ip: ipAddress,
      notes: null,
      callBackUrl: null,
      returnUrl: 'https://prazoom.com/paquetes',
    };
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.TEST_API_KEY,
      'x-idempotency-key': data.x_idempotency_key,
      'x-signature': data.x_signature,
    };
    console.log('----------prueba--------\n');
    const response = await axios.post(data.apiUrl, requestBody, { headers });
    const fecha = new Date().toLocaleDateString('es-MX', {
      timeZone: 'America/Mexico_City',
    });
    const hora = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
    });
    const dataTransaction = {
      values: [
        [
          fecha,
          hora,
          firstName,
          lastName,
          emailAddress,
          phoneNumber,
          address,
          countryCode,
          stateProvince,
          city,
          postalCode,
          planReferenceId,
          valuePlan,
          response.data.transactionId,
          response.data.redirectUrl,
          response.data.statusCode,
          response.data.status,
          response.data.statusReason,
        ],
      ],
    };
    await createTransaction(dataTransaction, `${sheetTransactions}!A2`);
    console.log('---------------------------\n');
    console.log(`Status HTTP: ${response.status}`);
    console.log('Cuerpo de la respuesta:', response.data);
    console.log('---------------------------\n');
    return res.send(response.data);
  } catch (error) {
    console.error('Error en la respuesta:', error.response.status);
    console.error('Datos del error:', error.response.data);
    return res.status(400).json({ errors: 'Ha ocurrido un error al intentar crear la transaccion' });
  }
};
