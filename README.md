# Tectonic

Tectonic is a demo environment for a customer-service workflow around an AI assistant in a KBC mobile banking app. The project explores how a banking assistant can triage a mortgage question, package the relevant context into a dossier, and hand the case to a human specialist without implying the bot solved the issue on its own.

## KBC problem story

The experience is intentionally framed around a realistic but synthetic mortgage support scenario:

- Laura Peeters and her partner Thomas De Smet signed a compromis for a house at Parklaan 14 in Leuven and applied for a EUR 305,000 home loan.
- The compromis only holds until 18 October 2026 if the loan is refused, and Laura's company has only two years of annual accounts. Laura asks Kate whether the loan will be approved in time.
- Kate can see the application and the titles of the uploaded documents, but not their contents, and she cannot judge approval. She starts a human escalation.
- Gemini reads the uploaded documents in `documents/` and writes the escalation dossier: the complication, the unresolved question, and only the documents that matter, each with the facts that make it relevant.
- The specialist reviews the dossier and sends a confirmation message back to the customer without requiring them to re-explain the problem.

This is a product and UX prototype, not a production banking workflow.

## Demo flow

The guided demo is designed to fit comfortably inside a sub-three-minute walkthrough:

1. Open the customer view and click the Kate drawer.
2. Ask Kate whether the loan will be approved before the 18 October loan condition expires, or trigger the human handoff.
3. Confirm the customer-facing status message: the request is in human review.
4. Switch to the customer service workspace and open the escalation dossier.
5. Review the generated summary, source conversation, application facts, and linked documents.
6. Send the helper confirmation message back to the customer.

## Synthetic-data boundary

All customer data in this repo is synthetic and fictional.

- Names, balances, mortgage terms, and date values are example data.
- No real customer records, private account numbers, or production secrets are used.
- The project does not connect to a live banking system, real document store, or external identity provider.

## Security and trust choices

This repository deliberately stays on the safe side of trust/confusion boundaries:

- The customer-facing status clearly says the case is under human review.
- The internal dossier is labeled as internal and remains separate from the customer-facing message flow.
- The generated summary does not claim that Kate resolved the issue.
- The source conversation is preserved beside the summary so the human reviewer can validate the context.
- Phone support and voice assistance are explicitly left out of scope.

## Scale story and product vision

The mock-up is meant to illustrate a scalable escalation pattern for digital banking support:

- common account questions can be answered by an assistant;
- document-heavy or ambiguous questions can be escalated with context preserved;
- human agents receive a summarized dossier instead of starting from zero;
- the assistant remains an assistant, not a system that pretends it solved the issue alone.

This keeps the demo believable without over-claiming enterprise readiness or real customer data handling.

## Current limitations

This project is intentionally limited to a local prototype experience:

- no real-time multi-user chat transport;
- no persistence beyond browser-local state;
- no real document indexing or retrieval;
- no real customer authentication or case management system;
- no phone or voice support implementation.

Phone support is future work, not part of the current demo.

## Local development

Prerequisites: Node.js 20+, pnpm 10+, and Docker.

From the repository root, run:

```sh
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:setup
pnpm dev
```

`pnpm db:setup` starts the local PostgreSQL database, runs migrations, and generates the Prisma client.

Kate replies with Gemini on Vertex AI. Put your own Vertex API key in `VERTEX_API_KEY` in `apps/api/.env` (the file is gitignored; never commit the key). The key stays in the API and never reaches the browser. Without a key, Kate shows a fallback message. `VERTEX_MODEL` picks the Gemini model.

Useful database commands:

```sh
pnpm db:up       # Start PostgreSQL
pnpm db:down     # Stop PostgreSQL and keep its data
pnpm db:status   # Show container status
pnpm db:logs     # Follow PostgreSQL logs
pnpm db:studio   # Open Prisma Studio
pnpm db:reset    # Stop PostgreSQL and delete its data
```

Open:

- Web app: http://localhost:3000
- API: http://localhost:3001
- Swagger UI: http://localhost:3001/docs

Stop the development servers with `Ctrl+C`.

The workspace contains:

- `apps/api`: NestJS API, Swagger, and Prisma schema
- `apps/web`: Next.js frontend
- `packages/sdk`: typed OpenAPI client
