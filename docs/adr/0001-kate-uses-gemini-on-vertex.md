# 1. Kate uses Gemini on Vertex AI

Date: 2026-09-30

## Status

Accepted. Revises the PRD non-goal "External LLM or model hosting setup" for the Kate conversation.

## Context

The POC started with scripted Kate replies. A scripted Kate cannot show whether she can resolve the customer's problem herself or needs a human escalation, which is the heart of the demo.

## Decision

- Kate's replies in the Kate conversation come from Gemini on Vertex AI (express mode, authenticated with an API key).
- The call lives in the NestJS API (`POST /kate/reply`). The web app only sends the Kate conversation; the key never reaches the browser.
- The key is read from `VERTEX_API_KEY` in the uncommitted `apps/api/.env`. The model is configurable with `VERTEX_MODEL`.
- Kate is grounded in the synthetic source context and instructed not to invent account facts.
- If Gemini is unconfigured or fails, the API returns an error without request details and the web app shows a fallback reply.

## Consequences

- The demo needs network access and a Vertex API key to show live Kate replies.
- Replies are non-deterministic; the seeded opening conversation stays scripted so the demo still starts the same way.
- Later slices give Gemini a single action to start a human escalation (#15) and let Gemini write the escalation dossier (#16).
