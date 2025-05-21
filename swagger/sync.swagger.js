/**
 * @swagger
 * tags:
 *   - name: SyncEvents
 *     description: APIs for managing device sync events in PiSync. Devices send sync reports, and admins can query sync history or detect devices with repeated failures.
 */

/**
 * @swagger
 * /v1/sync/sync-event:
 *   post:
 *     tags: [SyncEvents]
 *     summary: Submit a sync event from a Pi device.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - device_id
 *               - timestamp
 *               - total_files_synced
 *               - total_errors
 *               - internet_speed
 *             properties:
 *               device_id:
 *                 type: string
 *                 description: Unique identifier of the device.
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: ISO timestamp of the sync event.
 *               total_files_synced:
 *                 type: integer
 *                 description: Number of files successfully synced.
 *               total_errors:
 *                 type: integer
 *                 description: Number of sync errors during this event.
 *               internet_speed:
 *                 type: number
 *                 format: float
 *                 description: Internet speed in Mbps during sync.
 *     responses:
 *       201:
 *         description: Sync event recorded successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /v1/sync/device/{id}/sync-history:
 *   get:
 *     tags: [SyncEvents]
 *     summary: Get sync history logs of a specific device.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Device ID whose sync history is to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sync history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       total_files_synced:
 *                         type: integer
 *                       total_errors:
 *                         type: integer
 *                       internet_speed:
 *                         type: number
 *       404:
 *         description: Device not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /v1/sync/devices/repeated-failures:
 *   get:
 *     tags: [SyncEvents]
 *     summary: Get devices with more than 3 failed syncs.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Devices with repeated failures retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       device_id:
 *                         type: string
 *                       total_failures:
 *                         type: integer
 *       500:
 *         description: Internal server error.
 */
