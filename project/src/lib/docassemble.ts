const DOCASSEMBLE_URL = process.env.DOCASSEMBLE_URL!;
const DOCASSEMBLE_API_KEY = process.env.DOCASSEMBLE_API_KEY!;

export type DaSession = {
  session: string;
  secret: string;
  i: string;
};

async function daFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${DOCASSEMBLE_URL}/api${path}`, {
    ...options,
    headers: {
      "X-API-Key": DOCASSEMBLE_API_KEY,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Docassemble API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function createSession(interviewId: string): Promise<DaSession> {
  return daFetch(`/session/new?i=${encodeURIComponent(interviewId)}`);
}

export async function setSessionVariables(
  session: DaSession,
  variables: Record<string, unknown>
) {
  return daFetch("/session", {
    method: "POST",
    body: JSON.stringify({
      session: session.session,
      secret: session.secret,
      i: session.i,
      variables,
    }),
  });
}

export async function getSessionQuestion(session: DaSession) {
  return daFetch(
    `/session/question?session=${session.session}&secret=${session.secret}&i=${encodeURIComponent(session.i)}`
  );
}

export async function getSessionFile(
  session: DaSession,
  fileUrl: string
): Promise<ArrayBuffer> {
  // Build URL with session params for authentication
  const separator = fileUrl.includes("?") ? "&" : "?";
  const url = `${DOCASSEMBLE_URL}${fileUrl}${separator}session=${session.session}&secret=${session.secret}`;

  const res = await fetch(url, {
    headers: { "X-API-Key": DOCASSEMBLE_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Failed to get file: ${res.status}`);
  }

  return res.arrayBuffer();
}
