# Issue 7: Helper Chat Confirmation

GitHub issue: [#7 feat/frontend/helper-chat-confirmation](https://github.com/michielvissenberg/tectonic/issues/7)

## Goal

Let the human helper confirm their understanding with the customer through the existing chat, using the escalation dossier as the starting point.

## Depends On

- [Issue 6: Customer-Service Workspace](./06-customer-service-workspace.md)

## User Flow

1. The helper opens the dossier.
2. The helper reviews the summary and source conversation.
3. The helper sends a confirmation message.
4. The customer sees the message without needing to repeat the issue.

## Acceptance Checks

- The helper chat is visible in the workspace.
- The helper can send a message to the customer.
- The default message is grounded in the dossier summary: “I understand your question as: your monthly mortgage payment changed and you want to know why. Is that correct?”
- The customer can see the helper's message.
- The message is clearly sent by a human helper, not Kate.
- The customer does not need to restate the full issue.
- Phone and voice support remain out of scope.

## Implementation Boundary

Use local chat state and the existing dossier as the message source. Do not implement real-time transport, phone support, agent assignment, or human-authentication flows.

## Validation

- Send the confirmation message from the worker view.
- Verify it appears in the customer chat.
- Verify the wording matches the dossier summary.
- Run the web typecheck.
