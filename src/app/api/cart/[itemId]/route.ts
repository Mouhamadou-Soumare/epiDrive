import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { itemId } = req.query;

    if (req.method === 'GET') {
        // Handle GET request for itemId
        res.status(200).json({ message: `Fetching item with ID: ${itemId}` });
    } else if (req.method === 'POST') {
        // Handle POST request for itemId
        res.status(200).json({ message: `Creating item with ID: ${itemId}` });
    } else if (req.method === 'PUT') {
        // Handle PUT request for itemId
        res.status(200).json({ message: `Updating item with ID: ${itemId}` });
    } else if (req.method === 'DELETE') {
        // Handle DELETE request for itemId
        res.status(200).json({ message: `Deleting item with ID: ${itemId}` });
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}