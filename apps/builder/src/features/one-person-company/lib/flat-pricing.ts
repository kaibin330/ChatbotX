/**
 * Track B product assumptions. These constants are display inputs for the
 * community spike. They are not a charged price and are not read from a
 * payment processor.
 */

/** Roadmap flat price, Malaysian ringgit per month. */
export const FLAT_MONTHLY_PRICE_MYR = 427

/** 427 × 12. Kept separate from the roadmap's year-1 total of 5,424. */
export const ANNUALIZED_FLAT_PRICE_MYR = 5124

/**
 * Year-1 total printed on the Track B roadmap.
 * 427 × 12 is 5,124, so this figure is not the annualized flat price.
 */
export const ROADMAP_YEAR_ONE_COST_MYR = 5424

/** Worked-example inputs. Not workspace usage and not a published wage. */
export const ILLUSTRATIVE_HOURS_SAVED = 20
export const ILLUSTRATIVE_OWNER_HOURLY_COST_MYR = 40

export const ROADMAP_YEAR_ONE_COMPARISON_IDS = [
  "tenX",
  "manychat",
  "wati",
  "respondIo",
  "mampuAi",
] as const

export type RoadmapYearOneComparisonId =
  (typeof ROADMAP_YEAR_ONE_COMPARISON_IDS)[number]

export type RoadmapYearOneComparison = {
  id: RoadmapYearOneComparisonId
  amountMyr: number
  source: "roadmap-assumption"
}

/** Approximate competitor year-1 totals from the roadmap matrix, plus 10X. */
export const ROADMAP_YEAR_ONE_COMPARISONS = [
  {
    id: "tenX",
    amountMyr: ROADMAP_YEAR_ONE_COST_MYR,
    source: "roadmap-assumption",
  },
  { id: "manychat", amountMyr: 1620, source: "roadmap-assumption" },
  { id: "wati", amountMyr: 3588, source: "roadmap-assumption" },
  { id: "respondIo", amountMyr: 4440, source: "roadmap-assumption" },
  { id: "mampuAi", amountMyr: 4788, source: "roadmap-assumption" },
] as const satisfies readonly RoadmapYearOneComparison[]

type IllustrativeLaborRoiInput = {
  hoursSaved: number
  ownerHourlyCostMyr: number
  flatMonthlyPriceMyr: number
}

export type IllustrativeLaborRoi = {
  laborCostAvoidedMyr: number
  netVersusFlatMyr: number
}

/** labor avoided − flat monthly price. Used only for the labeled example. */
export const illustrativeLaborRoi = (
  input: IllustrativeLaborRoiInput,
): IllustrativeLaborRoi => {
  const laborCostAvoidedMyr = input.hoursSaved * input.ownerHourlyCostMyr
  return {
    laborCostAvoidedMyr,
    netVersusFlatMyr: laborCostAvoidedMyr - input.flatMonthlyPriceMyr,
  }
}
