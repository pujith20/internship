import express from "express";
import Tracking from '../models/trackingModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const trackingInfo = await Tracking.find({});
    if (!trackingInfo) {
      return res.status(404).json({ message: 'Tracking information not found' });
    }
    res.status(200).json({trackingInfo, showAddOrderButton: true});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create tracking information
router.post('/add-order', async (req, res) => {
  try {
    const { trackingNumber, status, location, estimatedDeliveryDate, sender, recipient, weight, deliveryInstructions } = req.body;
    const newTracking = new Tracking({ trackingNumber, status, location, estimatedDeliveryDate, sender, recipient, weight, deliveryInstructions });
    await newTracking.save();
    res.status(200).json({ message: 'Tracking information inserted'});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update tracking information by tracking number
router.put('/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { status, location, estimatedDeliveryDate, sender, recipient, weight, deliveryInstructions } = req.body;
    const updatedTracking = await Tracking.findOneAndUpdate(
        { trackingNumber },
        { status, location, estimatedDeliveryDate, sender, recipient, weight, deliveryInstructions },
        { new: true }
      );
    if (!updatedTracking) {
      return res.status(404).json({ message: 'Tracking information not found' });
    }
    res.status(200).json({ message: 'Tracking information updated'});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tracking information by tracking number
router.delete('/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const deletedTracking = await Tracking.findOneAndDelete({ trackingNumber });
    if (!deletedTracking) {
      return res.status(404).json({ message: 'Tracking information not found' });
    }
    res.json({ message: 'Tracking information deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
