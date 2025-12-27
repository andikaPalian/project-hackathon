import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2 } from "lucide-react";

export default function QuizCreate() {
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
        setMaterials(response.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch materials.");
      }
    };
    fetchMaterials();
  }, []);

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
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Buat Quiz dengan AI</h1>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Pilih Materi Belajar</Label>
              <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Tingkat Kesulitan</Label>
                <span className="text-sm font-medium text-primary">{diffLabel}</span>
              </div>
              <Slider
                value={difficulty}
                onValueChange={setDifficulty}
                max={100}
                step={1}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label>Jumlah Soal</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 soal</SelectItem>
                  <SelectItem value="10">10 soal</SelectItem>
                  <SelectItem value="15">15 soal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <GradientButton
              className="w-full"
              onClick={handleCreate}
              disabled={!selectedMaterialId || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI sedang menyusun soal...
                </>
              ) : (
                "Buat Quiz Sekarang"
              )}
            </GradientButton>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
