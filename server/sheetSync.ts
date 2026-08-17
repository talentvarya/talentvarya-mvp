export async function mirrorToGoogleSheet(sheet: string, row: Record<string, unknown>) {
  const sheetEndpoint = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  const sheetSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET?.trim();
  if (!sheetEndpoint || !sheetSecret) return { synced: false, reason: 'not_configured' as const };

  try {
    const response = await fetch(sheetEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: sheetSecret, sheet, row }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Google Sheet sync returned HTTP ${response.status}`);
    return { synced: true };
  } catch (error) {
    console.warn('Google Sheet mirror skipped:', error instanceof Error ? error.message : error);
    return { synced: false, reason: 'request_failed' as const };
  }
}
