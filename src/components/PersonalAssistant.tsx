import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { FiCpu, FiMessageCircle, FiSend, FiUser, FiX } from 'react-icons/fi';

const ASSISTANT_API_URL =
  import.meta.env.VITE_ASSISTANT_API_URL ||
  'https://nimish-portfolio-assistant.nnimish75.workers.dev';
const MAX_QUERY_LENGTH = 1000;

interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  content: string;
}

interface AssistantResponse {
  answer?: unknown;
  error?: unknown;
}

const initialMessage: ChatMessage = {
  id: 0,
  role: 'assistant',
  content: 'Hi! I can answer questions about Nimish’s experience, projects, and technical skills.',
};

export const PersonalAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const submitQuery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isLoading) return;

    setError(null);
    setQuery('');
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), role: 'user', content: trimmedQuery },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch(ASSISTANT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmedQuery }),
      });
      const payload = (await response.json()) as AssistantResponse;

      if (!response.ok || typeof payload.answer !== 'string') {
        throw new Error(
          typeof payload.error === 'string'
            ? payload.error
            : 'The assistant could not answer right now.'
        );
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { id: Date.now(), role: 'assistant', content: payload.answer as string },
      ]);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'The assistant is temporarily unavailable.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label="Personal AI portfolio assistant"
          className="mb-4 flex h-[min(34rem,calc(100vh-7rem))] w-[min(20rem,calc(100vw-2.5rem))] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 sm:w-80"
        >
          <header className="flex items-center justify-between bg-primary-700 px-4 py-3 text-white dark:bg-primary-800">
            <div className="flex items-center gap-2">
              <FiCpu aria-hidden="true" />
              <div>
                <h2 className="text-sm font-semibold">Portfolio Assistant</h2>
                <p className="text-xs text-primary-100">Ask about Nimish’s work</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close portfolio assistant"
              className="rounded-md p-1.5 hover:bg-white/15"
            >
              <FiX aria-hidden="true" />
            </button>
          </header>

          <div role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className="mt-1 rounded-full bg-primary-100 p-1.5 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300"
                >
                  {message.role === 'user' ? <FiUser /> : <FiCpu />}
                </span>
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-100'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isLoading && <p className="text-sm text-gray-500 dark:text-gray-400">Thinking…</p>}
            {error && (
              <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={submitQuery}
            className="border-t border-gray-200 p-3 dark:border-slate-700"
          >
            <label htmlFor="assistant-query" className="sr-only">
              Ask the portfolio assistant
            </label>
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                id="assistant-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                maxLength={MAX_QUERY_LENGTH}
                rows={1}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="max-h-24 min-h-10 flex-1 resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                aria-label="Send question"
                className="rounded-lg bg-primary-600 p-2.5 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiSend aria-hidden="true" />
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close portfolio assistant' : 'Open portfolio assistant'}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-700"
      >
        {isOpen ? (
          <FiX size={24} aria-hidden="true" />
        ) : (
          <FiMessageCircle size={24} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};
