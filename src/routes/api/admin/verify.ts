import { createFileRoute } from "@tanstack/react-router";
import {
  clearAdminCookie,
  issueAdminToken,
  passwordMatches,
  verifyAdminRequest,
} from "@/lib/admin-session.server";

export const Route = createFileRoute("/api/admin/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.ADMIN_SESSION_SECRET;
        if (!secret) return Response.json({ unlocked: false });
        return Response.json({ unlocked: verifyAdminRequest(request, secret) });
      },
      POST: async ({ request }) => {
        const secret = process.env.ADMIN_SESSION_SECRET;
        const expected = process.env.ADMIN_PASSWORD;
        if (!secret || !expected) {
          return new Response("Admin auth not configured", { status: 500 });
        }
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid request", { status: 400 });
        }
        const pwd =
          body && typeof body === "object" && "password" in body
            ? (body as { password: unknown }).password
            : undefined;
        if (typeof pwd !== "string" || pwd.length === 0 || pwd.length > 256) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        // Small artificial delay to blunt brute forcing.
        await new Promise((r) => setTimeout(r, 250));
        if (!passwordMatches(pwd, expected)) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        const { cookie } = issueAdminToken(secret);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
        });
      },
      DELETE: async () => {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Set-Cookie": clearAdminCookie() },
        });
      },
    },
  },
});
