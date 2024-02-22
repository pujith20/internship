import express from "express";
import Tracking from "../models/trackingModel.js";

const router = express.Router();
// Get tracking information by tracking number
router.get('/:trackingNumber', async (req, res) => {
  try {
    const trackingNumber = req.params.trackingNumber;
    const trackingInfo = await Tracking.findOne({trackingNumber});
    if (!trackingInfo) {
      return res.status(404).json({ message: 'Tracking information not found' });
    }
    res.status(200).json({trackingInfo});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
