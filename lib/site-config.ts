import type { FieldMode } from "@/lib/field-engine";

const background: FieldMode = "orbit";

export const siteConfig = {
  /**
   * Background motion style:
   *   "orbit"   – drifting square particles; the cursor gathers them into a ring
   *   "lattice" – grid of dashes that align around the cursor like iron filings
   *   "streams" – wind-map trails; the cursor acts as a vortex
   */
  background,

  features: {
    /**
     * Certifications section on the home page (and its navbar link).
     * Add entries to data/certifications.json, then flip this to true before deploying.
     */
    certifications: false,
  },
};
