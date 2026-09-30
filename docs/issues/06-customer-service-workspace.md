# Issue 6: Customer-Service Workspace

GitHub issue: [#6 feat/frontend/customer-service-workspace](https://github.com/michielvissenberg/tectonic/issues/6)

## Goal

Give a customer-service worker a chat-first workspace where they can open the selected customer account and quickly understand the saved escalation dossier.

## Depends On

- [Issue 5: Escalation Dossier](./05-escalation-dossier.md)

## Layout

- Left: generated summary and source Kate conversation
- Middle: customer account context and linked mortgage documents
- Right: helper chat area

## Acceptance Checks

- The customer-service view is reachable from the demo.
- The worker can open the dossier from the selected customer account.
- The generated summary and source conversation are both visible.
- The customer account and dossier status are visible.
- The mortgage agreement, repayment schedule, and latest statement can be inspected.
- The right-side helper chat area is ready for Issue 7.
- The UI does not expose arbitrary customer records.
- The layout remains usable at the target demo viewport.

## Implementation Boundary

Use the dossier already created by Issue 5. Do not create a second dossier model or a second source of truth. A view switch or clearly labeled agent mode is sufficient for the POC.

## Validation

- Escalate from the customer view, switch to the worker view, and open the same dossier.
- Confirm the summary, transcript, account context, and documents agree.
- Test the layout at desktop and a narrower viewport.
- Run the web typecheck.
