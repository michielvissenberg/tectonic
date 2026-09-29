'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createSdkClient } from '@tectonic/sdk';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const sdkClient = createSdkClient(apiUrl);

export default function HomePage() {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    sdkClient.GET('/settings/value').then(({ data }) => {
      if (data) {
        setValue(data.value);
        setStatus('Loaded');
      } else {
        setStatus('API unavailable');
      }
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Saving...');

    const { data } = await sdkClient.PUT('/settings/value', {
      body: { value },
    });

    setStatus(data ? 'Saved' : 'Save failed');
  }

  return (
    <main>
      <h1>Tectonic</h1>
      <p>A tiny persisted setting demo.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="setting-value">Value</label>
        <input id="setting-value" value={value} onChange={(event) => setValue(event.target.value)} />
        <button type="submit">Save</button>
      </form>
      <p>{status}</p>
    </main>
  );
}