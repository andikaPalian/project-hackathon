import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useUser } from '@/contexts/UserContext';
import { mockMaterials, mockUser } from '@/data/mockData';
import { Upload, BookOpen, ClipboardList, FileCheck, Flame, Calendar, Sparkles } from 'lucide-react';

const quickActions = [
  { icon: Upload, label: 'Upload Materi', href: '/materi', color: 'bg-primary/10 text-primary' },
  { icon: BookOpen, label: 'Lanjut Belajar', href: '/belajar', color: 'bg-success/10 text-success' },
  { icon: ClipboardList, label: 'Buat Quiz', href: '/quiz/create', color: 'bg-warning/10 text-warning' },
  { icon: FileCheck, label: 'Ringkasan', href: '/ringkasan', color: 'bg-accent text-accent-foreground' },
];

export default function Dashboard() {
  const { user } = useUser();
  const displayUser = user || mockUser;

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Halo, {displayUser.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground">Siap untuk belajar hari ini?</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Recommendation */}
            <Card className="gradient-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm opacity-90 mb-1">Rekomendasi Belajar Hari Ini</p>
                    <h3 className="text-lg font-semibold mb-2">Fokus 30 menit: CPU Scheduling</h3>
                    <p className="text-sm opacity-80 mb-4">Topik ini masih perlu diperkuat. Lanjutkan dari subtopik "FCFS Algorithm".</p>
                    <GradientButton variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0" asChild>
                      <Link to="/belajar/2">Mulai Belajar</Link>
                    </GradientButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map(action => (
                <Link key={action.label} to={action.href}>
                  <Card className="hover-lift cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Recent Materials */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Materi Terakhir</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link to="/materi">Lihat Semua</Link></Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockMaterials.slice(0, 3).map(material => (
                  <Link key={material.id} to={`/materi/${material.id}`} className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{material.title}</p>
                        <p className="text-sm text-muted-foreground">{material.mataKuliah} • {material.topicCount} topik</p>
                      </div>
                      <StatusBadge status={material.status} />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Progres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Overall Mastery</span>
                    <span className="font-semibold">{displayUser.totalMastery}%</span>
                  </div>
                  <ProgressBar value={displayUser.totalMastery} size="md" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10">
                  <Flame className="h-8 w-8 text-warning" />
                  <div>
                    <p className="font-semibold">{displayUser.streak} Hari</p>
                    <p className="text-sm text-muted-foreground">Learning Streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">15 Jan 2024</p>
                    <p className="text-sm text-muted-foreground">Terakhir Belajar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lanjutkan Topik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">CPU Scheduling</p>
                  <p className="text-sm text-muted-foreground">Sistem Operasi</p>
                  <ProgressBar value={45} size="sm" showLabel />
                </div>
                <GradientButton className="w-full mt-4" asChild>
                  <Link to="/belajar/2">Lanjut Belajar</Link>
                </GradientButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}