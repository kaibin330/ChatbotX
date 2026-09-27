import type { OnePersonCompanySnapshot } from "../schema/snapshot"
import { onePersonCompanySnapshotSchema } from "../schema/snapshot"
import {
  ANNUALIZED_FLAT_PRICE_MYR,
  FLAT_MONTHLY_PRICE_MYR,
  ILLUSTRATIVE_HOURS_SAVED,
  ILLUSTRATIVE_OWNER_HOURLY_COST_MYR,
  illustrativeLaborRoi,
  ROADMAP_YEAR_ONE_COMPARISONS,
  ROADMAP_YEAR_ONE_COST_MYR,
} from "./flat-pricing"

/**
 * Community Edition placeholder for the One-Person Company dashboard.
 * Returns roadmap assumptions and unmeasured ROI fields. Does not read a
 * workspace, contact a payment processor, or create a subscription.
 */
export const getOnePersonCompanySpikeSnapshot =
  (): OnePersonCompanySnapshot => {
    const illustrative = illustrativeLaborRoi({
      hoursSaved: ILLUSTRATIVE_HOURS_SAVED,
      ownerHourlyCostMyr: ILLUSTRATIVE_OWNER_HOURLY_COST_MYR,
      flatMonthlyPriceMyr: FLAT_MONTHLY_PRICE_MYR,
    })

    return onePersonCompanySnapshotSchema.parse({
      kind: "track-b-b4-spike",
      billingStatus: "not-subscribed",
      currency: "MYR",
      flatMonthlyPriceMyr: FLAT_MONTHLY_PRICE_MYR,
      annualizedFlatPriceMyr: ANNUALIZED_FLAT_PRICE_MYR,
      roadmapYearOneCostMyr: ROADMAP_YEAR_ONE_COST_MYR,
      roi: {
        hoursSaved: null,
        ownerHourlyCostMyr: null,
        conversationsHandled: null,
        humanEscalations: null,
        channelsInUse: null,
      },
      illustrativeExample: {
        labeledAs: "illustrative-not-live",
        hoursSaved: ILLUSTRATIVE_HOURS_SAVED,
        ownerHourlyCostMyr: ILLUSTRATIVE_OWNER_HOURLY_COST_MYR,
        laborCostAvoidedMyr: illustrative.laborCostAvoidedMyr,
        netVersusFlatMyr: illustrative.netVersusFlatMyr,
      },
      roadmapYearOneComparisons: ROADMAP_YEAR_ONE_COMPARISONS,
    })
  }
