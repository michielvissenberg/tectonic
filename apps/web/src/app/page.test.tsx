import '@testing-library/jest-dom/vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from './page';

describe('helper confirmation flow', () => {
  it('prefills the worker confirmation with the dossier summary and sends it to the customer chat', () => {
    render(React.createElement(HomePage));

    fireEvent.click(screen.getByRole('button', { name: /talk to a human/i }));

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
