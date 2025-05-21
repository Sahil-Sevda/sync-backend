import SyncEvent from "../models/syncEvent.model.js";
import { validateFields } from "../services/helper.service.js";
import { ENV } from "../configs/constant.js";
import { errorLogger } from "../utils/pino.util.js";

// POST /sync-event => to receive a sync event
const createSyncEvent = async (req, res) => {
  try {
    const requiredFields = [
      "device_id",
      "total_files_synced",
      "total_errors",
      "internet_speed",
    ];
    const missingFields = validateFields(requiredFields, req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const {
      device_id,
      timestamp,
      total_files_synced,
      total_errors,
      internet_speed,
    } = req.body;

    const event = new SyncEvent({
      device_id,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      total_files_synced,
      total_errors,
      internet_speed,
    });

    await event.save();

    // Trigger notification on 3 consecutive failures
    if (total_errors > 0) {
      const recentEvents = await SyncEvent.find({ device_id })
        .sort({ timestamp: -1 })
        .limit(2);

      if (
        recentEvents.length === 2 &&
        recentEvents.every((e) => e.total_errors > 0)
      ) {
        errorLogger.warn(
          `ALERT: Device "${device_id}" has failed to sync 3 times in a row!`
        );
        console.log(
          `ALERT: Device "${device_id}" has failed to sync 3 times in a row!`
        );
      }
    }

    return res
      .status(201)
      .json({ message: "Sync event recorded successfully." });
  } catch (error) {
    errorLogger.error("Error in createSyncEvent:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /device/:id/sync-history => to view sync logs of a device
const getSyncHistory = async (req, res) => {
  try {
    const requiredFields = ["id"];
    const missingFields = validateFields(requiredFields, req.params);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const { id: deviceId } = req.params;

    const events = await SyncEvent.find({ device_id: deviceId }).sort({
      timestamp: -1,
    });
    if (!events || events.length === 0) {
      return res
        .status(404)
        .json({ error: "No sync history found for this device." });
    }
    return res.status(200).json(events);
  } catch (error) {
    errorLogger.error("Error in getSyncHistory:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /devices/repeated-failures => to list devices with more than 3 failed syncs (non-consecutive)
const getDevicesWithRepeatedFailures = async (req, res) => {
  try {
    const failures = await SyncEvent.aggregate([
      { $match: { total_errors: { $gt: 0 } } },
      {
        $group: {
          _id: "$device_id",
          failureCount: { $sum: 1 },
        },
      },
      { $match: { failureCount: { $gt: 3 } } },
    ]);

    const result = failures.map((f) => ({
      device_id: f._id,
      failure_count: f.failureCount,
    }));

    return res.status(200).json(result);
  } catch (error) {
    errorLogger.error("Error in getDevicesWithRepeatedFailures:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { createSyncEvent, getSyncHistory, getDevicesWithRepeatedFailures };
