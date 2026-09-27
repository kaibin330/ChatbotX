import { ORPCError } from "@orpc/server"
import { isCommunity } from "@/env"
import { withWorkspaceIdSchema } from "@/features/workspaces/schema/resource"
import { workspaceAuthorizedMidddleware } from "@/middlewares/auth"
import { authorizedAPI } from "@/orpc"
import { getOnePersonCompanySpikeSnapshot } from "../lib/get-spike-snapshot"
import { onePersonCompanySnapshotSchema } from "../schema/snapshot"

const privateGetOnePersonCompanySnapshotAPI = authorizedAPI
  .route({
    method: "GET",
    path: "/workspaces/{workspaceId}/one-person-company/snapshot",
    summary: "Track B spike snapshot for the one-person company dashboard",
    description:
      "Community Edition placeholder. Returns product-assumption pricing and unmeasured ROI fields. Does not charge and is not a billing integration.",
    tags: ["OnePersonCompany"],
  })
  .input(withWorkspaceIdSchema)
  .use(workspaceAuthorizedMidddleware, (input) => input.workspaceId)
  .output(onePersonCompanySnapshotSchema)
  .handler(() => {
    if (!isCommunity()) {
      throw new ORPCError("NOT_FOUND")
    }
    return getOnePersonCompanySpikeSnapshot()
  })

export const privateOnePersonCompanyAPI = {
  privateGetOnePersonCompanySnapshotAPI,
}
