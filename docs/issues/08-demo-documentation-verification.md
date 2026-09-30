# Issue 8: Demo Documentation and Verification

GitHub issue: [#8 chore/demo-documentation-verification](https://github.com/michielvissenberg/tectonic/issues/8)

## Goal

Polish and verify the complete KBC escalation-dossier journey so it is trustworthy, documented, and ready for a sub-three-minute hackathon demo.

## Depends On

- [Issue 7: Helper Chat Confirmation](./07-helper-chat-confirmation.md)

## Acceptance Checks

- The complete flow works from Kate chat through human escalation and helper confirmation.
- The source conversation remains visible beside the generated summary.
- The three mortgage document links are visibly relevant.
- Only synthetic data is used.
- The UI never implies that Kate solved the issue.
- Customer-facing status is distinct from internal dossier content.
- The README documents the KBC problem, demo flow, synthetic-data boundary, security choices, scale story, and limitations.
- Phone support is documented as future work, not presented as implemented.
- Web typecheck, lint, and build pass.
- The demo can be completed in under three minutes.

## Implementation Boundary

Fix only issues that prevent the planned demo or introduce trust/security confusion. Avoid unrelated refactors, real integrations, and production persistence.

## Validation

- Rehearse the full customer-to-helper flow from a clean start.
- Run the repository's typecheck, lint, and build commands.
- Check the repository for secrets or private customer data.
- Confirm the final UI works at the demo viewport.
