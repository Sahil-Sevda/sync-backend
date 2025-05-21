import { body, param } from "express-validator";

export const validateSyncEvent = [
  body("device_id").isString().withMessage("device_id must be a string"),
  body("total_files_synced").isInt({ min: 0 }).withMessage("Must be a non-negative integer"),
  body("total_errors").isInt({ min: 0 }).withMessage("Must be a non-negative integer"),
  body("internet_speed").isFloat({ min: 0 }).withMessage("Must be a non-negative number"),
  body("timestamp").optional().isISO8601().withMessage("Invalid timestamp format"),
];

export const validateDeviceIdParam = [
  param("id").isString().withMessage("Device ID must be a string"),
];
