import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { GradientButton } from "@/components/ui/GradientButton";
import { mockMaterials, mockTopics } from "@/data/mockData";
import { toast } from "sonner";
import api from "@/utils/api";
import { BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuizCreate() {
  const [searchParams] = useSearchParams();
  const materialIdFromUrl = searchParams.get("materialId");

  const [materials, setMaterials] = useState<any[]>([]); // State untuk data materi asli
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [difficulty, setDifficulty] = useState([50]);
  const [count, setCount] = useState("5");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get("/materials");
        const data = response.data.data || [];
        setMaterials(data);

        if (materialIdFromUrl) {
          setSelectedMaterialId(materialIdFromUrl);
        }
      } catch (error) {
        toast.error("Failed to fetch materials.");
      }
    };
    fetchMaterials();
  }, [materialIdFromUrl]);

  const diffLabel = difficulty[0] < 33 ? "Mudah" : difficulty[0] < 66 ? "Sedang" : "Sulit";

  const handleCreate = async () => {
    if (!selectedMaterialId) return;

    const selectedMaterial = materials.find((m) => m.id === selectedMaterialId);
    const materialTitle = selectedMaterial ? selectedMaterial.title : "Quiz Materi";

    setIsLoading(true);
    try {
      const response = await api.post("/ai/quiz", {
        topic: materialTitle,
        materialId: selectedMaterialId,
        amount: parseInt(count),
        difficulty: diffLabel,
      });

      if (response.data.success) {
        toast.success("Quiz berhasil dibuat!");
        navigate(`/quiz/${response.data.quizId}`);
      }
    } catch (error) {
      error;
      toast.error(error.response?.data?.message || "Failed to create quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentMaterial = materials.find((m) => m.id === selectedMaterialId);

  return (
    <Layout showFooter={false}>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Buat Quiz dengan AI</h1>

        <Card className="overflow-hidden border-primary/20">
          <CardContent className="p-0">
            {/* Header Info Materi (Jika otomatis terpilih) */}
            {currentMaterial && (
              <div className="bg-primary/5 p-4 border-b flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Materi Terpilih
                  </p>
                  <p className="text-sm font-bold">{currentMaterial.title}</p>
                </div>
              </div>
            )}

            <div className="p-6 space-y-8">
              {/* Sembunyikan Select jika datang dari halaman detail, atau biarkan tetap ada untuk fleksibilitas */}
              <div className="space-y-2">
                <Label>Pilih Materi Belajar</Label>
                <Select
                  value={selectedMaterialId}
                  onValueChange={setSelectedMaterialId}
                  disabled={!!materialIdFromUrl} // Kunci input jika datang dari detail materi
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Pilih materi untuk diuji" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {materialIdFromUrl && (
                  <p className="text-[10px] text-muted-foreground italic">
                    *Materi dikunci karena Anda datang dari halaman detail materi.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <Label>Tingkat Kesulitan</Label>
                    <p className="text-xs text-muted-foreground">Sesuaikan tantangan kuis Anda</p>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      difficulty[0] < 33
                        ? "bg-green-100 text-green-700"
                        : difficulty[0] < 66
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {diffLabel}
                  </span>
                </div>
                <Slider
                  value={difficulty}
                  onValueChange={setDifficulty}
                  max={100}
                  step={1}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Jumlah Soal</Label>
                <Select value={count} onValueChange={setCount}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Soal (Singkat)</SelectItem>
                    <SelectItem value="10">10 Soal (Standar)</SelectItem>
                    <SelectItem value="15">15 Soal (Mendalam)</SelectItem>
                    <SelectItem value="20">20 Soal (Ujian)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <GradientButton
                className="w-full h-12 text-lg shadow-lg"
                onClick={handleCreate}
                disabled={!selectedMaterialId || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Menyusun Pertanyaan...
                  </>
                ) : (
                  "Buat Quiz Sekarang"
                )}
              </GradientButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
