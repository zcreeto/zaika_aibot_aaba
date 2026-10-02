import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

// --- MENU DATA ---
const MENU = [
  ["Dosa","breakfast",80,"veg","mild","Crispy crepe of fermented rice and lentil batter"],
  ["Masala Dosa","breakfast",100,"veg","medium","Dosa filled with spiced potato"],
  ["Idli","breakfast",60,"veg","mild","Soft steamed rice cakes with sambar and chutney"],
  ["Medu Vada","breakfast",70,"veg","mild","Crispy lentil donuts"],
  ["Uttapam","breakfast",90,"veg","mild","Thick pancake topped with vegetables"],
  ["Appam","breakfast",85,"veg","mild","Fluffy lace-edged pancakes with stew"],
  ["Puttu","breakfast",75,"veg","mild","Steamed rice cake with coconut"],
  ["Upma","breakfast",65,"veg","mild","Savory semolina with vegetables"],
  ["Pongal","breakfast",70,"veg","mild","Rice and lentils with black pepper and ghee"],
  ["Hyderabadi Biryani","biryani",280,"non-veg","hot","Dum-cooked basmati with marinated meat"],
  ["Kolkata Biryani","biryani",260,"non-veg","medium","Fragrant biryani with potato and egg"],
  ["Thalassery Biryani","biryani",290,"non-veg","hot","Malabar biryani with short-grain rice"],
  ["Andhra Biryani","biryani",270,"non-veg","hot","Fiery Andhra-style biryani"],
  ["Chettinad Biryani","biryani",275,"non-veg","hot","Tamil Nadu biryani with Chettinad spices"],
  ["Dindigul Biryani","biryani",265,"non-veg","hot","Seeraga samba rice with special masala"],
  ["Ambur Biryani","biryani",270,"non-veg","medium","Tamil Nadu style with seeraga samba rice"],
  ["Mangalore Biryani","biryani",275,"non-veg","medium","Coastal Karnataka biryani"],
  ["Donne Biryani","biryani",260,"non-//veg","hot","Bangalore biryani served in a leaf bowl"],
  ["Beary Biryani","biryani",280,"non-veg","hot","Mangalorean Beary community biryani"],
  ["Pakki Biryani","biryani",270,"non-veg","medium","Meat and rice cooked separately then layered"],
  ["Chettinad Chicken Curry","main-course",240,"non-veg","hot","Spicy chicken in Chettinad masala"],
  ["Fish Molee","main-course",260,"non-veg","mild","Kerala fish curry in coconut milk"],
  ["Kerala Prawn Curry","main-course",320,"non-veg","hot","Tangy spicy prawns with coconut"],
  ["Kori Gassi","main-course",250,"non-veg","hot","Mangalorean chicken curry"],
  ["Avial","main-course",180,"veg","mild","Mixed vegetables in coconut-yogurt gravy"],
  ["Sambar","main-course",120,"veg","medium","Lentil and vegetable stew"],
  ["Rasam","main-course",100,"veg","medium","Tangy tamarind pepper soup"],
  ["Meen Pollichathu","main-course",280,"non-veg","hot","Fish roasted in banana leaf"],
  ["Chicken 65","appetizer",220,"non-veg","hot","Spicy deep-fried chicken"],
  ["Sundal","appetizer",80,"veg","mild","Seasoned chickpea snack"],
  ["Malabar Parotta","appetizer",50,"veg","mild","Flaky layered flatbread"],
  ["Lemon Rice","rice",110,"veg","mild","Tangy lemon rice with tempering"],
  ["Tamarind Rice (Puliyogare)","rice",120,"veg","medium","Tangy tamarind rice"],
  ["Bisi Bele Bath","rice",140,"veg","medium","Karnataka rice with lentils and vegetables"],
  ["Payasam","dessert",90,"veg","-","Sweet milk pudding"],
  ["Mysore Pak","dessert",100,"veg","-","Gram flour and ghee sweet"],
  ["Kozhukatta","dessert",85,"veg","-","Steamed rice dumplings with sweet filling"],
];
const menuText = () => MENU.map(([n, c, p, v, s, d]) => "- " + n + " | " + c + " | ₹" + p + " | " + v + " | spice: " + s + " | " + d).join("\n");

