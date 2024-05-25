import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('your-database-name');
    const collection = db.collection('your-collection-name');
    
    const searchResults = await collection
      .find({ name: { $regex: query, $options: 'i' } }) // Case-insensitive search
      .toArray();

    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
