export interface CheckoutResponse {
  sessionId: string;
  url?: string;
}

export async function redirectToCheckout(
  planId: string,
  leadSource?: string,
  email?: string,
  formData?: Record<string, string>,
): Promise<void> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const response = await fetch(`${apiUrl}/api/v1/checkout/create-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: planId,
      lead_source: leadSource || 'portfolio_direct',
      lead_email: email || null,
      form_data: formData || null,
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    throw new Error(errBody?.detail || `Failed to create checkout session (${response.status})`);
  }

  const data: CheckoutResponse = await response.json();

  // Redirect using the Checkout URL directly (works with all Stripe API versions)
  if (data.url) {
    window.location.href = data.url;
  } else {
    // Dev mode: no URL returned (no real Stripe keys configured)
    console.info('[stripe] Dev mode — session created:', data.sessionId);
  }
}
