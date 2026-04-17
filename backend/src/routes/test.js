import { Router } from 'express';
import { testController } from '../controllers/test.js';

const router = Router();

router.get('/', testController);

export default router;
