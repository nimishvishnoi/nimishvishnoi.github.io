import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PersonalAssistant } from './PersonalAssistant';

describe('PersonalAssistant', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders assistant Markdown and submits with Enter', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ answer: '## Skills\n\n- **React** and `.NET`' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    render(<PersonalAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio assistant/i }));
    const input = screen.getByRole('textbox', { name: /ask the portfolio assistant/i });

    fireEvent.change(input, { target: { value: 'What skills does Nimish have?' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(await screen.findByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('.NET')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('keeps a newline when Shift+Enter is pressed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ answer: 'Received' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    render(<PersonalAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio assistant/i }));
    const input = screen.getByRole('textbox', { name: /ask the portfolio assistant/i });

    fireEvent.change(input, { target: { value: 'Line one' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(input).toHaveValue('Line one');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('closes with Escape', async () => {
    render(<PersonalAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio assistant/i }));

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /open portfolio assistant/i })).toBeInTheDocument();
    });
  });

  it('starts a new in-memory session after a page refresh', () => {
    sessionStorage.setItem('portfolio-assistant-question-count', '12');
    vi.stubGlobal('fetch', vi.fn());

    render(<PersonalAssistant />);
    fireEvent.click(screen.getByRole('button', { name: /open portfolio assistant/i }));

    expect(
      screen.getByRole('textbox', { name: /ask the portfolio assistant/i })
    ).not.toBeDisabled();
    expect(screen.getByText(/12 questions remaining/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
