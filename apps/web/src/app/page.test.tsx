import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(() => {
  cleanup();
});

import HomePage from './page';

describe('helper confirmation flow', () => {
  it('keeps the customer-facing handoff distinct from the internal summary and does not imply Kate resolved the issue', () => {
    render(React.createElement(HomePage));

    fireEvent.change(screen.getByLabelText('Message Kate'), {
      target: { value: 'I need a human helper' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    fireEvent.click(screen.getByRole('button', { name: /customer service view/i }));
    fireEvent.click(screen.getByRole('button', { name: /open sophie/i }));

    expect(screen.getByText(/Your request was sent to customer service/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer status: Human review in progress/i)).toBeInTheDocument();
    expect(screen.queryByText(/Kate explained that/i)).not.toBeInTheDocument();
  });

  it('prefills the worker confirmation with the dossier summary and sends it to the customer chat', () => {
    render(React.createElement(HomePage));

    fireEvent.change(screen.getByLabelText('Message Kate'), {
      target: { value: 'I need a human helper' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    fireEvent.click(screen.getByRole('button', { name: /customer service view/i }));
    fireEvent.click(screen.getByRole('button', { name: /open sophie/i }));

    const helperInput = screen.getByLabelText('Reply to Sophie');
    expect(helperInput).toHaveValue(
      'I understand your question as: your monthly mortgage payment changed and you want to know why. Is that correct?',
    );

    fireEvent.change(helperInput, {
      target: { value: 'I understand your question as: your monthly mortgage payment changed and you want to know why. Is that correct?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getAllByText(/I understand your question as:/i).length).toBeGreaterThan(0);
  });
});
