// Analytics utility functions for tracking user behavior

export function initAnalytics(): void {
  // Initialize analytics services here (e.g., Google Analytics, Plausible)
  console.log('[Analytics] Initialized');
}

export function logPageView(path: string): void {
  // Log page view event
  console.log('[Analytics] Page view:', path);
}
