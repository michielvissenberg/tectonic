'use client';

import { type FormEvent, useRef, useState } from 'react';
import { createSdkClient } from '@tectonic/sdk';

const api = createSdkClient(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001');
const kateFallbackReply = 'Sorry, I can\'t reply right now. Please try again in a moment, or ask to talk to a human.';

const currentTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

type EscalationRequest = {
  summary: 'requested';
  dossier: EscalationDossier;
};

type ChatMessage = {
  role: 'customer' | 'kate' | 'human';
  text: string;
  time: string;
};

type DossierDocument = {
  title: string;
  type: string;
  date: string;
  relevance: string;
};

type EscalationDossier = {
  customer: string;
  account: string;
  createdAt: string;
  status: 'sent';
  generatedSummary: string;
  unresolvedQuestion: string;
  sourceConversation: ChatMessage[];
  accountContext: {
    balance: string;
    monthlyPayment: string;
    paymentChange: string;
    nextPayment: string;
  };
  documents: DossierDocument[];
};

const initialConversation: ChatMessage[] = [
  { role: 'customer', text: 'Hi Kate, I noticed my monthly mortgage payment is higher this month. Can you tell me why it changed?', time: '09:41' },
  { role: 'kate', text: 'Hi Sophie, of course. I\'ve had a look at your home loan. Your interest rate was adjusted at the start of this month, which changed the monthly payment from € 1,230.25 to € 1,248.67.', time: '09:42' },
  { role: 'customer', text: 'Okay, that makes sense. Is this a permanent change?', time: '09:43' },
  { role: 'kate', text: 'Yes, the new rate applies for the rest of your current rate period. Your next payment will be collected on 3 October. I can also show you the full payment breakdown if that would be useful.', time: '09:44' },
];

const buttonHandoffMessage = 'Of course. I’ll ask a human teammate to help.';
const humanJoiningMessage = 'A human helper will join this chat shortly, so you won’t need to repeat what happened.';

const helperConfirmationTemplate = 'I understand your question as: your monthly mortgage payment changed and you want to know why. Is that correct?';

const createEscalationDossier = (sourceConversation: ChatMessage[]): EscalationDossier => ({
  customer: 'Sophie Vermeulen',
  account: 'Home loan •••• 1098',
  createdAt: `30 September 2026, ${currentTime()}`,
  status: 'sent',
  generatedSummary: 'Sophie is asking why her monthly mortgage payment increased from EUR 1,230.25 to EUR 1,248.67. Kate explained that the interest rate was adjusted at the start of September, but Sophie needs a human to confirm the detailed payment change and whether it is permanent.',
  unresolvedQuestion: 'Why did my monthly mortgage payment change, and is the new amount permanent?',
  sourceConversation,
  accountContext: {
    balance: 'EUR 238,450.12',
    monthlyPayment: 'EUR 1,248.67',
    paymentChange: '+ EUR 18.42 this month',
    nextPayment: '03 October 2026',
  },
  documents: [
    { title: 'Mortgage agreement', type: 'Agreement', date: '12 June 2018', relevance: 'Confirms the rate period and payment terms for this home loan.' },
    { title: 'Repayment schedule', type: 'Schedule', date: '01 September 2026', relevance: 'Shows the updated monthly amount and future payment breakdown.' },
    { title: 'Latest monthly statement', type: 'Statement', date: '30 September 2026', relevance: 'Shows the first statement containing the EUR 18.42 payment increase.' },
  ],
});

export default function HomePage() {
  const [kateOpen, setKateOpen] = useState(true);
  const [escalationRequest, setEscalationRequest] = useState<EscalationRequest | null>(null);
  const [serviceView, setServiceView] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState('');
  const [sentMessages, setSentMessages] = useState<ChatMessage[]>(initialConversation);
  const [kateReplying, setKateReplying] = useState(false);
  const [helperDraft, setHelperDraft] = useState(helperConfirmationTemplate);
  const [helperMessages, setHelperMessages] = useState<ChatMessage[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  // Guards the single human escalation per Kate conversation, even while a Kate reply is still pending.
  const escalated = useRef(false);

  // The one escalation path, shared by the "Talk to a human" button and Kate's escalation action.
  const escalate = (conversation: ChatMessage[], handoffMessage: string) => {
    if (escalated.current) {
      return;
    }

    escalated.current = true;
    const time = currentTime();
    const liveConversation: ChatMessage[] = [
      ...conversation,
      { role: 'kate', text: handoffMessage, time },
      { role: 'kate', text: humanJoiningMessage, time },
    ];

    setSentMessages(liveConversation);
    setEscalationRequest({ summary: 'requested', dossier: createEscalationDossier(liveConversation) });
    setHelperDraft(helperConfirmationTemplate);
  };

  const requestHumanHelp = () => escalate(sentMessages, buttonHandoffMessage);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = messageDraft.trim();

    if (!text || escalated.current || kateReplying) {
      return;
    }

    const customerMessage: ChatMessage = { role: 'customer', text, time: currentTime() };
    const conversation = [...sentMessages, customerMessage];
    setSentMessages(conversation);
    setMessageDraft('');

    const kateConversation = conversation
      .filter((message) => message.role !== 'human')
      .map(({ role, text: messageText }) => ({ role: role as 'customer' | 'kate', text: messageText }));

    setKateReplying(true);
    const { data } = await api.POST('/kate/reply', { body: { messages: kateConversation } }).catch(() => ({ data: undefined }));
    setKateReplying(false);

    // The customer escalated with the button while Kate was replying; drop her late reply.
    if (escalated.current) {
      return;
    }

    if (data?.escalate) {
      escalate(conversation, data.text);
      return;
    }

    setSentMessages((messages) => [...messages, { role: 'kate', text: data?.text ?? kateFallbackReply, time: currentTime() }]);
  };

  const sendHelperMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = helperDraft.trim() || helperConfirmationTemplate;

    setHelperMessages((messages) => [...messages, { role: 'human', text, time: '09:47' }]);
    setSentMessages((messages) => [...messages, { role: 'human', text, time: '09:47' }]);
    setHelperDraft('');
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="kbc-logo" src="/kbc-logo.jpg" alt="KBC" />
          <div>
            <p className="brand-name">KBC Mobile</p>
            <p className="brand-context">Personal banking</p>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="secure-status"><span className="status-dot" /> Secure session</span>
          <button className="view-switch" type="button" onClick={() => { setServiceView((isServiceView) => !isServiceView); setDossierOpen(false); setKateOpen(false); }}>{serviceView ? 'Customer view' : 'Customer service view'}</button>
          {!serviceView && <button className="kate-trigger" type="button" onClick={() => setKateOpen(true)}><span className="kate-trigger-icon">K</span> Ask Kate</button>}
          <div className="avatar avatar-small">SV</div>
        </div>
      </header>

      <div className="page-heading">
        <div>
          <p className="eyebrow">{serviceView ? 'Customer service workspace' : 'Good morning, Sophie'}</p>
          <h1>{serviceView ? 'Escalation desk' : 'Your financial overview'}</h1>
        </div>
        <span className="last-updated">{serviceView ? 'Internal view' : 'Updated just now'}</span>
      </div>

      <section className="workspace-grid">
        <aside className="account-panel">
          <div className="profile-block">
            <div className="avatar avatar-large">SV</div>
            <div>
              <p className="profile-name">Sophie Vermeulen</p>
              <p className="profile-detail">Customer since 2018</p>
            </div>
          </div>

          <div className="account-divider" />
          <div className="account-label-row"><span>Accounts</span><span className="account-count">3</span></div>
          <nav className="account-nav" aria-label="Accounts">
            <button className="account-nav-item" type="button"><span className="account-icon">€</span><span><strong>Current account</strong><small>BE32 7350 •••• 4821</small></span><span className="nav-chevron">›</span></button>
            <button className="account-nav-item active" type="button"><span className="account-icon home-icon">⌂</span><span><strong>Home loan</strong><small>Mortgage •••• 1098</small></span><span className="nav-chevron">›</span></button>
            <button className="account-nav-item" type="button"><span className="account-icon">▤</span><span><strong>Savings account</strong><small>BE32 7350 •••• 9350</small></span><span className="nav-chevron">›</span></button>
          </nav>

          {serviceView && escalationRequest && <button className={`dossier-entry${dossierOpen ? ' is-open' : ''}`} type="button" onClick={() => setDossierOpen(true)}><span className="dossier-entry-icon">↗</span><span><strong>Escalation dossier</strong><small>{dossierOpen ? 'Currently open' : 'Open for Sophie'}</small></span><span className="nav-chevron">›</span></button>}

          <div className="help-card">
            <span className="help-icon">?</span>
            <div><strong>Need help?</strong><p>Kate can answer your questions.</p></div>
          </div>
        </aside>

        {serviceView && escalationRequest && dossierOpen ? <section className="main-panel dossier-panel">
          <div className="dossier-header"><div><p className="eyebrow">Internal escalation dossier</p><h2>{escalationRequest.dossier.customer}</h2><p className="dossier-account">{escalationRequest.dossier.account}</p></div><span className="dossier-status">{escalationRequest.dossier.status}</span></div>
          <div className="dossier-meta"><span><strong>Created</strong>{escalationRequest.dossier.createdAt}</span><span><strong>Source</strong>Kate conversation</span></div>
          <div className="worker-workspace">
            <div className="dossier-column"><section className="dossier-section"><div className="section-heading"><h3>Generated summary</h3><span>Generated</span></div><p>{escalationRequest.dossier.generatedSummary}</p></section><section className="dossier-section"><h3>Unresolved question</h3><p className="question-callout">{escalationRequest.dossier.unresolvedQuestion}</p></section><section className="dossier-section source-section"><div className="section-heading"><div><h3>Source Kate conversation</h3><p className="chat-context">The context sent with the escalation</p></div><span>Internal</span></div><div className="worker-chat-window"><div className="date-divider"><span>Today, 30 September</span></div>{escalationRequest.dossier.sourceConversation.map((message, index) => message.role === 'customer' ? <div className="message-row customer-message" key={`${message.time}-${index}`}><div className="message-bubble"><p>{message.text}</p><time>{message.time}</time></div><div className="avatar avatar-tiny">SV</div></div> : <div className="message-row kate-message" key={`${message.time}-${index}`}><img className="kate-message-logo" src="/kbc-kate-logo.jpg" alt="" /><div className="message-bubble"><p>{message.text}</p><time>{message.time}</time></div></div>)}</div></section></div>
            <div className="dossier-column"><section className="dossier-section"><h3>Mortgage account context</h3><div className="context-grid"><span>Balance<strong>{escalationRequest.dossier.accountContext.balance}</strong></span><span>Monthly payment<strong>{escalationRequest.dossier.accountContext.monthlyPayment}</strong></span><span>Change<strong>{escalationRequest.dossier.accountContext.paymentChange}</strong></span><span>Next payment<strong>{escalationRequest.dossier.accountContext.nextPayment}</strong></span></div></section><section className="dossier-section"><h3>Linked documents</h3><div className="document-list">{escalationRequest.dossier.documents.map((document) => <button className={`document-item${selectedDocument === document.title ? ' is-selected' : ''}`} type="button" aria-pressed={selectedDocument === document.title} key={document.title} onClick={() => setSelectedDocument(document.title)}><div className="document-icon">▤</div><div><strong>{document.title}</strong><small>{document.type} · {document.date}</small><p>{document.relevance}</p></div></button>)}</div></section></div>
            <section className="dossier-section helper-panel"><div className="section-heading"><div><h3>Helper chat</h3><p className="chat-context">Ready for your reply</p></div><span>Internal</span></div><div className="helper-chat-window">{helperMessages.length === 0 && <p className="helper-empty">Send a message to continue the conversation with Sophie.</p>}{helperMessages.map((message, index) => <div className="message-row human-message" key={`${message.time}-${index}`}><div className="message-bubble"><p>{message.text}</p><time>{message.time}</time></div><div className="avatar avatar-tiny human-avatar">CS</div></div>)}</div><form className="worker-composer" onSubmit={sendHelperMessage}><input className="composer-input" type="text" value={helperDraft} onChange={(event) => setHelperDraft(event.target.value)} placeholder="Reply to Sophie..." aria-label="Reply to Sophie" /><button className="send-button" type="submit">Send</button></form></section>
          </div>
        </section> : serviceView ? <section className="main-panel service-landing"><p className="eyebrow">Customer service workspace</p><h2>Select an escalation dossier</h2>{escalationRequest ? <><p>Sophie Vermeulen has requested help with her home loan. Open the dossier from the selected account to review the conversation and relevant documents.</p><button className="secondary-button" type="button" onClick={() => setDossierOpen(true)}>Open Sophie&apos;s dossier <span>→</span></button></> : <p>No escalation dossiers are available for this demo account yet.</p>}</section> : <section className="main-panel">
          <div className="mortgage-summary">
            <div className="summary-heading"><div><p className="eyebrow">Home loan</p><h2>Mortgage account</h2></div><span className="account-status">Active</span></div>
            <div className="summary-metrics">
              <div><span>Outstanding balance</span><strong>€ 238,450.12</strong></div>
              <div><span>Monthly payment</span><strong>€ 1,248.67</strong><small className="payment-change">↑ € 18.42 this month</small></div>
              <div><span>Next payment</span><strong>03 Oct 2026</strong></div>
            </div>
          </div>
          <div className="account-content-placeholder"><p className="eyebrow">Recent activity</p><h2>Your home loan is up to date</h2><p>Your latest payment was received on 03 September 2026. Open Kate for a clear explanation of the payment change.</p><button className="secondary-button" type="button" onClick={() => setKateOpen(true)}>Open Kate <span>→</span></button></div>
        </section>}
      </section>

      {kateOpen && <div className="kate-scrim" onClick={() => setKateOpen(false)} />}
      <aside className={`kate-drawer${kateOpen ? ' is-open' : ''}`} aria-label="Chat with Kate">
        <div className="kate-drawer-header"><div className="kate-title"><img src="/kbc-kate-logo.jpg" alt="" /><div><p className="eyebrow">Personal assistant</p><h2>Kate</h2></div></div><button className="close-button" type="button" aria-label="Close Kate" onClick={() => setKateOpen(false)}>×</button></div>
        <div className="kate-drawer-status"><span className="status-dot" /> Online now</div>
        <div className="chat-window">
          <div className="date-divider"><span>Today, 30 September</span></div>
          {sentMessages.map((message, index) => message.role === 'customer' ? (
            <div className="message-row customer-message" key={`${message.time}-${index}`}><div className="message-bubble"><p>{message.text}</p><time>{message.time}</time></div><div className="avatar avatar-tiny">SV</div></div>
          ) : message.role === 'human' ? (
            <div className="message-row human-message" key={`${message.time}-${index}`}><div className="avatar avatar-tiny human-avatar">CS</div><div className="message-bubble"><p>{message.text}</p><time>{message.time}</time></div></div>
          ) : (
            <div className="message-row kate-message" key={`${message.time}-${index}`}><img className="kate-message-logo" src="/kbc-kate-logo.jpg" alt="" /><div className="message-bubble"><p>{message.text}</p><time>{message.time}</time></div></div>
          ))}
          {kateReplying && <div className="message-row kate-message" role="status" aria-live="polite"><img className="kate-message-logo" src="/kbc-kate-logo.jpg" alt="" /><div className="message-bubble"><p>Kate is typing…</p></div></div>}
        </div>
        <div className="chat-action">
          {escalationRequest ? <div className="requested-state" role="status" aria-live="polite"><span>✓</span><div><strong>Your request was sent to customer service</strong><small>Someone will join this conversation shortly.</small></div></div> : <><form className="composer-form" onSubmit={sendMessage}><input className="composer-input" type="text" value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="Ask Kate a question..." aria-label="Message Kate" /><button className="send-button" type="submit" aria-label="Send message" disabled={kateReplying}>Send</button></form><button className="human-button" type="button" onClick={requestHumanHelp}><span>↗</span> Talk to a human</button></>}
        </div>
      </aside>
    </main>
  );
}