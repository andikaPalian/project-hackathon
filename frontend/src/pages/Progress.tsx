import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockUser, mockQuizzes, mockTopics, weeklyActivity } from '@/data/mockData';
import { Flame, TrendingUp, Target } from 'lucide-react';

export default function Progress() {
  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Progres Belajar</h1>

        {/* Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center">
                <Target className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">{mockUser.totalMastery}%</p>
                <p className="text-muted-foreground">Total Mastery</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-warning/20 flex items-center justify-center">
                <Flame className="h-7 w-7 text-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold">{mockUser.streak}</p>
                <p className="text-muted-foreground">Hari Streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-success/20 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold">{mockQuizzes.length}</p>
                <p className="text-muted-foreground">Quiz Selesai</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <Card>
            <CardHeader><CardTitle>Aktivitas Mingguan</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-40 gap-2">
                {weeklyActivity.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-muted rounded-t relative" style={{ height: `${Math.max(d.minutes, 5)}%` }}>
                      <div className="absolute inset-0 gradient-primary rounded-t" style={{ height: `${(d.minutes / 90) * 100}%`, bottom: 0, top: 'auto' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Topic Progress */}
          <Card>
            <CardHeader><CardTitle>Progress per Topik</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {mockTopics.map(topic => (
                <div key={topic.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{topic.title}</span>
                    <span className="text-muted-foreground">{topic.mastery}%</span>
                  </div>
                  <ProgressBar value={topic.mastery} size="sm" variant={topic.mastery >= 80 ? 'success' : topic.mastery >= 50 ? 'warning' : 'default'} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quiz History */}
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Riwayat Quiz</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Quiz</th>
                      <th className="text-left py-3 px-2 font-medium">Tanggal</th>
                      <th className="text-left py-3 px-2 font-medium">Kesulitan</th>
                      <th className="text-right py-3 px-2 font-medium">Skor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockQuizzes.map(q => (
                      <tr key={q.id} className="border-b last:border-0">
                        <td className="py-3 px-2">{q.title}</td>
                        <td className="py-3 px-2 text-muted-foreground">{q.completedAt}</td>
                        <td className="py-3 px-2"><span className={`text-sm ${q.difficulty === 'easy' ? 'text-success' : q.difficulty === 'medium' ? 'text-warning' : 'text-destructive'}`}>{q.difficulty === 'easy' ? 'Mudah' : q.difficulty === 'medium' ? 'Sedang' : 'Sulit'}</span></td>
                        <td className="py-3 px-2 text-right font-semibold">{q.score}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}