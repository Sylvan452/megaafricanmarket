import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query || {};

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Process the query parameter
  res.status(200).json({ message: 'Success', query });
}
