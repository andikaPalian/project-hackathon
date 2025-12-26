import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { GradientButton } from '@/components/ui/GradientButton';
import { mockMaterials, mockTopics } from '@/data/mockData';
import { toast } from 'sonner';

export default function QuizCreate() {
  const [material, setMaterial] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState([50]);
  const [count, setCount] = useState('10');
  const navigate = useNavigate();

  const topics = mockTopics.filter(t => t.materialId === material);
  const diffLabel = difficulty[0] < 33 ? 'Mudah' : difficulty[0] < 66 ? 'Sedang' : 'Sulit';

  const handleCreate = () => {
    toast.success('Quiz berhasil dibuat!');
    navigate('/quiz/1');
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Buat Quiz</h1>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Pilih Materi</Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger><SelectValue placeholder="Pilih materi" /></SelectTrigger>
                <SelectContent>{mockMaterials.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pilih Topik</Label>
              <Select value={topic} onValueChange={setTopic} disabled={!material}>
                <SelectTrigger><SelectValue placeholder="Pilih topik" /></SelectTrigger>
                <SelectContent>{topics.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><Label>Tingkat Kesulitan</Label><span className="text-sm font-medium text-primary">{diffLabel}</span></div>
              <Slider value={difficulty} onValueChange={setDifficulty} max={100} step={1} className="py-4" />
            </div>
            <div className="space-y-2">
              <Label>Jumlah Soal</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 soal</SelectItem>
                  <SelectItem value="10">10 soal</SelectItem>
                  <SelectItem value="15">15 soal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <GradientButton className="w-full" onClick={handleCreate} disabled={!material || !topic}>Buat Quiz</GradientButton>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}