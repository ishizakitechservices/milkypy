import { onRequest } from "./api/[[route]].ts";

interface WorkerEnv {
  ASSETS?: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  DEEPSEEK_API_KEY?: string;
  GEMINI_API_KEY?: string;
  GROQ_API_KEY?: string;
  [key: string]: unknown;
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const route = url.pathname.replace(/^\/api\/?/, "");
      return onRequest({
        request,
        env: env as unknown as Record<string, string | undefined>,
        params: { route },
      });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  },
};
