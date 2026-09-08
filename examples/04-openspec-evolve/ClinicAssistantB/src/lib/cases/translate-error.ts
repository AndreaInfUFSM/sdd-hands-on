import { LLMRequestError, LLMError } from './errors';

export function translateProviderError(error: unknown): LLMError {
  const err = error as { status?: unknown; code?: unknown; type?: unknown; message?: unknown };
  const status = typeof err?.status === 'number' ? err.status : typeof err?.status === 'string' ? parseInt(err.status, 10) : NaN;
  const code = err?.code ? String(err.code).toLowerCase() : '';
  const type = err?.type ? String(err.type).toLowerCase() : '';
  const message = err?.message ? String(err.message) : 'Unknown LLM error';

  if (code.includes('rate') || code.includes('quota') || status === 429) {
    return { category: 'rate-limit', message, retryable: false };
  }

  if (code.includes('timeout') || code.includes('connect') || code.includes('net') || code.includes('econn') ||
      type.includes('timeout') || type.includes('connection') || status >= 408 && status <= 409 ||
      code === 'timeout') {
    return { category: 'connectivity', message, retryable: true };
  }

  if (code.includes('unavailable') || code.includes('server') || status === 500 || status === 502 ||
      status === 503 || status === 504 || type.includes('unavailable') || type.includes('server')) {
    return { category: 'service-unavailable', message, retryable: true };
  }

  if (code.includes('parse') || code.includes('json') || code.includes('schema') || code.includes('format') ||
      type.includes('parse') || type.includes('json')) {
    return { category: 'invalid-output', message, retryable: false };
  }

  if (code === 'invalid-output' || (message && message.toLowerCase().includes('schema validation'))) {
    return { category: 'invalid-output', message, retryable: false };
  }

  return { category: 'service-unavailable', message, retryable: true };
}

export function isLLMRequestError(error: unknown): error is LLMRequestError {
  return error instanceof LLMRequestError;
}