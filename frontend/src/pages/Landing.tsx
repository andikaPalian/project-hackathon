import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { GradientButton } from '@/components/ui/GradientButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Bot, Sliders, ClipboardList, TrendingUp, FileCheck, Settings, BookOpen, Sparkles, CheckCircle } from 'lucide-react';
import { testimonials, faqItems } from '@/data/mockData';

const features = [
  { icon: Upload, title: 'Upload Materi Kuliah', description: 'Upload PDF atau PPT, KARI akan memecahnya menjadi topik-topik yang mudah dipahami.' },
  { icon: Bot, title: 'AI Tutor Step-by-Step', description: 'Belajar interaktif dengan AI yang membimbing kamu memahami konsep.' },
  { icon: Sliders, title: 'Adaptive Difficulty', description: 'Tingkat kesulitan menyesuaikan dengan pemahamanmu.' },
  { icon: ClipboardList, title: 'Quiz Generator', description: 'Buat quiz otomatis lengkap dengan pembahasan detail.' },
  { icon: TrendingUp, title: 'Progress Tracking', description: 'Pantau perkembangan belajarmu dengan visualisasi yang jelas.' },
  { icon: FileCheck, title: 'Ringkasan UTS/UAS', description: 'Generate ringkasan materi untuk persiapan ujian.' },
];

const steps = [
  { number: '1', title: 'Setup Awal', description: 'Pilih jurusan, mata kuliah, dan gaya belajarmu.' },
  { number: '2', title: 'Upload Materi', description: 'Upload file PPT atau PDF materi kuliahmu.' },
  { number: '3', title: 'AI Memecah Konsep', description: 'KARI memecah materi menjadi topik-topik terstruktur.' },
  { number: '4', title: 'Belajar & Evaluasi', description: 'Belajar interaktif, latihan quiz, dan track progress.' },
];

export default function Landing() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Belajar Jadi Terarah,{' '}
              <span className="gradient-text">Bukan Sekadar Jawaban.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              KARI membantu kamu memahami materi kuliah step-by-step, menyesuaikan gaya belajar, dan mengatur prioritas belajar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton size="lg" asChild>
                <Link to="/register">Mulai Belajar</Link>
              </GradientButton>
              <Button variant="outline" size="lg" asChild>
                <Link to="#how-it-works">Lihat Cara Kerja KARI</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Semua yang kamu butuhkan untuk belajar lebih efektif.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-lift border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cara Kerja KARI</h2>
            <p className="text-muted-foreground">4 langkah mudah untuk mulai belajar lebih efektif.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Kata Mereka</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback className="bg-primary/10 text-primary">{t.avatar}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.jurusan}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Belajar Lebih Efektif?</h2>
          <p className="text-muted-foreground mb-8">Bergabung dengan ribuan mahasiswa yang sudah terbantu.</p>
          <GradientButton size="lg" asChild>
            <Link to="/register">Mulai Belajar Gratis</Link>
          </GradientButton>
        </div>
      </section>
    </Layout>
  );
}