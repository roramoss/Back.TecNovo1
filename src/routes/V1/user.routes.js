 import express from 'express';
import { createUser, getMe, login} from '../../controllers/user.controllers.js'; 
import { checkAuth } from '../../middlewares/auth-middlleware.js';
const router = express.Router();

router.post('/create', createUser);
router.post('/login', login);
router.get('/me', checkAuth, getMe);

export default router;