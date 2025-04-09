import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const bookingData = req.body;

    // Here you would typically:
    // 1. Validate the booking data
    // 2. Check spot availability
    // 3. Save to database
    // 4. Send confirmation email
    
    // For now, we'll simulate a successful booking
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    return res.status(200).json({
      message: 'Booking successful',
      booking: {
        ...bookingData,
        id: `booking-${Date.now()}`,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: 'Error processing booking' });
  }
} 