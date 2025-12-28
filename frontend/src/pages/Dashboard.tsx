import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/GradientButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useUser } from "@/contexts/UserContext";
import { mockMaterials, mockUser } from "@/data/mockData";
import {
  Upload,
  BookOpen,
  ClipboardList,
  FileCheck,
  Flame,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { toast } from "sonner";

const quickActions = [
  { icon: Upload, label: "Upload Materi", href: "/materi", color: "bg-primary/10 text-primary" },
  {
    icon: BookOpen,
    label: "Lanjut Belajar",
    href: "/belajar",
    color: "bg-success/10 text-success",
  },
  {
    icon: ClipboardList,
    label: "Buat Quiz",
    href: "/quiz/create",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: FileCheck,
    label: "Ringkasan",
    href: "/ringkasan",
    color: "bg-accent text-accent-foreground",
  },
];

export default function Dashboard() {
  const { user } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Menggunakan endpoint stats yang sudah kita buat karena datanya identik
        const response = await api.get("/stats");
        setData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <Layout>
        <div className="container py-8">
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </Layout>
    );

  const lastMaterial = data?.topicProgress?.[0];

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Halo, {user?.name?.split(" ")[0] || "Mahasiswa"} 👋
          </h1>
          <p className="text-muted-foreground">Siap untuk belajar hari ini?</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="gradient-primary text-primary-foreground overflow-hidden border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm opacity-90 mb-1">Rekomendasi Belajar</p>
                    <h3 className="text-lg font-semibold mb-2">
                      {lastMaterial
                        ? `Lanjutkan: ${lastMaterial.title}`
                        : "Mulai petualangan belajarmu!"}
                    </h3>
                    <p className="text-sm opacity-80 mb-4">
                      {lastMaterial
                        ? `Mastery kamu di topik ini adalah ${lastMaterial.mastery}%. Tingkatkan lagi dengan mengerjakan Quiz!`
                        : "Upload materi kuliahmu dan biarkan AI membantu kamu belajar lebih cepat."}
                    </p>
                    <GradientButton
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-0"
                      asChild
                    >
                      <Link to={lastMaterial ? `/materi/${lastMaterial.id}` : "/materi"}>
                        {lastMaterial ? "Lanjut Belajar" : "Upload Sekarang"}
                      </Link>
                    </GradientButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.href}>
                  <Card className="hover-lift cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div
                        className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}
                      >
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
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/materi">Lihat Semua</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.topicProgress?.slice(0, 3).map((material: any) => (
                  <Link key={material.id} to={`/materi/${material.id}`} className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{material.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Mastery: {material.mastery}%
                        </p>
                      </div>
                      <StatusBadge
                        status={material.mastery >= 80 ? "dikuasai" : "sedang_belajar"}
                      />
                    </div>
                  </Link>
                ))}
                {(!data?.topicProgress || data.topicProgress.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground text-sm italic">
                    Belum ada materi yang diupload.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Progres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Overall Mastery</span>
                    <span className="font-semibold">{data?.totalMastery || 0}%</span>
                  </div>
                  <ProgressBar value={data?.totalMastery || 0} size="md" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <Flame className="h-8 w-8 text-warning" />
                  <div>
                    <p className="font-semibold">{data?.streak || 0} Hari</p>
                    <p className="text-xs text-muted-foreground">Learning Streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">
                      {new Date().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">Hari Ini</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Last Topic Sidebar */}
            {lastMaterial && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lanjutkan Topik</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium truncate">{lastMaterial.title}</p>
                    <p className="text-xs text-muted-foreground">Mastery saat ini:</p>
                    <ProgressBar value={lastMaterial.mastery} size="sm" />
                  </div>
                  <GradientButton className="w-full mt-4" asChild>
                    <Link to={`/materi/${lastMaterial.id}`}>Lanjut Belajar</Link>
                  </GradientButton>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
