import { getIdFromParams } from "@chatbotx.io/utils"
import { notFound } from "next/navigation"
import { isCommunity } from "@/env"
import { AnalyticsNav } from "@/features/analytics/components/analytics-nav"
import { resolveAdsDashboardChannels } from "@/features/analytics/lib/ads-dashboard-channels"
import { OnePersonCompanyDashboard } from "@/features/one-person-company/components/one-person-company-dashboard"
import { getOnePersonCompanySpikeSnapshot } from "@/features/one-person-company/lib/get-spike-snapshot"
import { hasWorkspacePermission } from "@/lib/auth/permission-routes"
import { getCurrentUserAndTargetWorkspace } from "@/lib/auth/utils"

export default async function OnePersonCompanyPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>
}) {
  const workspaceId = getIdFromParams(await params, "workspaceId")
  if (!workspaceId) {
    return notFound()
  }

  const userAndWorkspace = await getCurrentUserAndTargetWorkspace(workspaceId)
  if (
    !(
      userAndWorkspace &&
      hasWorkspacePermission(
        userAndWorkspace.targetWorkspaceMember.permissions,
        "analytics",
      )
    )
  ) {
    return notFound()
  }

  if (!isCommunity()) {
    return notFound()
  }

  const isSuperAdmin = hasWorkspacePermission(
    userAndWorkspace.targetWorkspaceMember.permissions,
    "superAdmin",
  )
  const adsChannels = await resolveAdsDashboardChannels({
    workspaceId,
    isSuperAdmin,
  })

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      <AnalyticsNav adsChannels={adsChannels} />
      <OnePersonCompanyDashboard
        snapshot={getOnePersonCompanySpikeSnapshot()}
      />
    </div>
  )
}
