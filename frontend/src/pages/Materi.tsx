import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GradientButton } from '@/components/ui/GradientButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockMaterials, mataKuliahList } from '@/data/mockData';
import { Search, Upload, Grid, List, FileText, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Materi() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  const filtered = mockMaterials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.mataKuliah === filter;
    return matchSearch && matchFilter;
  });

  const handleUpload = () => {
    toast.success('Materi berhasil diupload!');
    setUploadOpen(false);
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Materi</h1>
            <p className="text-muted-foreground">Kelola materi kuliahmu</p>
          </div>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <GradientButton><Upload className="h-4 w-4 mr-2" />Upload Materi</GradientButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Upload Materi</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="font-medium">Drag & drop atau klik untuk upload</p>
                  <p className="text-sm text-muted-foreground">PDF, PPT, PPTX (max 50MB)</p>
                </div>
                <Select><SelectTrigger><SelectValue placeholder="Pilih Mata Kuliah" /></SelectTrigger><SelectContent>{mataKuliahList.map(mk => <SelectItem key={mk} value={mk}>{mk}</SelectItem>)}</SelectContent></Select>
                <Input placeholder="Judul Materi" />
                <GradientButton className="w-full" onClick={handleUpload}>Upload</GradientButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari materi..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Mata Kuliah</SelectItem>
              {mataKuliahList.map(mk => <SelectItem key={mk} value={mk}>{mk}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex border rounded-lg">
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}><Grid className="h-4 w-4" /></Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <EmptyState icon={<FileText className="h-8 w-8 text-muted-foreground" />} title="Belum ada materi" description="Upload PPT atau PDF pertamamu untuk mulai belajar." action={<GradientButton onClick={() => setUploadOpen(true)}><Upload className="h-4 w-4 mr-2" />Upload Materi</GradientButton>} />
        ) : (
          <div className={cn(view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3')}>
            {filtered.map(m => (
              <Link key={m.id} to={`/materi/${m.id}`}>
                <Card className="hover-lift h-full">
                  <CardContent className={cn('p-4', view === 'list' && 'flex items-center justify-between')}>
                    <div className={view === 'list' ? 'flex items-center gap-4' : ''}>
                      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', m.fileType === 'pdf' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning')}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className={view === 'grid' ? 'mt-3' : ''}>
                        <p className="font-medium">{m.title}</p>
                        <p className="text-sm text-muted-foreground">{m.mataKuliah} • {m.topicCount} topik</p>
                      </div>
                    </div>
                    <StatusBadge status={m.status} className={view === 'grid' ? 'mt-3' : ''} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}