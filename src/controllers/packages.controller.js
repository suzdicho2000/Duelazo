import { validationResult } from 'express-validator';
import axios from 'axios';
import { generateApiSignature } from '../services/interSect/interSectSignature.js';
import { createTransaction, readPackages, findCell, dataCell } from '../services/google/utilsGoogle.js';
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
      returnUrl,
      callBackUrl,
      sheet,
      data,
    } = req.body;
    // console.log(req.body);
    let valuePlan = 0;
    const dataSheet = await readPackages(sheet);
    console.log(sheet);
    console.log(dataSheet);
    if (dataSheet === undefined) {
      return res.status(400).json({ errors: 'No se encontraron datos' });
    } else {
      for (const e of data) {
        const cellAdress = await findCell(dataSheet, e.name, sheet);
        console.log(cellAdress);

        if (cellAdress === false) {
          return false;
        }

        const data = await dataCell(cellAdress);
        console.log(data);

        if (typeof data[0][1] !== 'string') return false;

        const normalized = data[0][1].replace(/,/g, '');
        const number = parseFloat(normalized);
        const price = isNaN(number) ? null : number;
        const total = price * e.cant;
        valuePlan += total;
      }
    }
    console.log('Total:', valuePlan);

    const signature = await generateApiSignature();
    const transactionId = 'txn_ref_' + Date.now();
    const requestBody = {
      customer: {
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        dateOfBirth: null,
        customerReferenceId: `${sheet}-${signature.x_idempotency_key}`,
      },
      card: {
        name: cardName,
        number: cardNumber,
        cvv,
        month: expMonth,
        year: expYear,
        address: {
          line1: address,
          line2: null,
          countryCode,
          stateProvince,
          city,
          postalCode,
        },
      },
      amount: valuePlan,
      currency: 'USD',
      transactionReferenceId: transactionId,
      ip: ipAddress || '127.0.0.1',
      notes: null,
      callBackUrl,
      returnUrl,
    };
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.TEST_API_KEY,
      'x-idempotency-key': signature.x_idempotency_key,
      'x-signature': signature.x_signature,
    };
    const response = await axios.post(signature.apiUrl, requestBody, { headers });
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
          `${sheet}-${signature.x_idempotency_key}`,
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
// export const createPurchasesController = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const {
//       firstName,
//       lastName,
//       emailAddress,
//       phoneNumber,
//       planReferenceId,
//       cardName,
//       cardNumber,
//       cvv,
//       expMonth,
//       expYear,
//       address,
//       countryCode,
//       stateProvince,
//       city,
//       postalCode,
//       ipAddress,
//       amount,
//       returnUrl,
//     } = req.body;
//     let valuePlan;
//     if (planReferenceId === 'Free' && amount) {
//       valuePlan = amount;
//     } else {
//       valuePlan = await getPackageByReference(planReferenceId);
//       if (!valuePlan) {
//         return res.status(400).json({ errors: 'No se ha encontrado el paquete especificado' });
//       }
//     }
//     const data = await generateApiSignature();
//     const transactionId = 'txn_ref_' + Date.now();
//     const requestBody = {
//       customer: {
//         firstName: firstName,
//         lastName: lastName,
//         emailAddress: emailAddress,
//         phoneNumber: phoneNumber,
//         dateOfBirth: null,
//         customerReferenceId: planReferenceId,
//       },
//       card: {
//         name: cardName,
//         number: cardNumber,
//         cvv: cvv,
//         month: expMonth,
//         year: expYear,
//         address: {
//           line1: address,
//           line2: null,
//           countryCode: countryCode,
//           stateProvince: stateProvince,
//           city: city,
//           postalCode: postalCode,
//         },
//       },
//       amount: valuePlan,
//       currency: 'USD',
//       transactionReferenceId: transactionId,
//       ip: ipAddress,
//       notes: null,
//       callBackUrl,
//       returnUrl,
//     };
//     const headers = {
//       'Content-Type': 'application/json',
//       'x-api-key': process.env.TEST_API_KEY,
//       'x-idempotency-key': data.x_idempotency_key,
//       'x-signature': data.x_signature,
//     };
//     const response = await axios.post(data.apiUrl, requestBody, { headers });
//     const fecha = new Date().toLocaleDateString('es-MX', {
//       timeZone: 'America/Mexico_City',
//     });
//     const hora = new Date().toLocaleTimeString('es-MX', {
//       timeZone: 'America/Mexico_City',
//     });
//     const dataTransaction = {
//       values: [
//         [
//           fecha,
//           hora,
//           firstName,
//           lastName,
//           emailAddress,
//           phoneNumber,
//           address,
//           countryCode,
//           stateProvince,
//           city,
//           postalCode,
//           planReferenceId,
//           valuePlan,
//           response.data.transactionId,
//           response.data.redirectUrl,
//           response.data.statusCode,
//           response.data.status,
//           response.data.statusReason,
//         ],
//       ],
//     };
//     await createTransaction(dataTransaction, `${sheetTransactions}!A2`);
//     console.log('---------------------------\n');
//     console.log(`Status HTTP: ${response.status}`);
//     console.log('Cuerpo de la respuesta:', response.data);
//     console.log('---------------------------\n');
//     return res.send(response.data);
//   } catch (error) {
//     console.error('Error en la respuesta:', error.response.status);
//     console.error('Datos del error:', error.response.data);
//     return res.status(400).json({ errors: 'Ha ocurrido un error al intentar crear la transaccion' });
//   }
// };

export const webhhook = async (req, res) => {
  try {
    console.log('Webhook recibido de Intersect Banking');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error en la respuesta:', error.response.status);
    console.error('Datos del error:', error.response.data);
    return res.status(400).json({ errors: 'Ha ocurrido un error al intentar crear la transaccion' });
  }
};

export const getTransaction = async (req, res) => {
  try {
    console.log('Body:', req.params.id);
    const data = await generateApiSignature();
    const headers = {
      'x-api-key': process.env.TEST_API_KEY,
      'x-idempotency-key': data.x_idempotency_key,
      'x-signature': data.x_signature,
    };
    const response = await axios.get(`${data.apiUrl}/${req.params.id}`, { headers });
    console.log('---------------------------\n');
    console.log(`Status HTTP: ${response.status}`);
    console.log('Cuerpo de la respuesta:', response.data);
    console.log('---------------------------\n');
    let responseData = response.data;
    const fecha = new Date().toLocaleDateString('es-MX', {
      timeZone: 'America/Mexico_City',
    });
    const hora = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
    });
    responseData = { ...responseData, time: `${fecha} - ${hora}` };
    res.send(responseData);
  } catch (error) {
    console.error('Error en la respuesta:', error.response.status);
    console.error('Datos del error:', error.response.data);
    return res.status(400).json({ errors: 'Ha ocurrido un error al intentar crear la transaccion' });
  }
};
