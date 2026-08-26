const plans = {
  candidate_30_days: { amount: 4900, label: 'Candidate 30 Days' },
  candidate_6_months: { amount: 29900, label: 'Candidate 6 Months' },
  candidate_12_months: { amount: 49900, label: 'Candidate 12 Months' },
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return response.status(503).json({
      error: 'Razorpay is not configured on the server yet.',
    });
  }

  const { planId } = request.body || {};
  const plan = plans[planId];

  if (!plan) {
    return response.status(400).json({
      error: 'A valid candidate plan is required.',
    });
  }

  try {
    const razorpayResponse = await fetch(
      'https://api.razorpay.com/v1/orders',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${keyId}:${keySecret}`
          ).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: plan.amount,
          currency: 'INR',
          receipt: `tv_${planId}_${Date.now()}`.slice(0, 40),
          notes: {
            plan_id: planId,
            plan_label: plan.label,
          },
        }),
      }
    );

    const order = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      return response.status(razorpayResponse.status).json({
        error:
          order?.error?.description ||
          'Razorpay order creation failed.',
      });
    }

    return response.status(200).json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch {
    return response.status(502).json({
      error: 'Could not connect to Razorpay. Please try again.',
    });
  }
}
