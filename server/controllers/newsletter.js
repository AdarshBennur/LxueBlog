import Newsletter from '../models/Newsletter.js';

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/newsletter/subscribe
 * @access  Public
 */
export const subscribe = async (req, res) => {
  try {
    const { email, name, preferences } = req.body;

    // Check if email already exists
    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      // If already unsubscribed, resubscribe
      if (!subscriber.isSubscribed) {
        subscriber.isSubscribed = true;
        subscriber.subscribedAt = Date.now();
        subscriber.unsubscribedAt = undefined;
        
        if (preferences) {
          subscriber.preferences = preferences;
        }
        
        await subscriber.save();
        
        return res.status(200).json({
          success: true,
          message: 'Successfully resubscribed to newsletter',
          data: subscriber
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed'
      });
    }

    // Create new subscriber
    subscriber = await Newsletter.create({
      email,
      name,
      preferences: preferences || ['weekly']
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscriber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Unsubscribe from newsletter
 * @route   PUT /api/newsletter/unsubscribe
 * @access  Public
 */
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter list'
      });
    }

    subscriber.isSubscribed = false;
    subscriber.unsubscribedAt = Date.now();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all newsletter subscribers
 * @route   GET /api/newsletter
 * @access  Private (Admin)
 */
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find();

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
