'use client';

import { type FormEvent, useState } from 'react';

type EscalationRequest = {
  summary: 'requested';
  dossier: 'requested';
};

type ChatMessage = {
  role: 'customer' | 'kate';
  text: string;
  time: string;
};

export default function HomePage() {
  const [kateOpen, setKateOpen] = useState(true);
  const [escalationRequest, setEscalationRequest] = useState<EscalationRequest | null>(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [sentMessages, setSentMessages] = useState<ChatMessage[]>([]);

  const requestHumanHelp = () => {
    if (escalationRequest) {
      return;
    }

    setEscalationRequest({ summary: 'requested', dossier: 'requested' });
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = messageDraft.trim();

    if (!text || escalationRequest) {
      return;
    }

    setSentMessages((messages) => [...messages, { role: 'customer', text, time: '09:45' }]);
    setMessageDraft('');

    if (/\b(human|person|helper|agent|customer service)\b/i.test(text)) {
      requestHumanHelp();
      return;
    }

    setSentMessages((messages) => [...messages, {
      role: 'kate',
      text: 'I can help explain your mortgage payments. For document-specific questions, you can ask me to connect you with a human teammate.',
      time: '09:46',
    }]);
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
          <button className="kate-trigger" type="button" onClick={() => setKateOpen(true)}><span className="kate-trigger-icon">K</span> Ask Kate</button>
          <div className="avatar avatar-small">SV</div>
        </div>
      </header>

      <div className="page-heading">
        <div>
          <p className="eyebrow">Good morning, Sophie</p>
          <h1>Your financial overview</h1>
        </div>
        <span className="last-updated">Updated just now</span>
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

          <div className="help-card">
            <span className="help-icon">?</span>
            <div><strong>Need help?</strong><p>Kate can answer your questions.</p></div>
          </div>
        </aside>

        <section className="main-panel">
          <div className="mortgage-summary">
            <div className="summary-heading"><div><p className="eyebrow">Home loan</p><h2>Mortgage account</h2></div><span className="account-status">Active</span></div>
            <div className="summary-metrics">
              <div><span>Outstanding balance</span><strong>€ 238,450.12</strong></div>
              <div><span>Monthly payment</span><strong>€ 1,248.67</strong><small className="payment-change">↑ € 18.42 this month</small></div>
              <div><span>Next payment</span><strong>03 Oct 2026</strong></div>
            </div>
          </div>
          <div className="account-content-placeholder"><p className="eyebrow">Recent activity</p><h2>Your home loan is up to date</h2><p>Your latest payment was received on 03 September 2026. Open Kate for a clear explanation of the payment change.</p><button className="secondary-button" type="button" onClick={() => setKateOpen(true)}>Open Kate <span>→</span></button></div>
        </section>
      </section>

      {kateOpen && <div className="kate-scrim" onClick={() => setKateOpen(false)} />}
      <aside className={`kate-drawer${kateOpen ? ' is-open' : ''}`} aria-label="Chat with Kate">
        <div className="kate-drawer-header"><div className="kate-title"><img src="/kbc-kate-logo.jpg" alt="" /><div><p className="eyebrow">Personal assistant</p><h2>Kate</h2></div></div><button className="close-button" type="button" aria-label="Close Kate" onClick={() => setKateOpen(false)}>×</button></div>
        <div className="kate-drawer-status"><span className="status-dot" /> Online now</div>
        <div className="chat-window">
          <div className="date-divider"><span>Today, 30 September</span></div>
          <div className="message-row customer-message"><div className="message-bubble"><p>Hi Kate, I noticed my monthly mortgage payment is higher this month. Can you tell me why it changed?</p><time>09:41</time></div><div className="avatar avatar-tiny">SV</div></div>
          <div className="message-row kate-message"><img className="kate-message-logo" src="/kbc-kate-logo.jpg" alt="" /><div className="message-bubble"><p>Hi Sophie, of course. I’ve had a look at your home loan. Your interest rate was adjusted at the start of this month, which changed the monthly payment from € 1,230.25 to € 1,248.67.</p><time>09:42</time></div></div>
          <div className="message-row customer-message"><div className="message-bubble"><p>Okay, that makes sense. Is this a permanent change?</p><time>09:43</time></div><div className="avatar avatar-tiny">SV</div></div>
          <div className="message-row kate-message"><img className="kate-message-logo" src="/kbc-kate-logo.jpg" alt="" /><div className="message-bubble"><p>Yes, the new rate applies for the rest of your current rate period. Your next payment will be collected on 3 October. I can also show you the full payment breakdown if that would be useful.</p><time>09:44</time></div></div>
          {sentMessages.map((message, index) => message.role === 'customer' ? (
            <div className="message-row customer-message" key={`${message.time}-${index}`}><div className="message-bubble"><p>{message.text}</p><time>{message.time}</time></div><div className="avatar avatar-tiny">SV</div></div>
          ) : (
            <div className="message-row kate-message" key={`${message.time}-${index}`}><img className="kate-message-logo" src="/kbc-kate-logo.jpg" alt="" /><div className="message-bubble"><p>{message.text}</p><time>{message.time}</time></div></div>
          ))}
          {escalationRequest && <>
            <div className="message-row kate-message"><img className="kate-message-logo" src="/kbc-kate-logo.jpg" alt="" /><div className="message-bubble"><p>I’m sorry, I can’t handle this document-specific mortgage question. I’ll ask a human teammate to help.</p><time>09:45</time></div></div>
            <div className="message-row kate-message"><img className="kate-message-logo" src="/kbc-kate-logo.jpg" alt="" /><div className="message-bubble"><p>I’ll send this conversation and a summary to a human helper, so you won’t need to repeat what happened.</p><time>09:45</time></div></div>
          </>}
        </div>
        <div className="chat-action">
          {escalationRequest ? <div className="requested-state" role="status" aria-live="polite"><span>✓</span><div><strong>Your request was sent to customer service</strong><small>Someone will join this conversation shortly.</small></div></div> : <><form className="composer-form" onSubmit={sendMessage}><input className="composer-input" type="text" value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="Ask Kate a question..." aria-label="Message Kate" /><button className="send-button" type="submit" aria-label="Send message">Send</button></form><button className="human-button" type="button" onClick={requestHumanHelp}><span>↗</span> Talk to a human</button></>}
        </div>
      </aside>
    </main>
  );
}