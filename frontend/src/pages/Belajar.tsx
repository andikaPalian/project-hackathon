import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockTopics, mockConversation, learningModes, quickPrompts, ChatMessage } from '@/data/mockData';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Belajar() {
  const { topicId } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>(mockConversation);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('step-by-step');
  const [isTyping, setIsTyping] = useState(false);
  
  const topic = mockTopics.find(t => t.id === topicId) || mockTopics[1];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Pertanyaan bagus! Mari kita bahas lebih dalam.\n\nDalam konteks CPU Scheduling, ada beberapa kriteria yang perlu dipertimbangkan:\n\n1. **CPU Utilization** - Seberapa sibuk CPU bekerja\n2. **Throughput** - Jumlah proses yang selesai per unit waktu\n3. **Turnaround Time** - Waktu total dari submit hingga selesai\n\nMana yang ingin kamu pelajari lebih detail?', timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Layout showFooter={false}>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0', msg.role === 'assistant' ? 'gradient-primary' : 'bg-muted')}>
                    {msg.role === 'assistant' ? <Bot className="h-4 w-4 text-primary-foreground" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={cn('max-w-[80%] rounded-2xl px-4 py-3', msg.role === 'assistant' ? 'bg-muted' : 'gradient-primary text-primary-foreground')}>
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    <p className={cn('text-xs mt-1', msg.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/70')}>{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center"><Bot className="h-4 w-4 text-primary-foreground" /></div>
                  <div className="bg-muted rounded-2xl px-4 py-3"><div className="flex gap-1"><span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" /><span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" /><span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" /></div></div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick prompts */}
          <div className="px-4 py-2 border-t">
            <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto pb-2">
              {quickPrompts.map(prompt => (
                <Button key={prompt} variant="outline" size="sm" className="shrink-0" onClick={() => sendMessage(prompt)}>{prompt}</Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="max-w-3xl mx-auto flex gap-2">
              <Input placeholder="Ketik pertanyaanmu..." value={input} onChange={e => setInput(e.target.value)} className="flex-1" />
              <Button type="submit" className="gradient-primary" disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </div>

        {/* Side Panel */}
        <div className="hidden lg:block w-80 border-l p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Topik Aktif</CardTitle></CardHeader>
            <CardContent>
              <p className="font-medium">{topic.title}</p>
              <p className="text-sm text-muted-foreground mb-2">Sistem Operasi</p>
              <ProgressBar value={topic.mastery} size="sm" showLabel />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Mode Belajar</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {learningModes.map(m => (
                <Button key={m.id} variant={mode === m.id ? 'secondary' : 'ghost'} className={cn('w-full justify-start text-left h-auto py-2', mode === m.id && 'bg-primary/10')} onClick={() => setMode(m.id)}>
                  <div><p className="font-medium text-sm">{m.label}</p><p className="text-xs text-muted-foreground">{m.description}</p></div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}