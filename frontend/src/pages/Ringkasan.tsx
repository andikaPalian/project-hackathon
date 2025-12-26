import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { mockMaterials, mataKuliahList } from '@/data/mockData';
import { FileCheck, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const summaryContent = {
  title: 'Ringkasan: Process Management & Scheduling',
  sections: [
    { title: '1. Process & Thread', points: ['Process = program yang sedang dieksekusi', 'Thread = unit eksekusi terkecil dalam process', 'Thread berbagi memory space dengan parent process'] },
    { title: '2. CPU Scheduling', points: ['Menentukan proses mana yang dieksekusi CPU', 'Kriteria: CPU utilization, throughput, turnaround time', 'Algoritma: FCFS, SJF, Round Robin, Priority'] },
    { title: '3. Context Switching', points: ['Proses menyimpan dan memuat state CPU', 'Overhead yang perlu diminimalkan', 'Lebih cepat antar thread daripada antar process'] },
  ],
  checklist: ['Pahami perbedaan Process vs Thread', 'Hafal kriteria scheduling', 'Bisa menghitung turnaround time', 'Pahami kelebihan/kekurangan setiap algoritma'],
};

export default function Ringkasan() {
  const [mataKuliah, setMataKuliah] = useState('');
  const [material, setMaterial] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);

  const materials = mockMaterials.filter(m => m.mataKuliah === mataKuliah);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      toast.success('Ringkasan berhasil dibuat!');
    }, 2000);
  };

  const toggleCheck = (item: string) => {
    setChecked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Ringkasan UTS / UAS</h1>

        {!generated ? (
          <Card className="max-w-xl mx-auto">
            <CardContent className="p-6 space-y-4">
              <div className="h-16 w-16 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-4">
                <FileCheck className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="text-center text-muted-foreground mb-4">Generate ringkasan materi untuk persiapan ujianmu.</p>
              <Select value={mataKuliah} onValueChange={v => { setMataKuliah(v); setMaterial(''); }}>
                <SelectTrigger><SelectValue placeholder="Pilih Mata Kuliah" /></SelectTrigger>
                <SelectContent>{mataKuliahList.map(mk => <SelectItem key={mk} value={mk}>{mk}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={material} onValueChange={setMaterial} disabled={!mataKuliah}>
                <SelectTrigger><SelectValue placeholder="Pilih Materi" /></SelectTrigger>
                <SelectContent>{materials.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}</SelectContent>
              </Select>
              <GradientButton className="w-full" onClick={handleGenerate} disabled={!material || loading}>
                {loading ? 'Generating...' : <><Sparkles className="h-4 w-4 mr-2" />Generate Ringkasan</>}
              </GradientButton>
            </CardContent>
          </Card>
        ) : loading ? (
          <LoadingSkeleton variant="card" count={3} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{summaryContent.title}</CardTitle>
                <Button variant="outline" onClick={() => toast.success('PDF akan didownload')}><Download className="h-4 w-4 mr-2" />Export PDF</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {summaryContent.sections.map((section, i) => (
                  <div key={i}>
                    <h3 className="font-semibold mb-2">{section.title}</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {section.points.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Checklist Belajar</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {summaryContent.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Checkbox id={`check-${i}`} checked={checked.includes(item)} onCheckedChange={() => toggleCheck(item)} />
                    <label htmlFor={`check-${i}`} className={checked.includes(item) ? 'line-through text-muted-foreground' : ''}>{item}</label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={() => setGenerated(false)}>Buat Ringkasan Lain</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}