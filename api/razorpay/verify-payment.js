import crypto from 'node:crypto';

const plans = {
  candidate_30_days: { days: 30, amount: 4900 },
  candidate_6_months: { days: 180, amount: 29900 },
  candidate_12_months: { days: 365, amount: 49900 },
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !secret) {
    return response.status(503).json({
      error: 'Razorpay verification is not configured.',
    });
  }

  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
    planId,
  } = request.body || {};

  const plan = plans[planId];

  if (!orderId || !paymentId || !signature || !plan) {
    return response.status(400).json({
      error: 'Payment verification details are incomplete.',
    });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const supplied = Buffer.from(String(signature), 'utf8');
  const calculated = Buffer.from(expected, 'utf8');

  if (
    supplied.length !== calculated.length ||
    !crypto.timingSafeEqual(supplied, calculated)
  ) {
    return response.status(400).json({
      error: 'Invalid payment signature.',
    });
  }

  try {
    const orderResponse = await fetch(
      `https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${keyId}:${secret}`
          ).toString('base64')}`,
        },
      }
    );

    const order = await orderResponse.json();

    if (
      !orderResponse.ok ||
      order.amount !== plan.amount ||
      order.currency !== 'INR' ||
      order.notes?.plan_id !== planId
    ) {
      return response.status(400).json({
        error: 'Payment amount or plan does not match the order.',
      });
    }

    const validUntil = new Date(
      Date.now() + plan.days * 86400000
    ).toISOString();

    return response.status(200).json({
      verified: true,
      planId,
      paymentId,
      validUntil,
    });
  } catch {
    return response.status(502).json({
      error: 'Could not validate the Razorpay order.',
    });
  }
}
