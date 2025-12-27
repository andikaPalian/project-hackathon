import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { learningModes, quickPrompts, ChatMessage } from "@/data/mockData";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/utils/api";
import { toast } from "sonner";

export default function Belajar() {
  const { materialId, topicId } = useParams();
  const [material, setMaterial] = useState<any>(null);
  const [activeTopic, setActiveTopic] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("step-by-step");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!materialId || materialId === "undefined") {
        const welcomeMsg: ChatMessage = {
          id: "welcome",
          role: "assistant",
          content: "Halo! Saya Kari, asisten belajarmu. Ada yang bisa saya bantu hari ini?",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages([welcomeMsg]);
        setMaterial(null);
        return;
      }
      try {
        const response = await api.get(`/materials/${materialId}`);
        const result = response.data.data;
        setMaterial(result);

        if (result.topics && topicId) {
          const current = result.topics.find((t: any) => t.title === topicId);
          setActiveTopic(current);
        }

        const welcomeMsg: ChatMessage = {
          id: "welcome",
          role: "assistant",
          content: `Halo! Saya tutor AI-mu. Mari kita bahas topik "${topicId}" dari materi "${result.title}". Apa yang ingin kamu tanyakan?`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages([welcomeMsg]);
      } catch (error) {
        toast.error("Failed to fetch material details.");
      }
    };
    fetchMaterial();
  }, [materialId, topicId]);

  // const topic = mockTopics.find((t) => t.id === topicId) || mockTopics[1];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Susun history untuk Gemini
      const history = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
        parts: [{ text: m.content }],
      }));

      // Panggil Backend
      const response = await api.post("/ai/chat", {
        messages: text,
        history: history,
        materialId: materialId && materialId !== "undefined" ? materialId : null,
        topicId: topicId && topicId !== "undefined" ? topicId : null,
        mode: mode,
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.data,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      toast.error("Tutor sedang sibuk. Coba lagi nanti.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
        {/* Area Chat Utama */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                      msg.role === "assistant" ? "gradient-primary text-white" : "bg-muted"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                      msg.role === "assistant"
                        ? "bg-muted/50 border"
                        : "gradient-primary text-primary-foreground"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    <p className="text-[10px] mt-1 opacity-70">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl px-4 py-3 border">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-bounce" />
                      <span className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Chat & Quick Prompts */}
          <div className="p-4 border-t bg-background/95 backdrop-blur">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {quickPrompts.map((p) => (
                  <Button
                    key={p}
                    variant="outline"
                    size="sm"
                    className="shrink-0 rounded-full"
                    onClick={() => sendMessage(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Tanya sesuatu tentang materi ini..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-full px-6"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full gradient-primary"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Kanan: Konteks & Mode */}
        <aside className="hidden lg:flex w-80 border-l flex-col p-4 gap-4 bg-muted/10">
          {material ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                  Konteks Belajar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-bold text-primary leading-tight">
                    {activeTopic?.title || topicId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {material.title}
                  </p>
                </div>
                <ProgressBar value={activeTopic?.mastery || 0} size="sm" showLabel />
                <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                  <Link to={`/materi/${materialId}`}>
                    <ArrowLeft className="h-3 w-3 mr-2" /> Kembali ke Detail
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center space-y-2">
                <Bot className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm font-medium">Tanya Jawab Umum</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                Mode Tutor
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {learningModes.map((m) => (
                <Button
                  key={m.id}
                  variant={mode === m.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left h-auto py-2 px-3",
                    mode === m.id && "bg-primary/10 border-primary/20 border"
                  )}
                  onClick={() => setMode(m.id)}
                >
                  <div className="truncate">
                    <p className="font-semibold text-xs">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{m.description}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </Layout>
  );
}
