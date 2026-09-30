# Issue 4: Kate Human Request

GitHub issue: [#4 feat/frontend/kate-human-request](https://github.com/michielvissenberg/tectonic/issues/4)

## Goal

Let the customer explicitly ask for a human during the Kate conversation. Kate should explain that she cannot handle the document-specific mortgage question and will send the conversation and a summary so the customer does not lose time.

## Depends On

- [Issue 3: Customer Account Shell](./03-customer-account-shell.md)

## User Flow

1. The customer clicks `Talk to a human`.
2. The conversation enters an escalation state.
3. Kate explains what she is doing.
4. The customer sees that the request was sent to customer service.

## Acceptance Checks

- The action is available from the Kate chat.
- Clicking it changes the visible conversation state.
- Kate says she cannot handle the document-specific question.
- Kate says she will send the conversation and summary to a human helper.
- The customer sees a clear sent confirmation.
- The interaction is local state only and does not require backend setup.
- The action cannot create duplicate visible escalation messages from accidental repeated clicks.

## Implementation Boundary

Add only the escalation transition and customer-facing copy. The full dossier content belongs to Issue 5. Use a single seeded customer and a single mortgage conversation.

## Validation

- Click `Talk to a human` and verify the expected messages and state change.
- Refresh and confirm the intended demo-start behavior.
- Run the web typecheck.