const SOMMELIER_PROMPT = (weather: string, menu: string) => "You are The Sommelier, the Taste Expert of Zaika Gharana. Rules: Suggest based on flavor notes. Pair mains with appetizers/desserts. Calculate Remaining Budget. Internal MENU only. CONTEXT: Weather: " + weather + " \n MENU: " + menu;
const SCOUT_PROMPT = (webContext: string) => "You are The Scout, the External Market Researcher. Rules: Compare top-rated Zomato vs Swiggy items for Gurugram/Delhi. Provide actual URLs. CONTEXT: Web Context: " + webContext;
const CONCIERGE_PROMPT = "You are The Concierge. Route to SOMMELIER (menu/budget), SCOUT (external search), or BOTH. If unclear, provide a Discovery Menu of options.";

const Body = z.object({
  threadId: z.string().uuid(),
  message: z.string().trim().min(1).max(2000),
});

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function getWeather(): Promise<string> {
  try {
    const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=28.4595&longitude=77.0266&current=temperature_2m,precipitation,weather_code&timezone=Asia%2FKolkata");
    const d = await r.json();
    return "Gurugram now: " + d.current.temperature_2m + "°C, precipitation " + d.current.precipitation + " mm.";
  } catch { return "Weather unavailable."; }
}

async function searchWeb(query: string): Promise<string> {
  try {
    const r = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: Deno.env.get("TAVILY_API_KEY") || "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",
        query,
        search_depth: "basic",
        max_results: 3,
      }),
    });
    const d = await r.json();
    return d.results?.map((res: any) => res.title + ": " + res.url + "\n" + res.content).join("\n\n") || "No results.";
  } catch { return "Search unavailable."; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return json(401, { error: "Missing Authorization header." });

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json(400, { error: "Invalid request body." });
    const { threadId, message } = parsed.data;

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return json(401, { error: "Unauthorized user." });
    const userId = userData.user.id;

    const { data: thread } = await supabase.from("chat_threads").select("id,title").eq("id", threadId).maybeSingle();
    if (!thread) return json(404, { error: "Chat thread not found." });

    const apiKey = Deno.env.get("GOOGLE_API_KEY") || Deno.env.get("OLLAMA_API_KEY");
    if (!apiKey) return json(500, { error: "AI API Key not configured." });

    await supabase.from("chat_messages").insert({ thread_id: threadId, user_id: userId, role: "user", content: message });
    if (thread.title === "New chat") await supabase.from("chat_threads").update({ title: message.slice(0, 50) }).eq("id", threadId);

    const { data: history } = await supabase.from("chat_messages").select("role,content").eq("thread_id", threadId).order("created_at").limit(40);
    const weather = await getWeather();
    const webSearch = await searchWeb(message);
    const menu = menuText();

    let route = "SOMMELIER"; 
    try {
      const routingPrompt = CONCIERGE_PROMPT + "\nUser Message: \"" + message + "\"\nRespond with ONLY \"SOMMELIER\", \"SCOUT\", or \"BOTH\".";
      const modelId = Deno.env.get("GEMMA_MODEL") || "gemini-1.5-flash";
      const routingRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + modelId + ":generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: routingPrompt }] }] }),
      });
      const routingData = await routingRes.json();
      const routedValue = routingData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (routedValue && ["SOMMELIER", "SCOUT", "BOTH"].includes(routedValue.toUpperCase())) {
        route = routedValue.toUpperCase();
      }
    } catch (e) { console.error("Routing failed:", e); }

    let finalInstructions = route === "SCOUT" ? SCOUT_PROMPT(webSearch) : route === "SOMMELIER" ? SOMMELIER_PROMPT(weather, menu) : "Hybrid: " + SOMMELIER_PROMPT(weather, menu) + "\n" + SCOUT_PROMPT(webSearch);

    const contents = (history ?? []).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    contents.unshift({ role: "user", parts: [{ text: finalInstructions }] });

    const modelIdFinal = Deno.env.get("GEMMA_MODEL") || "gemini-1.5-flash";
    const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + modelIdFinal + ":streamGenerateContent?alt=sse&key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    if (!upstream.ok || !upstream.body) {
      return json(upstream.status || 500, { error: "AI Provider failed." });
    }

    const stream = new ReadableStream({
      async start(controller) {
        let full = "";
        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk.startsWith("data: ")) {
              const text = chunk.replace("data: ", "").trim();
              try {
                const evt = JSON.parse(text);
                const content = evt.candidates?.[0]?.content?.parts?.[0]?.text || "";
                full += content;
                controller.enqueue(new TextEncoder().encode(content));
              } catch { }
            }
          }
        } finally {
          if (full) {
            await supabase.from("chat_messages").insert({ thread_id: threadId, user_id: userId, role: "assistant", content: full });
            await supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);
          }
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" } });
  } catch (e) {
    console.error("Global Error:", e);
    return json(500, { error: e.message });
  }
});
