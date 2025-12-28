import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GradientButton } from "@/components/ui/GradientButton";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { FileCheck, Download, Sparkles, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function Ringkasan() {
  const [mataKuliahList, setMataKuliahList] = useState<string[]>([]);
  const [allMaterials, setAllMaterials] = useState<any[]>([]);
  const [mataKuliah, setMataKuliah] = useState("");
  const [material, setMaterial] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [summaryContent, setSummaryContent] = useState<any>(null);

  const [searchParams] = useSearchParams();
  const materialIdParam = searchParams.get("materialId");
  const autoGenerate = searchParams.get("autoGenerate");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get("/materials");
        const data = response.data.data;
        setAllMaterials(data);

        const subjects = Array.from(new Set(data.map((m: any) => m.subject).filter(Boolean)));
        setMataKuliahList(subjects as string[]);

        if (materialIdParam) {
          const selectMat = data.find((m: any) => m.id === materialIdParam);
          if (selectMat) {
            setMataKuliah(selectMat.subject);
            setMaterial(selectMat.id);

            if (selectMat.examSummary) {
              setSummaryContent(selectMat.examSummary);
              setGenerated(true);
            } else if (autoGenerate === "true") {
              // Kita gunakan setTimeout sedikit agar state material ter-update dulu
              setTimeout(() => {
                handleGenerateAuto(selectMat.id, data);
              }, 100);
            }
          }
        }
      } catch (error) {
        toast.error("Failed to fetch materials.");
      }
    };
    fetchMaterials();
  }, [materialIdParam, autoGenerate]);

  const filteredMaterials = allMaterials.filter((m) => m.subject === mataKuliah);

  const cleanMarkdown = (text: string) => text.replace(/\*\*|\*/g, "");

  const handleExportPDF = () => {
    if (!summaryContent) return;

    const doc = new jsPDF();
    let cursorY = 20;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(cleanMarkdown(summaryContent.title || "Ringkasan Materi"), 10, cursorY);
    cursorY += 15;

    // Sections
    summaryContent.sections?.forEach((section: any) => {
      if (cursorY > 270) {
        doc.addPage();
        cursorY = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(cleanMarkdown(section.title), 10, cursorY);
      cursorY += 7;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      section.points?.forEach((point: string) => {
        const cleanedPoint = cleanMarkdown(point);
        const splitPoint = doc.splitTextToSize(`• ${cleanedPoint}`, 180);
        doc.text(splitPoint, 15, cursorY);
        cursorY += splitPoint.length * 6;
      });
      cursorY += 5;
    });

    if (cursorY > 250) {
      doc.addPage();
      cursorY = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Checklist Persiapan Ujian:", 10, cursorY);
    cursorY += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    summaryContent.checklist?.forEach((item: string) => {
      doc.text(`[ ] ${cleanMarkdown(item)}`, 15, cursorY);
      cursorY += 7;
    });

    doc.save(`Ringkasan_${mataKuliah || "Materi"}.pdf`);
    toast.success("PDF berhasil diunduh!");
  };

  const handleGenerate = async () => {
    if (!material) return;

    const selectedMat = allMaterials.find((m) => m.id === material);
    if (selectedMat?.examSummary) {
      setSummaryContent(selectedMat.examSummary);
      setGenerated(true);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/ai/summarize-material", {
        materialId: material,
      });

      if (response.data.success) {
        console.log("Data dari AI:", response.data.summary);
        const data = response.data.summary;
        setSummaryContent(data);
        setGenerated(true);
        toast.success("Ringkasan berhasil dibuat!");
      }
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAuto = async (id: string, currentMaterials: any[]) => {
    setLoading(true);
    try {
      const response = await api.post("/ai/summarize-material", {
        materialId: id,
      });

      if (response.data.success) {
        const data = response.data.summary;
        setSummaryContent(data);
        setGenerated(true);
        toast.success("Ringkasan berhasil dibuat!");
      }
    } catch (error) {
      toast.error("Gagal menjalankan AI otomatis.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (item: string) => {
    setChecked((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Ringkasan UTS / UAS</h1>

        {!generated ? (
          <Card className="max-w-xl mx-auto shadow-lg">
            <CardContent className="p-8 space-y-6">
              <div className="h-20 w-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
                <FileCheck className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="space-y-4 pt-4">
                <Select
                  value={mataKuliah}
                  onValueChange={(v) => {
                    setMataKuliah(v);
                    setMaterial("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Mata Kuliah" />
                  </SelectTrigger>
                  <SelectContent>
                    {mataKuliahList.map((mk) => (
                      <SelectItem key={mk} value={mk}>
                        {mk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={material} onValueChange={setMaterial} disabled={!mataKuliah}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Materi" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMaterials.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <GradientButton
                  className="w-full h-11"
                  onClick={handleGenerate}
                  disabled={!material || loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {loading ? "Menganalisis..." : "Generate Ringkasan"}
                </GradientButton>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => {
                  setGenerated(false);
                  setSummaryContent(null);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" /> Export PDF
              </Button>
            </div>

            <Card className="border-primary/20 shadow-md">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-xl text-primary font-bold">
                  {summaryContent?.title || "Hasil Analisis AI"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {typeof summaryContent === "string" ? (
                  <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                    <ReactMarkdown>{summaryContent}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {summaryContent?.sections?.map((section: any, i: number) => (
                      <div key={i} className="space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" /> {section.title}
                        </h3>
                        <ul className="grid gap-2 ml-4">
                          {section.points?.map((p: string, j: number) => (
                            <li
                              key={j}
                              className="text-muted-foreground flex items-start gap-2 text-sm"
                            >
                              <span className="text-primary mt-1">•</span>
                              <div className="flex-1 prose-sm">
                                <ReactMarkdown>{p}</ReactMarkdown>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {summaryContent?.checklist && (
              <Card className="border-primary/20 shadow-md bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" /> Checklist Belajar
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 p-6 pt-0">
                  {summaryContent.checklist.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-background p-3 rounded-lg border shadow-sm"
                    >
                      <Checkbox
                        id={`check-${i}`}
                        checked={checked.includes(item)}
                        onCheckedChange={() => toggleCheck(item)}
                      />
                      <label
                        htmlFor={`check-${i}`}
                        className={cn(
                          "text-sm font-medium cursor-pointer",
                          checked.includes(item) && "line-through text-muted-foreground"
                        )}
                      >
                        <ReactMarkdown>{item}</ReactMarkdown>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
