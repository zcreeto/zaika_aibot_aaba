import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Send, Trash2, ChefHat, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type Thread = { id: string; title: string; updated_at: string };
type Msg = { id: string; role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  "It's raining — suggest something comforting under ₹300",
  'Veg lunch for two under ₹500',
  'Best spicy non-veg biryani?',
  'A light Kerala-style dinner',
];

const Chat = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/auth');
      else setUserId(data.session.user.id);
    });
  }, [navigate]);

  const loadThreads = async () => {
    const { data } = await supabase
      .from('chat_threads')
      .select('id,title,updated_at')
      .order('updated_at', { ascending: false });
    setThreads(data ?? []);
    return data ?? [];
  };

  const createThread = async () => {
    if (!userId) {
      console.error("createThread failed: No userId found");
      toast({ title: 'Authentication error', description: 'You must be logged in to start a chat.', variant: 'destructive' });
      return;
    }
    console.log("Attempting to create thread for user:", userId);
    try {
      const { data, error } = await supabase
        .from('chat_threads')
        .insert({ user_id: userId, title: 'New chat' })
        .select('id,title,updated_at')
        .single();

      if (error) {
        console.error("Supabase Insert Error:", error);
        toast({ 
          title: 'Could not start a chat', 
          description: error.message || "Database insertion failed", 
          variant: 'destructive' 
        });
        return;
      }

      if (!data) {
        console.error("Supabase returned no data after insert");
        toast({ title: 'Chat creation failed', description: 'No data returned from server', variant: 'destructive' });
        return;
      }

      console.log("Thread created successfully:", data.id);
      setThreads((t) => [data, ...t]);
      navigate(`/chat/${data.id}`);
    } catch (err: any) {
      console.error("Unexpected error in createThread:", err);
      toast({ title: 'Unexpected error', description: err.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadThreads().then((list) => {
      if (!threadId) {
        if (list.length) navigate(`/chat/${list[0].id}`, { replace: true });
        else createThread();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!threadId || !userId) return;
    setMessages([]);
    supabase
      .from('chat_messages')
      .select('id,role,content')
      .eq('thread_id', threadId)
      .order('created_at')
      .then(({ data }) => setMessages((data as Msg[]) ?? []));
    inputRef.current?.focus();
  }, [threadId, userId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const deleteThread = async (id: string) => {
    await supabase.from('chat_threads').delete().eq('id', id);
    const rest = threads.filter((t) => t.id !== id);
    setThreads(rest);
    if (id === threadId) navigate(rest.length ? `/chat/${rest[0].id}` : '/chat');
    if (!rest.length) createThread();
  };

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || !threadId || sending) return;
    setInput('');
    setSending(true);
    const assistantId = `a-${Date.now()}`;
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: 'user', content: message },
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    try {
      const { data: s } = await supabase.auth.getSession();
      const res = await fetch(
        `https://iiedusswtxyrdqprzkym.supabase.co/functions/v1/food-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${s.session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ threadId, message }),
        }
      );
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'The assistant could not reply.');
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((x) => (x.id === assistantId ? { ...x, content: x.content + chunk } : x))
        );
      }
      loadThreads();
    } catch (e: any) {
      setMessages((m) => m.filter((x) => x.id !== assistantId));
      toast({ title: 'Something went wrong', description: e.message, variant: 'destructive' });
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-16 h-[100dvh] flex bg-background">
        {/* Thread list */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-muted/30">
          <div className="p-3">
            <Button onClick={createThread} className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" /> New chat
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
            {threads.map((t) => (
              <div
                key={t.id}
                className={cn(
                  'group flex items-center rounded-md text-sm',
                  t.id === threadId ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                )}
              >
                <button className="flex-1 text-left truncate px-3 py-2" onClick={() => navigate(`/chat/${t.id}`)}>
                  {t.title}
                </button>
                <button
                  aria-label="Delete chat"
                  className="p-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteThread(t.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="md:hidden flex gap-2 p-2 border-b border-border overflow-x-auto">
            <Button size="sm" variant="outline" onClick={createThread}>
              <Plus className="w-4 h-4" />
            </Button>
            {threads.map((t) => (
              <Button
                key={t.id}
                size="sm"
                variant={t.id === threadId ? 'default' : 'ghost'}
                className="max-w-[140px] truncate"
                onClick={() => navigate(`/chat/${t.id}`)}
              >
                {t.title}
              </Button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
              {messages.length === 0 && (
                <div className="text-center py-10 animate-fade-in">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ChefHat className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Zaika Food Guide</h1>
                  <p className="text-muted-foreground mb-6">
                    Tell me the weather, your budget, cuisine or veg / non-veg choice and I'll suggest dishes.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-left text-sm p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-2 whitespace-pre-wrap">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <div className="prose prose-sm max-w-none text-foreground min-w-0 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:pl-5 [&_ol]:list-decimal [&_p]:my-1">
                      {m.content ? (
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
                        </span>
                      )}
                    </div>
                  </div>
                )
              )}
              <div ref={endRef} />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-3"
          >
            <div className="max-w-3xl mx-auto flex gap-2 items-end">
              <Textarea
                ref={inputRef}
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="e.g. Veg dinner under ₹400 for a cold evening"
                rows={1}
                className="min-h-[44px] max-h-40 resize-none"
              />
              <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={sending || !input.trim()}>
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default Chat;
