import { body, param } from 'express-validator';

export const validateTransaction = [
  body('firstName')
    .exists()
    .withMessage('firstName es obligatorio')
    .isString()
    .withMessage('firstName debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('firstName no puede estar vacío')
    .isLength({ max: 200 })
    .withMessage('firstName no puede exceder los 200 caracteres'),

  body('lastName')
    .exists()
    .withMessage('lastName es obligatorio')
    .isString()
    .withMessage('lastName debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('lastName no puede estar vacío')
    .isLength({ max: 200 })
    .withMessage('lastName no puede exceder los 200 caracteres'),

  body('emailAddress')
    .exists()
    .withMessage('emailAddress es obligatorio')
    .isEmail()
    .withMessage('emailAddress debe ser un email válido')
    .isLength({ max: 200 })
    .withMessage('emailAddress no puede exceder los 200 caracteres'),

  body('phoneNumber')
    .exists()
    .withMessage('phoneNumber es obligatorio')
    .isString()
    .withMessage('phoneNumber debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('phoneNumber no puede estar vacío')
    .isLength({ max: 15 })
    .withMessage('phoneNumber no puede exceder los 15 caracteres'),

  body('sheet').notEmpty().withMessage('sheet no puede estar vacío').isString().withMessage('sheet debe ser un string'),
  // .isIn(['Enterprise', 'Business', 'Professional', 'Esencial', 'Free'])
  // .withMessage('planReferenceId debe ser uno de los valores permitidos: Enterprise, Business, Professional, Esencial, Free'),

  body('cardName')
    .exists()
    .withMessage('cardName es obligatorio')
    .isString()
    .withMessage('cardName debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('cardName no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('cardName no puede exceder los 100 caracteres'),

  body('cardNumber')
    .exists()
    .withMessage('cardNumber es obligatorio')
    .isString()
    .withMessage('cardNumber debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('cardNumber no puede estar vacío')
    .isLength({ max: 16 })
    .withMessage('cardNumber debe tener exactamente 16 caracteres')
    .isNumeric()
    .withMessage('cardNumber debe contener solo números'),

  body('cvv')
    .exists()
    .withMessage('cvv es obligatorio')
    .isString()
    .withMessage('cvv debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('cvv no puede estar vacío')
    .isLength({ min: 3, max: 4 })
    .withMessage('cvv debe tener 3 o 4 caracteres'),

  body('expMonth').exists().withMessage('expMonth es obligatorio').isInt({ min: 1, max: 12 }).withMessage('expMonth debe ser un entero entre 1 y 12'),

  body('expYear')
    .exists()
    .withMessage('expYear es obligatorio')
    .isInt({ min: new Date().getFullYear() })
    .withMessage('expYear debe ser un entero igual o posterior al año actual'),

  body('address')
    .exists()
    .withMessage('address es obligatorio')
    .isString()
    .withMessage('address debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('address no puede estar vacío')
    .isLength({ max: 250 })
    .withMessage('address no puede exceder los 250 caracteres'),

  body('countryCode')
    .exists()
    .withMessage('countryCode es obligatorio')
    .isString()
    .withMessage('countryCode debe ser un string')
    .isLength({ min: 2, max: 2 })
    .withMessage('countryCode debe tener exactamente 2 caracteres')
    .isAlpha()
    .withMessage('countryCode solo puede contener letras'),

  body('stateProvince')
    .exists()
    .withMessage('stateProvince es obligatorio')
    .isString()
    .withMessage('stateProvince debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('stateProvince no puede estar vacío')
    .isLength({ max: 250 })
    .withMessage('stateProvince no puede exceder los 250 caracteres'),

  body('city')
    .exists()
    .withMessage('city es obligatorio')
    .isString()
    .withMessage('city debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('city no puede estar vacío')
    .isLength({ max: 250 })
    .withMessage('city no puede exceder los 250 caracteres'),

  body('postalCode')
    .exists()
    .withMessage('postalCode es obligatorio')
    .isString()
    .withMessage('postalCode debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('postalCode no puede estar vacío')
    .isLength({ max: 10 })
    .withMessage('postalCode no puede exceder los 10 caracteres'),

  body('ipAddress')
    .exists()
    .withMessage('ipAddress es obligatorio')
    .isString()
    .withMessage('ipAddress debe ser un string')
    .trim()
    .notEmpty()
    .withMessage('ipAddress no puede estar vacío')
    .isIP()
    .withMessage('ipAddress debe ser una dirección IP válida (IPv4 o IPv6)'),

  body('data').exists().withMessage('data es obligatorio').isArray({ min: 1 }).withMessage('data debe ser un array con al menos un elemento'),
];
