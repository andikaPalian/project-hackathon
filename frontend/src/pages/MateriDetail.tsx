import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/GradientButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { mockMaterials, mockTopics } from '@/data/mockData';
import { Sparkles, ClipboardList, FileCheck, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MateriDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(mockTopics[0]);
  
  const material = mockMaterials.find(m => m.id === id) || mockMaterials[0];
  const topics = mockTopics.filter(t => t.materialId === material.id);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{material.mataKuliah}</p>
            <h1 className="text-2xl font-bold">{material.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGenerate}><Sparkles className="h-4 w-4 mr-2" />Generate Breakdown</Button>
            <Button variant="outline" asChild><Link to="/quiz/create"><ClipboardList className="h-4 w-4 mr-2" />Buat Quiz</Link></Button>
            <Button variant="outline" asChild><Link to="/ringkasan"><FileCheck className="h-4 w-4 mr-2" />Ringkasan</Link></Button>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton variant="card" count={3} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Topic Tree */}
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle className="text-lg">Daftar Topik</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {topics.map(topic => (
                  <div key={topic.id} className={cn('p-3 rounded-lg border cursor-pointer transition-colors', selectedTopic.id === topic.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50')} onClick={() => setSelectedTopic(topic)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{topic.title}</span>
                      <StatusBadge status={topic.difficulty} />
                    </div>
                    <ProgressBar value={topic.mastery} size="sm" />
                    <div className="mt-2 space-y-1">
                      {topic.subtopics.map(sub => (
                        <div key={sub.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className={cn('h-2 w-2 rounded-full', sub.completed ? 'bg-success' : 'bg-muted')} />
                          {sub.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedTopic.title}</CardTitle>
                    <StatusBadge status={selectedTopic.difficulty} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Ringkasan Konsep</h4>
                    <p className="text-muted-foreground">Process adalah program yang sedang dieksekusi oleh CPU. Setiap process memiliki address space sendiri yang terisolasi. Thread adalah unit eksekusi terkecil dalam sebuah process yang berbagi address space dengan thread lain dalam process yang sama.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">✨ Poin Penting</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Process memiliki memory space terisolasi</li>
                      <li>Thread berbagi memory dengan process parent</li>
                      <li>Context switch antar thread lebih cepat daripada antar process</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">💡 Contoh Sederhana</h4>
                    <p className="text-muted-foreground">Bayangkan sebuah browser sebagai process. Setiap tab yang kamu buka adalah thread yang berbeda dalam process browser tersebut. Semua tab bisa mengakses data browser yang sama.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">⚠️ Bagian yang Sering Membingungkan</h4>
                    <p className="text-muted-foreground">Banyak yang salah paham bahwa thread adalah process kecil. Sebenarnya thread adalah bagian dari process dan tidak bisa berdiri sendiri tanpa process parent.</p>
                  </div>
                  <GradientButton className="w-full" asChild>
                    <Link to={`/belajar/${selectedTopic.id}`}>Mulai Belajar Topik Ini<ChevronRight className="h-4 w-4 ml-2" /></Link>
                  </GradientButton>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}