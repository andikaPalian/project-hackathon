import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { mockUser, mockQuizzes, mockTopics, weeklyActivity } from "@/data/mockData";
import { Flame, TrendingUp, Target, ClipboardList, AlertCircle } from "lucide-react";
import api from "@/utils/api";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { cn } from "@/lib/utils";

export default function Progress() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/stats");
        setData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch progress data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <Layout showFooter={false}>
        <div className="container py-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <LoadingSkeleton variant="card" count={3} />
          </div>
          <LoadingSkeleton variant="card" count={2} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Progres Belajar</h1>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/10 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <Target className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">{data?.totalMastery || 0}%</p>
                <p className="text-sm text-muted-foreground">Total Mastery</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <Flame className="h-7 w-7 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{data?.streak || 0}</p>
                <p className="text-sm text-muted-foreground">Hari Streak</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <TrendingUp className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{data?.quizCompleted || 0}</p>
                <p className="text-sm text-muted-foreground">Quiz Selesai</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Aktivitas Mingguan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-48 gap-3 pt-4 border-b">
                {data?.weeklyActivity && data.weeklyActivity.length > 0 ? (
                  data.weeklyActivity.map((d: any) => (
                    <div
                      key={d.day}
                      className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                    >
                      <div className="w-full bg-muted rounded-t-md relative h-full flex items-end">
                        <div
                          className="w-full gradient-primary rounded-t-md transition-all duration-700 ease-out"
                          style={{ height: `${d.percentage || 0}%` }}
                        />
                        {d.count > 0 && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary">
                            {d.count}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground mb-[-25px]">
                        {d.day}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex items-center justify-center h-full text-muted-foreground text-sm">
                    Belum ada aktivitas kuis minggu ini
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress per Materi */}
          <Card className="shadow-sm h-[300px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Progress per Materi</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-5 custom-scrollbar">
              {data?.topicProgress?.length > 0 ? (
                data.topicProgress.map((item: any) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate max-w-[200px]">{item.title}</span>
                      <span className="font-bold text-primary">{item.mastery || 0}%</span>
                    </div>
                    <ProgressBar
                      value={item.mastery || 0}
                      size="sm"
                      variant={
                        item.mastery >= 80 ? "success" : item.mastery >= 50 ? "warning" : "default"
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic">
                  <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">Belum ada materi.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quiz History Table */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Quiz Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="text-left py-4 px-2 font-semibold">Materi Quiz</th>
                      <th className="text-left py-4 px-2 font-semibold text-center">Tingkat</th>
                      <th className="text-left py-4 px-2 font-semibold">Tanggal</th>
                      <th className="text-right py-4 px-2 font-semibold">Skor Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data?.quizHistory?.length > 0 ? (
                      data.quizHistory.map((q: any) => (
                        <tr
                          key={q.id}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-4 px-2 font-medium">{q.topic || q.title}</td>
                          <td className="py-4 px-2 text-center">
                            <span
                              className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                                q.difficulty === "Mudah"
                                  ? "bg-green-100 text-green-700"
                                  : q.difficulty === "Sedang"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              )}
                            >
                              {q.difficulty}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-muted-foreground text-xs">
                            {q.completedAt}
                          </td>
                          <td className="py-4 px-2 text-right font-bold text-primary">
                            {q.lastScore ?? 0}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-muted-foreground">
                          Belum ada riwayat kuis.
                        </td>
                      </tr>
                    )}
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
