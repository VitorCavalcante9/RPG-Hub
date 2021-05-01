import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';

import AuthController from './controllers/AuthController';
import CharacterController from './controllers/CharacterController';
import DicesController from './controllers/DicesController';
import GameController from './controllers/GameController';
import HomeController from './controllers/HomeController';
import InviteController from './controllers/InviteController';
import ObjectController from './controllers/ObjectController';
import PermissionChangeController from './controllers/PermissionChangeController';
import RpgController from './controllers/RpgController';
import RpgHomeController from './controllers/RpgHomeController';
import ScenarioController from './controllers/ScenarioController';
import SheetController from './controllers/SheetController';
import UserController from './controllers/UserController';
import adminMiddleware from './middleware/adminMiddleware';
import authMiddleware from './middleware/authMiddleware';

const router = Router();
const upload = multer(uploadConfig);

//users
router.post('/users', UserController.store);
router.post('/auth', AuthController.authenticate);
router.get('/users', authMiddleware, UserController.show);
router.patch('/users', authMiddleware, upload.single('icon'), UserController.update);
router.patch('/users/password', authMiddleware, UserController.updatePassword);
router.delete('/users', authMiddleware, UserController.delete);

//rpgs
router.post('/rpgs', authMiddleware, upload.single('icon'), RpgController.store);
router.patch('/rpgs/:rpg_id', [authMiddleware, adminMiddleware], upload.single('icon'), RpgController.update);
router.delete('/rpgs/:rpg_id', [authMiddleware, adminMiddleware], RpgController.delete);

//sheet
router.patch('/rpgs/:rpg_id/sheet', [authMiddleware, adminMiddleware], SheetController.update);
router.get('/rpgs/:rpg_id/sheet', [authMiddleware, adminMiddleware],SheetController.show);

//dices
router.patch('/rpgs/:rpg_id/dices', [authMiddleware, adminMiddleware], DicesController.update);
router.get('/rpgs/:rpg_id/dices', [authMiddleware, adminMiddleware], DicesController.show);

//scenarios
router.post('/rpgs/:rpg_id/scenarios', [authMiddleware, adminMiddleware], upload.single('image'), ScenarioController.store);
router.get('/rpgs/:rpg_id/scenarios/:id', [authMiddleware, adminMiddleware], ScenarioController.show);
router.get('/rpgs/:rpg_id/scenarios', [authMiddleware, adminMiddleware], ScenarioController.index);
router.put('/rpgs/:rpg_id/scenarios/:id', [authMiddleware, adminMiddleware], upload.single('image'), ScenarioController.update);
router.delete('/rpgs/:rpg_id/scenarios/:id', [authMiddleware, adminMiddleware], ScenarioController.delete);

//characters
router.post('/rpgs/:rpg_id/characters', [authMiddleware, adminMiddleware], upload.single('icon'), CharacterController.store);
router.get('/rpgs/:rpg_id/characters/:id', [authMiddleware, adminMiddleware], CharacterController.show);
router.get('/rpgs/:rpg_id/characters', [authMiddleware, adminMiddleware], CharacterController.index);
router.put('/rpgs/:rpg_id/characters/:id', [authMiddleware, adminMiddleware], upload.single('icon'), CharacterController.update);
router.patch('/rpgs/:rpg_id/characters/:id', [authMiddleware], CharacterController.updateUser);
router.delete('/rpgs/:rpg_id/characters/:id', [authMiddleware, adminMiddleware], CharacterController.delete);
router.patch('/rpgs/:rpg_id/characters/:id/link_account', [authMiddleware, adminMiddleware], CharacterController.linkAccount);
router.patch('/rpgs/:rpg_id/characters/:id/unlink_account', [authMiddleware, adminMiddleware], CharacterController.unlinkAccount);

//characterUser - Permissions
router.post('/rpgs/:rpg_id/characters/:char_id/permission', authMiddleware, PermissionChangeController.requestPermission);
router.get('/rpgs/:rpg_id/permissions/:id', [authMiddleware, adminMiddleware], PermissionChangeController.show);
router.get('/rpgs/:rpg_id/permissions', [authMiddleware, adminMiddleware], PermissionChangeController.index);
router.put('/rpgs/:rpg_id/permissions/:id', [authMiddleware, adminMiddleware], PermissionChangeController.acceptPermission);
router.delete('/rpgs/:rpg_id/permissions/:id', [authMiddleware, adminMiddleware], PermissionChangeController.denyPermission);

//objects
router.post('/rpgs/:rpg_id/objects', [authMiddleware, adminMiddleware], upload.single('image'), ObjectController.store);
router.get('/rpgs/:rpg_id/objects/:id', [authMiddleware, adminMiddleware], ObjectController.show);
router.get('/rpgs/:rpg_id/objects', [authMiddleware, adminMiddleware], ObjectController.index);
router.put('/rpgs/:rpg_id/objects/:id', [authMiddleware, adminMiddleware], upload.single('image'), ObjectController.update);
router.delete('/rpgs/:rpg_id/objects/:id', [authMiddleware, adminMiddleware], ObjectController.delete);

//homes
router.get('/home', authMiddleware, HomeController.home);
router.get('/rpgs/:rpg_id', [authMiddleware, adminMiddleware], RpgHomeController.admin);
router.get('/rpgs/:rpg_id/participant', authMiddleware, RpgHomeController.participant);

//invite
router.post('/invite', authMiddleware, InviteController.acceptInvite);
router.delete('/rpgs/:rpg_id/user', [authMiddleware, adminMiddleware], InviteController.removeUser);

//game
router.put('/rpgs/:rpg_id/session', [authMiddleware, adminMiddleware], GameController.saveSession);
router.put('/rpgs/:rpg_id/notes', [authMiddleware], GameController.saveNotes);
router.get('/rpgs/:rpg_id/notes', [authMiddleware], GameController.showNotes);

export { router };