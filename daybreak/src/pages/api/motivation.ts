import type { NextApiRequest, NextApiResponse } from 'next';

interface QuoteAPIResponse {
  quote: string;
  author: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuoteAPIResponse>
) {
  if (req.method === 'GET') {
    try {
      // Fetch from a quotes API
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      
      res.status(200).json({
        quote: data.content,
        author: data.author
      });
    } catch (error) {
      console.error('Quote API error:', error);
      // Fallback quotes
      const quotes = [
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      
      res.status(200).json({
        quote: randomQuote.quote,
        author: randomQuote.author
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}