import z from "zod"
import {
  ANNUALIZED_FLAT_PRICE_MYR,
  FLAT_MONTHLY_PRICE_MYR,
  ILLUSTRATIVE_HOURS_SAVED,
  ILLUSTRATIVE_OWNER_HOURLY_COST_MYR,
  ROADMAP_YEAR_ONE_COMPARISON_IDS,
  ROADMAP_YEAR_ONE_COST_MYR,
} from "../lib/flat-pricing"

const nullableCount = z.number().int().nonnegative().nullable()

/**
 * ROI inputs a later billing wire-up can fill. Null means "not measured".
 * Callers must not coerce null to 0.
 */
export const roiWidgetFieldsSchema = z.object({
  hoursSaved: nullableCount,
  ownerHourlyCostMyr: nullableCount,
  conversationsHandled: nullableCount,
  humanEscalations: nullableCount,
  channelsInUse: nullableCount,
})

export type RoiWidgetField = keyof z.infer<typeof roiWidgetFieldsSchema>

export const ROI_WIDGET_FIELDS = [
  "hoursSaved",
  "ownerHourlyCostMyr",
  "conversationsHandled",
  "humanEscalations",
  "channelsInUse",
] as const satisfies readonly RoiWidgetField[]

export const onePersonCompanySnapshotSchema = z.object({
  kind: z.literal("track-b-b4-spike"),
  billingStatus: z.literal("not-subscribed"),
  currency: z.literal("MYR"),
  flatMonthlyPriceMyr: z.literal(FLAT_MONTHLY_PRICE_MYR),
  annualizedFlatPriceMyr: z.literal(ANNUALIZED_FLAT_PRICE_MYR),
  roadmapYearOneCostMyr: z.literal(ROADMAP_YEAR_ONE_COST_MYR),
  roi: roiWidgetFieldsSchema,
  illustrativeExample: z.object({
    labeledAs: z.literal("illustrative-not-live"),
    hoursSaved: z.literal(ILLUSTRATIVE_HOURS_SAVED),
    ownerHourlyCostMyr: z.literal(ILLUSTRATIVE_OWNER_HOURLY_COST_MYR),
    laborCostAvoidedMyr: z.number().int(),
    netVersusFlatMyr: z.number().int(),
  }),
  roadmapYearOneComparisons: z
    .array(
      z.object({
        id: z.enum(ROADMAP_YEAR_ONE_COMPARISON_IDS),
        amountMyr: z.number().int().positive(),
        source: z.literal("roadmap-assumption"),
      }),
    )
    .length(ROADMAP_YEAR_ONE_COMPARISON_IDS.length),
})

export type OnePersonCompanySnapshot = z.infer<
  typeof onePersonCompanySnapshotSchema
>
