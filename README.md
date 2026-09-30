# Kate Relay

The worst moment in banking is when a customer has explained their problem to a chatbot, gets passed to a human, and has to explain it all again. Instead of leaving the advisor with a blank screen, Kate Relay hands them the whole story so they can help right away.

This repository is a product and UX prototype for that handoff inside a KBC mobile banking experience. It shows how Kate can recognize when a complex request needs human judgment, preserve the conversation, and turn the available context into an escalation dossier for a customer-service worker.

## The problem: the amnesia barrier

Digital banking assistants like Kate handle high-volume, standardized transactions well. Complex life events are different. A mortgage application involving non-standard employment, incomplete paperwork, or a strict regulatory deadline can exceed what a rule-based automation should decide.

When the chatbot passes the customer to a human and the conversation resets to zero, everyone loses:

- **Customer frustration:** Customers repeat their story and chase missing paperwork across multiple messages.
- **Wasted advisor time:** Advisors dig through chat logs, reconstruct the question, and work out which documents matter before they can give expert advice.

## The solution: Kate Relay

Kate Relay turns the moment Kate gets stuck into a useful starting point for the advisor. In this prototype, the handoff has three parts:

1. **Summarize the situation.** The generated dossier captures what the customer wants, why Kate needs help, the unresolved question, what Kate already checked, and a suggested first action. Key application facts and deadlines stay visible alongside the summary.
2. **Identify the relevant paperwork.** The dossier is grounded in the synthetic documents already attached to the mortgage application. Gemini selects the documents relevant to this specific question and explains why each one matters, so the advisor does not have to inspect every file from scratch.
3. **Compile one advisor-ready view.** The customer context, source Kate conversation, generated summary, application facts, relevant documents, and helper reply composer arrive together in the customer-service workspace.

The demo uses a realistic mortgage scenario: Laura Peeters and her partner Thomas De Smet are applying for a EUR 305,000 loan for a house at Parklaan 14 in Leuven. Their loan condition expires on 18 October 2026, and Laura's company has only two years of annual accounts. Kate cannot decide whether the application will be approved in time, so it starts a human escalation instead of pretending to resolve the question.

## What is built

- A customer view with a KBC-style mortgage application and Kate chat drawer.
- Kate replies through the NestJS API and can invoke a human handoff when the question is outside her context or the customer asks for help.
- A customer-facing status that confirms the request is in human review and makes clear that the customer does not need to repeat the story.
- A customer-service workspace with an escalation dossier containing the generated summary, unresolved question, source conversation, account context, suggested first action, and linked documents.
- Gemini-powered dossier generation grounded in the synthetic PDF files in `documents/`, with a deterministic fallback when the model is unavailable.
- A helper chat composer for the advisor to send a confirmation back to the customer.

## Demo flow

The guided demo is designed to fit comfortably inside a sub-three-minute walkthrough:

1. Open the customer view and open Kate.
2. Ask whether the mortgage can be approved before the 18 October loan condition expires, or trigger the human handoff directly.
3. Confirm that the customer sees the human-review status without having to start over.
4. Switch to the customer-service workspace and open Laura's escalation dossier.
5. Review the generated summary, source conversation, application facts, and relevant documents.
6. Send the helper confirmation message back to the customer.

## Scope and trust choices

All customer data in this repo is synthetic and fictional. Names, balances, mortgage terms, dates, account numbers, and documents are example data. The project does not connect to a live banking system, real document store, or external identity provider.

The prototype keeps the customer and advisor experiences separate:

- The customer-facing status says the case is under human review.
- The internal dossier is labeled internal and includes the source conversation for validation.
- The generated summary does not claim that Kate resolved the issue.
- Phone support, voice assistance, document upload/retrieval from live systems, and automated mortgage approval are out of scope.

## Current limitations

This is a local prototype rather than a production banking workflow:

- no real-time multi-user chat transport;
- no persistence beyond browser-local state;
- no real document indexing, retrieval, or customer-side paperwork collection;
- no real customer authentication or case-management system;
- no phone or voice support implementation.

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
