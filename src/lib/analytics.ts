export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  try {
    // Placeholder analytics: replace with GA/Segment/other provider later
    // console.log ensures developers can see events during dev
    console.log('[analytics]', name, params);
  } catch (e) {
    // no-op
  }
}

export default { trackEvent };
