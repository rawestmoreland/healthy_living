import { getToken } from 'next-auth/jwt';

/**
 * This Next.js API route exists to create an abstraction layer between request from the client and Airframe.
 * For CSR pages, you should fetch this endpoint.
 * For SSG/SSR pages, you should just call `fetchAirframeAPI` directly.
 */
export default async function handler(req, res) {
  try {
    const { jwt } = await getToken({ req });
    const newURL = req.url.replace('/api/pocketbase', '');
    const response = await fetch(`${process.env.PB_URL}/api${newURL}`, {
      ...(req.method && { method: req.method }),
      headers: {
        Authorization: `Bearer: ${jwt}`,
        'content-type': 'application/json',
      },
      ...(req.body && { body: JSON.stringify(req.body) }),
    });
    res.status(response.status || 200).json({ status: 'success' });
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
}
