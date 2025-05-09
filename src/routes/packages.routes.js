import { Router } from 'express';
import { createPurchasesController, webhhook } from '../controllers/packages.controller.js';
import { validateTransaction } from '../validation/transaction.validation.js';

const packages = Router();

packages.post('/', validateTransaction, createPurchasesController);
packages.post('/interSect-webhook', webhhook);

export default packages;
