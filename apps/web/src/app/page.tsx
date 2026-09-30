'use client';

import { useState } from 'react';

export default function HomePage() {
  const [humanRequested, setHumanRequested] = useState(false);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">K</div>
          <div>
            <p className="brand-name">KBC mobile</p>
            <p className="brand-context">Personal banking</p>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="secure-status"><span className="status-dot" /> Secure session</span>
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

          <div className="chat-header"><div><p className="eyebrow">Personal assistant</p><h2>Chat with Kate</h2></div><div className="kate-presence"><span className="status-dot" /> Online</div></div>
          <div className="chat-window">
            <div className="date-divider"><span>Today, 30 September</span></div>
            <div className="message-row customer-message"><div className="message-bubble"><p>Hi Kate, I noticed my monthly mortgage payment is higher this month. Can you tell me why it changed?</p><time>09:41</time></div><div className="avatar avatar-tiny">SV</div></div>
            <div className="message-row kate-message"><div className="avatar kate-avatar">K</div><div className="message-bubble"><p>Hi Sophie, of course. I’ve had a look at your home loan. Your interest rate was adjusted at the start of this month, which changed the monthly payment from € 1,230.25 to € 1,248.67.</p><time>09:42</time></div></div>
            <div className="message-row customer-message"><div className="message-bubble"><p>Okay, that makes sense. Is this a permanent change?</p><time>09:43</time></div><div className="avatar avatar-tiny">SV</div></div>
            <div className="message-row kate-message"><div className="avatar kate-avatar">K</div><div className="message-bubble"><p>Yes, the new rate applies for the rest of your current rate period. Your next payment will be collected on 3 October. I can also show you the full payment breakdown if that would be useful.</p><time>09:44</time></div></div>
          </div>
          <div className="chat-action">
            {humanRequested ? <div className="requested-state"><span>✓</span><div><strong>A human teammate has been requested</strong><small>Someone will join this conversation shortly.</small></div></div> : <><div className="composer-placeholder">Ask Kate a question...</div><button className="human-button" type="button" onClick={() => setHumanRequested(true)}><span>↗</span> Talk to a human</button></>}
          </div>
        </section>
      </section>
    </main>
  );
}