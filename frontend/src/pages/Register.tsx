import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/GradientButton';
import { useUser } from '@/contexts/UserContext';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Akun berhasil dibuat!');
      navigate('/onboarding');
    } catch {
      toast.error('Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Daftar ke KARI</CardTitle>
            <CardDescription>Mulai perjalanan belajar yang lebih terarah</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Nama kamu" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@university.ac.id" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
              <GradientButton type="submit" className="w-full" disabled={loading}>{loading ? 'Memproses...' : 'Daftar & Mulai Belajar'}</GradientButton>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">Sudah punya akun? <Link to="/login" className="text-primary hover:underline">Masuk</Link></p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}