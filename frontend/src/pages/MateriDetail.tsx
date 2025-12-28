import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/GradientButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Sparkles,
  ClipboardList,
  FileCheck,
  ChevronRight,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/utils/api";
import { toast } from "sonner";

export default function MateriDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [material, setMaterial] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  // const material = mockMaterials.find((m) => m.id === id) || mockMaterials[0];
  // const topics = mockTopics.filter((t) => t.materialId === material.id);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/materials/${id}`);
        const result = response.data.data;

        setMaterial(result);

        if (result.topics && result.topics.length > 0) {
          setSelectedTopic(result.topics[0]);
        }
      } catch (error) {
        toast.error("Failed to fetch material details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      toast.info("AI is generating topics...");
      await api.post(`/ai/materials/${id}/generate`);

      toast.success("Topics generated successfully!");

      const updated = await api.get(`/materials/${id}`);
      setMaterial(updated.data || updated.data.data);
      if (updated.data.topics && updated.data.topics.length > 0) {
        setSelectedTopic(updated.data.topics[0] || updated.data.data.topics[0]);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to generate topics.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="container py-8">
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </Layout>
    );

  if (!material)
    return (
      <Layout>
        <div className="container py-8 text-center">Materi tidak ditemukan</div>
      </Layout>
    );

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{material.subject}</p>
            {/* <h1 className="text-2xl font-bold">{material.title}</h1> */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{material.title}</h1>
              {material.lastScore !== null && material.lastScore !== undefined && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Skor: {material.lastScore}%
                </span>
              )}
            </div>
            <div className="mt-2">
              <StatusBadge status={material.status} />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
              <Sparkles className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
              {isGenerating ? "Processing..." : "Generate Breakdown"}
            </Button>
            <Button variant={material.associatedQuizId ? "default" : "outline"} asChild>
              <Link
                to={
                  !material.associatedQuizId
                    ? `/quiz/create?materialId=${id}` // Kondisi 1: Belum ada kuis
                    : material.lastScore !== null && material.lastScore !== undefined
                    ? `/quiz/result/${material.associatedQuizId}` // Kondisi 3: Sudah selesai
                    : `/quiz/take/${material.associatedQuizId}` // Kondisi 2: Belum selesai
                }
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                {!material.associatedQuizId
                  ? "Buat Quiz"
                  : material.lastScore !== null && material.lastScore !== undefined
                  ? "Lihat Hasil Quiz"
                  : "Lanjut Kuis"}
              </Link>
            </Button>
            <Button variant={material.examSummary ? "default" : "outline"} asChild>
              <Link to={`/ringkasan?materialId=${id}&autoGenerate=true`}>
                <FileCheck className="h-4 w-4 mr-2" />
                {material.examSummary ? "Lihat Ringkasan" : "Ringkasan"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel Kiri: Daftar Topik */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Daftar Topik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {material.topics && material.topics.length > 0 ? (
                material.topics.map((topic: any, idx: number) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedTopic?.title === topic.title
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{topic.title}</span>
                      <StatusBadge status={topic.difficulty} />
                    </div>
                    <ProgressBar value={topic.mastery || 0} size="sm" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border-2 border-dashed rounded-lg">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Belum ada topik.
                    <br />
                    Klik Generate Breakdown.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Panel Kanan: Konten Topik */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              {selectedTopic ? (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedTopic?.title}</CardTitle>
                      <StatusBadge status={selectedTopic?.difficulty} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Ringkasan Konsep
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {selectedTopic?.summary}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-sm">✨ Poin Penting</h4>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                          {selectedTopic.keyPoints?.map((p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-sm">💡 Contoh</h4>
                        <p className="text-xs text-muted-foreground">{selectedTopic.example}</p>
                      </div>
                    </div>
                    <GradientButton className="w-full" asChild>
                      <Link to={`/belajar/${id}/${encodeURIComponent(selectedTopic.title)}`}>
                        Mulai Belajar Topik Ini
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </GradientButton>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <Sparkles className="h-12 w-12 text-primary/20 mb-4" />
                  <h3 className="text-lg font-medium">Materi Belum Dibedah</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    Gunakan AI untuk memecah materi ini menjadi topik-topik kecil yang mudah
                    dipelajari.
                  </p>
                  <GradientButton onClick={handleGenerate} disabled={isGenerating}>
                    Bedah Materi Sekarang
                  </GradientButton>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
