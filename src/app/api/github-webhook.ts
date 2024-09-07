// pages/api/github-webhook.js
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Handle the event
    const event = req.headers['x-github-event'];
    const payload = req.body;

    switch (event) {
        case 'push':
            // Handle push event
            console.log('Push event received:', payload);
            break;
        case 'pull_request':
            // Handle pull request event
            console.log('Pull request event received:', payload);
            break;
        // Add more cases for different GitHub events if needed
        default:
            console.log('Unhandled event:', event);
            break;
    }

    res.status(200).json({ message: 'Webhook received' });
}

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to verify the signature
    },
};
