# Issue 5: Escalation Dossier

GitHub issue: [#5 feat/frontend/escalation-dossier](https://github.com/michielvissenberg/tectonic/issues/5)

## Goal

Generate and save an internal escalation dossier immediately when the customer requests human help.

## Depends On

- [Issue 4: Kate Human Request](./04-kate-human-request.md)

## Dossier Contents

- Synthetic customer identity
- Source Kate conversation
- Generated conversation summary
- Explicit unresolved question
- Relevant mortgage account context
- Mortgage agreement
- Repayment schedule
- Latest monthly statement
- Relevance reason for every linked document
- Created timestamp
- Escalation status

## Acceptance Checks

- The dossier is created immediately after the human-help request.
- It belongs to the selected synthetic customer account.
- The source conversation remains available beside the summary.
- The summary is visibly labeled as generated.
- The unresolved question is the changed monthly mortgage payment.
- The three mortgage documents are linked and visibly relevant.
- The customer sees only the intended sent/waiting status, not internal dossier details.
- The customer cannot edit the dossier.
- The data is deterministic and local; no real banking integration is needed.

## Implementation Boundary

Prefer a typed local dossier object and local UI state. Do not add Prisma migrations, arbitrary customer lookup, authentication, or LLM setup for this slice.

## Validation

- Request a human and inspect the generated dossier.
- Verify all three document links and relevance reasons.
- Verify duplicate requests do not create conflicting dossier state.
- Run the web typecheck.
