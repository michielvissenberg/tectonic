# Issue 3: Customer Account Shell

GitHub issue: [#3 feat/frontend/customer-account-shell](https://github.com/michielvissenberg/tectonic/issues/3)

## Goal

Replace the placeholder settings screen with the first customer-facing KBC experience: a synthetic customer account and a believable Kate chat about a changed monthly mortgage payment.

## Depends On

None. This is the first implementation slice.

## User Flow

1. The customer opens the demo.
2. The customer sees their account context and mortgage information.
3. The customer reads the existing Kate conversation.
4. The customer sees a clear action to talk to a human.

## Acceptance Checks

- The settings form is gone from the first screen.
- Synthetic customer and mortgage account data are visible.
- The chat includes the customer's question about the changed monthly payment.
- Kate's messages feel like a natural conversation.
- A visible `Talk to a human` action is present.
- The initial state is ready for a live demo without data entry.
- No real customer data or external service is required.

## Implementation Boundary

Keep the first slice local and deterministic. Do not add persistence, API routes, authentication, or document integrations yet. Establish the state shape that later slices can extend with escalation and dossier data.

## Validation

- Load the web app and confirm the first screen renders the account and chat.
- Run the web typecheck.
