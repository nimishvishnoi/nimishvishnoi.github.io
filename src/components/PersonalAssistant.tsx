import React, {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiCpu, FiMessageCircle, FiSend, FiUser, FiX } from 'react-icons/fi';

const ASSISTANT_API_URL =
  import.meta.env.VITE_ASSISTANT_API_URL ||
  'https://nimish-portfolio-assistant.nnimish75.workers.dev';
const MAX_QUERY_LENGTH = 1000;
const MAX_MESSAGES = 40;

interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  content: string;
}

interface AssistantResponse {
  answer?: unknown;
  error?: unknown;
}

type MarkdownBlock =
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'list'; content: string[] };

const initialMessage: ChatMessage = {
  id: 0,
  role: 'assistant',
  content: 'Hi! I can answer questions about Nimish’s experience, projects, and technical skills.',
};

function renderInlineMarkdown(content: string): ReactNode[] {
  return content
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={`${part}-${index}`} className="rounded bg-black/10 px-1 dark:bg-white/10">
            {part.slice(1, -1)}
          </code>
        );
      }
      const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/u);
      if (link) {
        return (
          <a
            key={`${part}-${index}`}
            href={link[2]}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {link[1]}
          </a>
        );
      }
      return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
    });
}

function parseMarkdown(content: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flush = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', content: paragraph.join(' ') });
      paragraph = [];
    }
    if (list.length > 0) {
      blocks.push({ type: 'list', content: list });
      list = [];
    }
  };

  content.split(/\r?\n/u).forEach((line) => {
    const trimmedLine = line.trim();
    const heading = trimmedLine.match(/^#{1,3}\s+(.+)$/u);
    const listItem = trimmedLine.match(/^[-*]\s+(.+)$/u);

    if (!trimmedLine) {
      flush();
    } else if (heading) {
      flush();
      blocks.push({ type: 'heading', content: heading[1] });
    } else if (listItem) {
      if (paragraph.length > 0) flush();
      list.push(listItem[1]);
    } else {
      if (list.length > 0) flush();
      paragraph.push(trimmedLine);
    }
  });
  flush();
  return blocks;
}

const AssistantMarkdown: React.FC<{ content: string }> = ({ content }) => (
  <div className="space-y-2">
    {parseMarkdown(content).map((block, index) => {
      if (block.type === 'heading') {
        return (
          <h3
            key={`${block.type}-${index}`}
            className="font-semibold text-gray-900 dark:text-white"
          >
            {renderInlineMarkdown(block.content)}
          </h3>
        );
      }
      if (block.type === 'list') {
        return (
          <ul key={`${block.type}-${index}`} className="list-disc space-y-1 pl-4">
            {block.content.map((item, itemIndex) => (
              <li key={`${item}-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      }
      return <p key={`${block.type}-${index}`}>{renderInlineMarkdown(block.content)}</p>;
    })}
  </div>
);

export const PersonalAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdRef = useRef(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const messagesEnd = messagesEndRef.current;
    if (messagesEnd && typeof messagesEnd.scrollIntoView === 'function') {
      messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  const appendMessage = (message: Omit<ChatMessage, 'id'>) => {
    setMessages((currentMessages) =>
      [...currentMessages, { ...message, id: messageIdRef.current++ }].slice(-MAX_MESSAGES)
    );
  };

  const submitQuery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isLoading) return;

    setError(null);
    setQuery('');
    appendMessage({ role: 'user', content: trimmedQuery });
    setIsLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(ASSISTANT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmedQuery }),
        signal: controller.signal,
      });
      const payload = (await response.json()) as AssistantResponse;

      const answer = payload.answer;
      if (!response.ok || typeof answer !== 'string') {
        throw new Error(
          typeof payload.error === 'string'
            ? payload.error
            : 'The assistant could not answer right now.'
        );
      }

      appendMessage({ role: 'assistant', content: answer });
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') {
        setError('The assistant took too long to respond. Please try again.');
        return;
      }
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'The assistant is temporarily unavailable.';
      setError(message);
    } finally {
      window.clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          role="dialog"
          aria-modal="true"
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
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-100'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <AssistantMarkdown content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
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
                onKeyDown={handleInputKeyDown}
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
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              Enter to send · Shift+Enter for a new line
            </p>
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
