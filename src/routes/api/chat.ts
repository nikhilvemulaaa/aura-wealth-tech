import { createFileRoute } from "@tanstack/react-router";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, context } = (await request.json()) as {
          messages: UIMessage[];
          context?: string;
        };
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const system = `You are YONO AI, a hyper-personalized wealth advisor for an Indian retail banking customer.
Be concise, warm, and concrete. Always speak in Indian Rupees (₹). Use lakhs/crores where natural.
When recommending, give 2–3 specific actionable steps with numbers. End with a one-line confidence note.
Use markdown: short headings, bullet lists, bold key numbers.
If the user asks about products, reference realistic Indian options: SBI/HDFC/ICICI FDs, Axis Bluechip, Parag Parikh Flexi Cap, PPF, NPS, ELSS, SGB, NIFTY 50 index funds, Term insurance, Health insurance.
${context ? `\nUser financial snapshot:\n${context}` : ""}`;

        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system,
          messages: convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse();
      },
    },
  },
});
