import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@chatbotx.io/ui/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@chatbotx.io/ui/components/ui/card"
import { InfoIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import type { RoadmapYearOneComparisonId } from "../lib/flat-pricing"
import {
  type OnePersonCompanySnapshot,
  ROI_WIDGET_FIELDS,
  type RoiWidgetField,
} from "../schema/snapshot"

// Declared relative to the `onePersonCompany` namespace. The source-key scan
// prepends that namespace, so these stay in sync with the maps below.
// i18n-check t('comparison.tenX')
// i18n-check t('comparison.manychat')
// i18n-check t('comparison.wati')
// i18n-check t('comparison.respondIo')
// i18n-check t('comparison.mampuAi')
// i18n-check t('hoursSaved')
// i18n-check t('ownerHourlyCost')
// i18n-check t('conversationsHandled')
// i18n-check t('humanEscalations')
// i18n-check t('channelsInUse')
const comparisonLabelKey = {
  tenX: "comparison.tenX",
  manychat: "comparison.manychat",
  wati: "comparison.wati",
  respondIo: "comparison.respondIo",
  mampuAi: "comparison.mampuAi",
} as const satisfies Record<RoadmapYearOneComparisonId, string>

const roiFieldLabelKey = {
  hoursSaved: "hoursSaved",
  ownerHourlyCostMyr: "ownerHourlyCost",
  conversationsHandled: "conversationsHandled",
  humanEscalations: "humanEscalations",
  channelsInUse: "channelsInUse",
} as const satisfies Record<RoiWidgetField, string>

type OnePersonCompanyDashboardProps = {
  snapshot: OnePersonCompanySnapshot
}

export const OnePersonCompanyDashboard = async ({
  snapshot,
}: OnePersonCompanyDashboardProps) => {
  const t = await getTranslations("onePersonCompany")
  const example = snapshot.illustrativeExample

  return (
    <section
      aria-labelledby="one-person-company-title"
      className="flex min-w-0 flex-1 flex-col gap-4"
    >
      <Alert className="border-amber-500/40 bg-amber-500/5" variant="warning">
        <InfoIcon />
        <AlertTitle>{t("bannerTitle")}</AlertTitle>
        <AlertDescription>{t("bannerDescription")}</AlertDescription>
      </Alert>

      <header className="flex flex-col gap-1">
        <h1 className="font-semibold text-xl" id="one-person-company-title">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t("planTitle")}</CardTitle>
          <CardDescription>{t("planStatus")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p className="font-medium text-base">
            {t("planPrice", { amount: snapshot.flatMonthlyPriceMyr })}
          </p>
          <p className="text-muted-foreground">{t("planAssumption")}</p>
          <p>{t("annualized", { amount: snapshot.annualizedFlatPriceMyr })}</p>
          <p>
            {t("roadmapYearOne", { amount: snapshot.roadmapYearOneCostMyr })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("roiTitle")}</CardTitle>
          <CardDescription>{t("roiDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ROI_WIDGET_FIELDS.map((field) => {
              const value = snapshot.roi[field]
              let display = t("notMeasured")
              if (value !== null && field === "ownerHourlyCostMyr") {
                display = t("amountMyr", { amount: value })
              }
              if (value !== null && field !== "ownerHourlyCostMyr") {
                display = String(value)
              }
              return (
                <div className="flex flex-col gap-1" key={field}>
                  <dt className="text-muted-foreground text-sm">
                    {t(roiFieldLabelKey[field])}
                  </dt>
                  <dd className="font-medium">{display}</dd>
                </div>
              )
            })}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("exampleTitle")}</CardTitle>
          <CardDescription>{t("exampleNote")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {t("exampleMath", {
              hours: example.hoursSaved,
              rate: example.ownerHourlyCostMyr,
              avoided: example.laborCostAvoidedMyr,
              flat: snapshot.flatMonthlyPriceMyr,
              net: example.netVersusFlatMyr,
            })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("comparisonTitle")}</CardTitle>
          <CardDescription>{t("comparisonNote")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {snapshot.roadmapYearOneComparisons.map((row) => (
              <li
                className="flex items-center justify-between gap-4 text-sm"
                key={row.id}
              >
                <span>{t(comparisonLabelKey[row.id])}</span>
                <span className="font-medium">
                  {t("amountMyr", { amount: row.amountMyr })}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
