import profileContext from '../context/profile.md';

const MAX_QUERY_LENGTH = 1000;
const MAX_BODY_LENGTH = 12_000;
const DEFAULT_ORIGIN = 'https://nimishvishnoi.github.io';
const DEFAULT_MODEL = 'gpt-4o-mini';
const STOP_WORDS = new Set([
  'about',
  'all',
  'can',
  'does',
  'have',
  'hi',
  'how',
  'nimish',
  'tell',
  'the',
  'what',
  'which',
]);
const GREETING_PATTERN =
  /^(?:hi|hello|hey|good morning|good afternoon|good evening)(?:[!,. ]+how are you(?: doing)?\s*[!?]*)?$/iu;

interface Env {
  AI_API_KEY?: string;
  AI_API_URL?: string;
  AI_MODEL?: string;
  ALLOWED_ORIGIN?: string;
}

interface ChatRequest {
  query: string;
}

interface ProviderResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface ContextMatch {
  section: string;
  score: number;
}

function allowedOrigin(request: Request, env: Env): string {
  const configuredOrigin = env.ALLOWED_ORIGIN?.trim() || DEFAULT_ORIGIN;
  return request.headers.get('Origin') === configuredOrigin ? configuredOrigin : '';
}

function corsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': origin,
    'Content-Type': 'application/json; charset=utf-8',
    Vary: 'Origin',
  };
}

function jsonResponse(body: Record<string, unknown>, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  });
}

function splitContext(): string[] {
  return profileContext
    .split(/\n(?=## )/u)
    .map((section) => section.trim())
    .filter(Boolean);
}

function retrieveContext(query: string, limit = 3): string | null {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/u)
    .filter((term) => term.length > 2 && !STOP_WORDS.has(term))
    .map((term) => (term === 'skills' ? 'skill' : term));

  const matches: ContextMatch[] = splitContext()
    .map((section) => {
      const [heading = '', ...content] = section.split('\n');
      const searchableHeading = heading.toLowerCase();
      const searchableContent = content.join(' ').toLowerCase();
      const score = terms.reduce((total, term) => {
        if (searchableHeading.includes(term)) return total + 4;
        if (searchableContent.includes(term)) return total + 1;
        return total;
      }, 0);
      return { section, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
  const topScore = matches[0]?.score ?? 0;
  const focusedMatches = matches.filter(({ score }) => score >= Math.max(2, topScore - 1));

  return focusedMatches.length > 0
    ? focusedMatches.map(({ section }) => section).join('\n\n')
    : null;
}

function conversationalAnswer(query: string): string | null {
  if (GREETING_PATTERN.test(query.trim())) {
    return 'Hi! I’m doing well, thanks for asking. I can tell you about Nimish’s experience, projects, and technical skills.';
  }
  return null;
}

function isChatRequest(value: unknown): value is ChatRequest {
  if (!value || typeof value !== 'object' || !('query' in value)) return false;
  const query = value.query;
  return typeof query === 'string' && query.trim().length > 0 && query.length <= MAX_QUERY_LENGTH;
}

async function generateAnswer(query: string, context: string, env: Env): Promise<string> {
  const conversationalResponse = conversationalAnswer(query);
  if (conversationalResponse) return conversationalResponse;

  if (!context) {
    return 'I can answer questions about Nimish’s professional experience, projects, and technical skills. I don’t have enough portfolio context to answer that question.';
  }

  if (!env.AI_API_KEY) {
    return `Based on Nimish's portfolio:\n\n${context}`;
  }

  const endpoint = env.AI_API_URL?.trim();
  if (!endpoint) {
    throw new Error('AI_API_URL must be configured when AI_API_KEY is set.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.AI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.AI_MODEL?.trim() || DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are Nimish Vishnoi’s portfolio assistant. Answer only from the supplied context. If the answer is not present, say that you do not have that information. Never invent facts or reveal secrets.',
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nVisitor question:\n${query}`,
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI provider returned HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as ProviderResponse;
  const answer = payload.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    throw new Error('AI provider returned an empty answer.');
  }
  return answer;
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const origin = allowedOrigin(request, env);
  if (!origin) return jsonResponse({ error: 'Origin is not allowed.' }, 403, '');

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Only POST requests are supported.' }, 405, origin);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_LENGTH) {
      return jsonResponse({ error: 'Request body is too large.' }, 413, origin);
    }
    body = JSON.parse(rawBody) as unknown;
  } catch {
    return jsonResponse({ error: 'Request body must be valid JSON.' }, 400, origin);
  }

  if (!isChatRequest(body)) {
    return jsonResponse(
      { error: `query must be a non-empty string of at most ${MAX_QUERY_LENGTH} characters.` },
      400,
      origin
    );
  }

  try {
    const query = body.query.trim();
    const answer = await generateAnswer(query, retrieveContext(query) ?? '', env);
    return jsonResponse({ answer }, 200, origin);
  } catch (error) {
    console.error('Portfolio assistant request failed', error);
    return jsonResponse(
      { error: 'The assistant is temporarily unavailable. Please try again later.' },
      502,
      origin
    );
  }
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
};
