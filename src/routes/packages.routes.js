import { Router } from 'express';
import { createPurchasesController } from '../controllers/packages.controller.js';
import { validateTransaction } from '../validation/transaction.validation.js';

const packages = Router();

packages.post('/', validateTransaction, createPurchasesController);

export default packages;
