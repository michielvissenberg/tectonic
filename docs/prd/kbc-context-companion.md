# KBC Context Companion

## Problem

When Kate cannot solve a customer conversation, the customer has to explain the situation again to a human agent. The agent then spends valuable time searching through the customer's account, conversation history, and financial documents before they can help.

KBC needs a handoff that preserves the customer's context and gets the human agent ready to help immediately.

## Product Idea

Build a proof of concept for a **Kate-to-human escalation dossier**. When Kate reaches the limit of what she can safely resolve, she offers a transfer. The system then:

1. Summarizes the Kate conversation.
2. Identifies the customer's actual question and what remains unresolved.
3. Preserves the relevant customer and account context.
4. Links the financial documents relevant to the case.
5. Saves the dossier to the customer's account and makes it available to customer service.
6. Gives the human agent a concise starting point so the customer does not need to repeat themselves.

The customer, Kate, and the agent all work from the same escalation record.

## Hackathon Scope

The POC uses synthetic, seeded data and deterministic rules. It does not attempt to connect to real banking systems or train a production AI model.

### Primary demo scenario

A customer has a natural chat conversation with Kate about why their monthly mortgage payment changed. Kate cannot handle the document-specific question, so the customer asks to speak to a human. The system immediately creates an escalation dossier containing the conversation summary, the unresolved question, relevant account context, and links to the customer's mortgage agreement, repayment schedule, and latest monthly statement.

### Required experience

The first screen must show a believable Kate conversation. The customer must be able to request human help when Kate cannot answer. After escalation, show:

- A saved escalation status and timestamp
- A concise conversation summary
- The customer's explicit question
- What Kate tried and why it was insufficient
- The customer's relevant account context
- Links to the mortgage agreement, repayment schedule, and latest monthly statement
- A structured agent handoff
- A helper chat that confirms the summary with the customer

The customer-facing flow should make it clear that the conversation and summary were sent to a human so the customer does not lose time repeating the story.

The agent workspace is chat-first. It should show the dossier summary and source transcript on the left, the customer's account and dossier context in the middle, and the helper's chat with the customer on the right.

## Escalation Dossier Contract

The core dossier should contain:

- Customer label and synthetic identifier
- Conversation transcript or selected conversation messages
- Conversation summary
- Customer's explicit question or requested outcome
- Unresolved issue
- What Kate already checked or explained
- Relevant account context
- Linked financial documents, each with a title, type, date, and reason it is relevant
- Suggested first action for the agent
- Created timestamp and escalation status

The dossier is generated immediately when the customer requests a human. For the POC, it may be generated deterministically from a seeded conversation and kept in local state. The important behavior is that it is saved as a reusable internal account record and rendered in the agent workspace.

## Non-Goals

- Real customer data
- Real banking, payment, or document integrations
- Building a general-purpose banking assistant
- Solving the customer's financial issue automatically when human help is needed
- External LLM or model hosting setup
- Production-grade summarization or model training
- Arbitrary customer lookup
- Complex permissions or account administration
- Database migrations unless persistence is already trivial

## Success Criteria

The demo succeeds when a judge can see that:

1. Kate recognizes that she cannot safely or usefully finish the conversation.
2. The customer can request human help without starting over.
3. A dossier is automatically summarized and saved to the customer's account.
4. The dossier links the financial documents relevant to the specific question.
5. The human helper can see both the summary and source conversation immediately.
6. The helper can send “I understand your question as: [summary]. Is that correct?” in the chat.
7. The same dossier can support a scalable handoff across Kate, the customer account, and customer service.

## Security and Trust

- Use only synthetic data.
- Do not commit keys, passwords, or private customer information.
- Avoid endpoints that expose arbitrary customer records.
- Clearly label generated summaries and preserve links to source conversation messages and documents.
- Do not make the dossier claim that Kate solved an issue when she did not.
- Make document access explicit and scoped to the selected synthetic customer.
- Do not let the customer edit the generated dossier in the POC; helper correction is future work.
- Document that the POC is not connected to production banking systems.

## Three-Hour Delivery Plan

### 0:00-0:30: Conversation and dossier shape

Define the seeded mortgage conversation, immediate escalation action, dossier fields, and three relevant synthetic financial documents.

### 0:30-1:30: Kate escalation flow

Build the natural chat conversation, the “talk to a human” action, Kate's summary promise, and deterministic dossier generation.

### 1:30-2:00: Agent dossier view

Build the three-column helper workspace with summary and source transcript, customer account and linked documents, and the helper chat.

### 2:00-2:20: Persistence and polish

Show the dossier as saved in the customer's account, add the “Sent to customer service” and “Waiting for a customer-service worker” statuses, and make Kate's confirmation clear.

### 2:20-2:45: README and security review

Document setup, the KBC problem, the demo flow, synthetic-data boundary, scale story, and unfinished work.

### 2:45-3:00: Rehearse and verify

Run typecheck, lint, and build as time allows. Test the primary scenario, secondary scenario, fallback state, and Kate-to-agent handoff. Record a demo shorter than three minutes.

## Demo Script

1. Introduce the problem: customers lose time repeating themselves when Kate hands them to a human.
2. Show the natural customer conversation about a changed monthly mortgage payment.
3. Show the customer asking for a human and Kate replying that she will send the conversation and summary so they do not lose time.
4. Show the dossier immediately saved to the customer account with its status.
5. Open the chat-first customer-service workspace.
6. Show the summary, source transcript, account context, and three linked mortgage documents.
7. Have the helper send: “I understand your question as: your monthly mortgage payment changed and you want to know why. Is that correct?”
8. Close with the scale story: one secure escalation dossier connects Kate, the customer account, and customer service while preserving source context.

## Future Direction

The production path could make the escalation dossier a secure account record with consented access for customer service. It would require stronger identity controls, document-level authorization, privacy governance, retention rules, audit trails, summary evaluation, human correction, and channel-specific permissions before handling real customer data. Phone support can consume the same dossier later, but is outside this POC.
