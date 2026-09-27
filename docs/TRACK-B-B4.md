# Track B phase B4 — flat pricing and One-Person Company dashboard

Community Edition spike for roadmap tasks 36–38 (checklist B15–B17): a flat-pricing subscription shape, a "One-Person Company" dashboard, and ROI widgets.

This document is a product and engineering note. The page and API that ship with it are placeholders. They do not create subscriptions, call a payment processor, or charge anyone.

## Product assumptions (from the 10X roadmap)

These numbers are copied from the Track B roadmap. They are not a price list this repository enforces.

| Figure | Value | How to treat it |
| --- | --- | --- |
| Flat monthly price | **RM 427 / month** | Product assumption. Shown on the spike dashboard. |
| Year-1 total called out on the roadmap | **RM 5,424** | Product assumption. **Not** equal to 427 × 12. |
| Annualized flat price | **RM 5,124** | Arithmetic only: 427 × 12. Shown beside the roadmap year-1 figure so the two are not silently merged. |
| Competitor year-1 totals | ManyChat ~RM 1,620, Wati ~RM 3,588, Respond.io ~RM 4,440, Mampu AI ~RM 4,788 | Approximate figures from the roadmap comparison matrix. Display only. |

A worked ROI example (also not live usage): 20 hours saved × RM 40/hour owner cost = RM 800 labor avoided − RM 427 flat = RM 373 net. The RM 40/hour rate is an illustration so the formula has inputs. It is not a roadmap price.

## Where billing and dashboards live today

Community Edition (`NEXT_PUBLIC_EDITION=community`) has usage limits and analytics. It does not have a subscription engine.

| Surface | Path | What it actually is |
| --- | --- | --- |
| Analytics dashboard | `apps/builder/src/app/space/[workspaceId]/dashboard/` | Contacts, conversations, and ads analytics. `/dashboard` redirects to contacts. Gated by the `analytics` workspace permission. |
| Quota / entitlements | `packages/business/src/user-quota/`, `packages/business/src/quota-enforcement/` | Limits (contacts, MAC, bot messages, seats, channels). The owner's `UserQuota` row is the pool. This is enforcement, not a priced plan. |
| Cloud billing seam | `packages/business/src/enterprise/billing/service.ts` | Best-effort `POST /portal/api/users/provision` when edition is `cloud`. Pricing stays in a private portal. **Out of scope — do not edit.** |
| Billing UI, upgrade dialog | `apps/builder/src/enterprise/features/billing/` | Commercial license. **Out of scope.** |
| Sample pricing page | `apps/builder/src/app/space/[workspaceId]/(enterprise)/pricing/page.tsx` | Demo table behind the enterprise layout, which `notFound()`s on community. **Out of scope.** |
| License gate | `docs/licensing.md`, `packages/business/src/enterprise/license/` | Community never verifies `LICENSE_KEY`. **Out of scope.** |

The spike dashboard is a sibling of the analytics pages:

`/space/{workspaceId}/dashboard/one-person-company`

It appears in the analytics nav only when `isCommunity()` is true. The private procedure below returns `NOT_FOUND` on enterprise and cloud editions.

## ROI widget fields

The snapshot contract is `onePersonCompanySnapshotSchema` in `apps/builder/src/features/one-person-company/schema/snapshot.ts`.

Measured fields (all `null` in this spike — the UI says "Not measured"):

| Field | Meaning when a later wire-up fills it |
| --- | --- |
| `hoursSaved` | Owner hours the workspace's automation avoided this period. |
| `ownerHourlyCostMyr` | Owner-supplied hourly cost used only for the ROI subtraction. |
| `conversationsHandled` | Conversations the workspace handled in the period. |
| `humanEscalations` | Conversations handed to a person. |
| `channelsInUse` | Channels connected for this workspace. |

Derived formula (implemented for the illustrative example only):

```text
laborCostAvoidedMyr = hoursSaved * ownerHourlyCostMyr
netVersusFlatMyr    = laborCostAvoidedMyr - flatMonthlyPriceMyr
```

Do not treat a null measured field as zero. Zero would look like a real empty month.

## How the One-Person Company dashboard plugs in later

Keep this chain. Do not grow it inside an enterprise directory.

1. **Page (exists).** `apps/builder/src/app/space/[workspaceId]/dashboard/one-person-company/page.tsx` already checks workspace membership and the `analytics` permission, then renders the banner and widgets.
2. **Private API (exists, mock).** `GET /workspaces/{workspaceId}/one-person-company/snapshot` is session-authenticated and workspace-scoped. It is not on `publicRouter`, so the CLI and MCP server do not expose it.
3. **Snapshot function (exists, mock).** `getOnePersonCompanySpikeSnapshot()` returns the product-assumption price and null ROI fields. Replace the body when real reads exist. Keep the zod output schema so the page and the procedure cannot drift.
4. **Future reads.** Conversation and channel counts already have community analytics services under `packages/analytics` and `@chatbotx.io/business`. A later change can pass those counts into the snapshot. Hours saved and owner hourly cost need an explicit product definition before they are stored.
5. **Future charge.** A payment provider, if one is chosen, gets its own community module with secrets only in server env — never `NEXT_PUBLIC_*`, never committed. This spike has no provider, no customer id, and no checkout URL. Flat price stays a constant until that module exists.
6. **Quota stays separate.** `UserQuota` remains the entitlement pool. A RM 427 plan must not be implemented by overloading quota counters or by writing through `billingService.provisionDefaultPlan`.

## What must stay out of enterprise and commercial paths

The root `LICENSE` puts `apps/builder/src/enterprise/` under the commercial license. `packages/database/src/schema/enterprise/LICENSE` does the same for that schema tree. Do not add B4 code under any of these:

- `apps/builder/src/enterprise/**`
- `apps/builder/src/app/admin/(enterprise)/**`
- `apps/builder/src/app/manage/(enterprise)/**`
- `apps/builder/src/app/space/[workspaceId]/(enterprise)/**`
- `packages/business/src/enterprise/**` (billing portal proxy, license verification, tenant commercial services)
- `packages/database/src/schema/enterprise/**`
- `packages/database/src/relations/enterprise/**`

Also out of scope for this spike: payment-processor API keys, webhook signature secrets, checkout sessions, invoices, and any call that moves money.

## Edition

Run this spike with `NEXT_PUBLIC_EDITION=community` (the builder default when the variable is unset). Setting `enterprise` or `cloud` hides the nav entry and the page, and the snapshot procedure responds as not found.
