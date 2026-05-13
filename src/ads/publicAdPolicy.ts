import type { PublicRoute } from "../content/publicPages";

const adAllowedRoutes = new Set<PublicRoute>([
  "/",
  "/how-to-play",
  "/strategy",
  "/founders",
  "/industries",
  "/founder-league",
  "/about",
  "/changelog",
]);

export function canShowPublicAds(route: PublicRoute): boolean {
  return adAllowedRoutes.has(route);
}

