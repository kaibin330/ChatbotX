import { describe, expect, test } from "vitest"
import {
  ANNUALIZED_FLAT_PRICE_MYR,
  FLAT_MONTHLY_PRICE_MYR,
  illustrativeLaborRoi,
  ROADMAP_YEAR_ONE_COST_MYR,
} from "../flat-pricing"
import { getOnePersonCompanySpikeSnapshot } from "../get-spike-snapshot"

describe("getOnePersonCompanySpikeSnapshot", () => {
  test("returns the roadmap flat price without a subscription", () => {
    const snapshot = getOnePersonCompanySpikeSnapshot()

    expect(snapshot.kind).toBe("track-b-b4-spike")
    expect(snapshot.billingStatus).toBe("not-subscribed")
    expect(snapshot.currency).toBe("MYR")
    expect(snapshot.flatMonthlyPriceMyr).toBe(427)
    expect(snapshot.flatMonthlyPriceMyr).toBe(FLAT_MONTHLY_PRICE_MYR)
    expect(snapshot.annualizedFlatPriceMyr).toBe(ANNUALIZED_FLAT_PRICE_MYR)
    expect(FLAT_MONTHLY_PRICE_MYR * 12).toBe(ANNUALIZED_FLAT_PRICE_MYR)
    expect(snapshot.roadmapYearOneCostMyr).toBe(5424)
    expect(snapshot.roadmapYearOneCostMyr).toBe(ROADMAP_YEAR_ONE_COST_MYR)
    expect(snapshot.annualizedFlatPriceMyr).not.toBe(
      snapshot.roadmapYearOneCostMyr,
    )
  })

  test("leaves measured ROI fields unmeasured", () => {
    const snapshot = getOnePersonCompanySpikeSnapshot()

    expect(snapshot.roi).toEqual({
      hoursSaved: null,
      ownerHourlyCostMyr: null,
      conversationsHandled: null,
      humanEscalations: null,
      channelsInUse: null,
    })
  })

  test("labels the worked example and applies labor minus flat price", () => {
    const snapshot = getOnePersonCompanySpikeSnapshot()
    const roi = illustrativeLaborRoi({
      hoursSaved: 20,
      ownerHourlyCostMyr: 40,
      flatMonthlyPriceMyr: FLAT_MONTHLY_PRICE_MYR,
    })

    expect(roi).toEqual({
      laborCostAvoidedMyr: 800,
      netVersusFlatMyr: 373,
    })
    expect(snapshot.illustrativeExample).toEqual({
      labeledAs: "illustrative-not-live",
      hoursSaved: 20,
      ownerHourlyCostMyr: 40,
      laborCostAvoidedMyr: 800,
      netVersusFlatMyr: 373,
    })
  })

  test("lists roadmap year-1 comparison assumptions including RM 5424", () => {
    const snapshot = getOnePersonCompanySpikeSnapshot()

    expect(
      snapshot.roadmapYearOneComparisons.map((row) => row.amountMyr),
    ).toEqual([5424, 1620, 3588, 4440, 4788])
    expect(
      snapshot.roadmapYearOneComparisons.every(
        (row) => row.source === "roadmap-assumption",
      ),
    ).toBe(true)
  })
})
