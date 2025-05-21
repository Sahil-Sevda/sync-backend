import express from 'express';
const router = express.Router();
import {createSyncEvent, getSyncHistory, getDevicesWithRepeatedFailures} from '../controllers/sync.controller.js';
import {verifySecretKey} from '../middlewares/verifyKey.middleware.js';
import {
  validateSyncEvent,
  validateDeviceIdParam,
} from "../validators/syncEvent.validator.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";

router.post('/sync-event', verifySecretKey ,validateSyncEvent, validateRequest, createSyncEvent);
router.get('/device/:id/sync-history', verifySecretKey,validateDeviceIdParam, validateRequest, getSyncHistory);
router.get('/devices/repeated-failures', verifySecretKey, getDevicesWithRepeatedFailures);

export default router;
