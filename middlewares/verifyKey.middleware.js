import {ENV} from "../configs/constant.js";
const verifySecretKey = (req, res, next) => {
  const incomingKey = req.headers['x-api-key'];
    if (!incomingKey) {
        return res.status(400).json({ message: 'API key is missing' });
    }
  const expectedKey = ENV.SYNC_SECRET;

  if (incomingKey !== expectedKey) {
    return res.status(403).json({ message: 'Invalid API key' });
  }

  next();
};

export{ verifySecretKey};