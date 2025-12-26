import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientButton } from '@/components/ui/GradientButton';
import { useUser } from '@/contexts/UserContext';
import { gayaBelajarOptions } from '@/data/mockData';
import { Eye, FileText, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const iconMap = { Eye, FileText, ListOrdered };

export default function Settings() {
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [gayaBelajar, setGayaBelajar] = useState(user?.gayaBelajar || 'step-by-step');

  const handleSave = () => {
    updateUser({ name, email, gayaBelajar });
    toast.success('Pengaturan berhasil disimpan!');
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Profil</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Gaya Belajar</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {gayaBelajarOptions.map(opt => {
                const Icon = iconMap[opt.icon as keyof typeof iconMap];
                return (
                  <div key={opt.id} className={cn('p-4 rounded-lg border cursor-pointer transition-all', gayaBelajar === opt.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50')} onClick={() => setGayaBelajar(opt.id)}>
                    <div className="flex items-center gap-3">
                      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', gayaBelajar === opt.id ? 'gradient-primary' : 'bg-muted')}>
                        <Icon className={cn('h-5 w-5', gayaBelajar === opt.id ? 'text-primary-foreground' : 'text-muted-foreground')} />
                      </div>
                      <div>
                        <p className="font-medium">{opt.title}</p>
                        <p className="text-sm text-muted-foreground">{opt.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 p-4 rounded-lg border-2 border-primary bg-background text-center">
                  <div className="h-8 w-8 mx-auto mb-2 rounded gradient-primary" />
                  <p className="text-sm font-medium">Light Purple</p>
                </div>
                <div className="flex-1 p-4 rounded-lg border bg-muted text-center opacity-50">
                  <div className="h-8 w-8 mx-auto mb-2 rounded bg-foreground/20" />
                  <p className="text-sm font-medium">Coming Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <GradientButton className="w-full" onClick={handleSave}>Simpan Pengaturan</GradientButton>
        </div>
      </div>
    </Layout>
  );
}