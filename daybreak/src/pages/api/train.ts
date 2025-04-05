import type { NextApiRequest, NextApiResponse } from 'next';
import { TrainDeparture } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrainDeparture[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      // In a real app, fetch from a transit API
      // For now, return mock data
      res.status(200).json([
        { id: 1, line: 'L1', color: '#4285f4', destination: 'Downtown', time: '8:15 AM' },
        { id: 2, line: 'L2', color: '#ea4335', destination: 'Eastside', time: '8:23 AM' },
        { id: 3, line: 'L3', color: '#34a853', destination: 'Westpark', time: '8:37 AM' }
      ]);
    } catch (error) {
      console.error('Trains API error:', error);
      res.status(500).json({ error: 'Failed to fetch train data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}