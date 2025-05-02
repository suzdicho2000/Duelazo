import { Router } from 'express';
import packages from './packages.routes.js';

const router = Router();

router.use('/packages', packages);

export default router;
