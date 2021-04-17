import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';

import AuthController from './controllers/AuthController';
import DicesController from './controllers/DicesController';
import RpgController from './controllers/RpgController';
import SheetController from './controllers/SheetController';
import UserController from './controllers/UserController';
import authMiddleware from './middleware/authMiddleware';

const router = Router();
const upload = multer(uploadConfig);

//users
router.post('/users', UserController.store);
router.post('/auth', AuthController.authenticate);
router.get('/users', authMiddleware, UserController.show);
router.patch('/users', authMiddleware, upload.single('icon'), UserController.update);
router.delete('/users', authMiddleware, UserController.delete);

//rpgs
router.post('/rpgs', authMiddleware, upload.single('icon'), RpgController.store);
router.get('/rpgs/:rpg_id', authMiddleware, RpgController.show);
router.patch('/rpgs/:rpg_id', authMiddleware, upload.single('icon'), RpgController.update);
router.delete('/rpgs/:rpg_id', authMiddleware, RpgController.delete);

//sheet
router.patch('/rpgs/:rpg_id/sheet', authMiddleware, SheetController.update);

//dices
router.patch('/rpgs/:rpg_id/dices', authMiddleware, DicesController.update);

export { router };