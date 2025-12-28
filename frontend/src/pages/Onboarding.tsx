import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/ui/GradientButton";
import { useUser } from "@/contexts/UserContext";
import { jurusanList, mataKuliahList, gayaBelajarOptions, tujuanOptions } from "@/data/mockData";
import { Eye, FileText, ListOrdered, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const iconMap = { Eye, FileText, ListOrdered };

export default function Onboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [jurusan, setJurusan] = useState("");
  const [mataKuliah, setMataKuliah] = useState<string[]>([]);
  const [gayaBelajar, setGayaBelajar] = useState("");
  const [tujuan, setTujuan] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const { completeOnboarding } = useUser();
  const navigate = useNavigate();

  const filteredJurusan = jurusanList.filter((j) => j.toLowerCase().includes(search.toLowerCase()));

  const toggleMataKuliah = (mk: string) => {
    setMataKuliah((prev) => (prev.includes(mk) ? prev.filter((m) => m !== mk) : [...prev, mk]));
  };

  const toggleTujuan = (t: string) => {
    setTujuan((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding({
        major: jurusan,
        subjects: mataKuliah,
        learningStyle: gayaBelajar,
        goal: tujuan,
      });
      toast.success("Setup selesai| Selamat belajar!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!jurusan;
    if (step === 2) return mataKuliah.length > 0;
    if (step === 3) return !!gayaBelajar;
    return true;
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step >= s
                      ? "gradient-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 4 && (
                  <div className={cn("w-12 h-0.5 mx-1", step > s ? "bg-primary" : "bg-muted")} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Jurusan */}
          {step === 1 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Pilih Jurusan</h2>
                <p className="text-muted-foreground mb-4">
                  Kami akan menyesuaikan rekomendasi berdasarkan jurusanmu.
                </p>
                <Input
                  placeholder="Cari jurusan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-4"
                />
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {filteredJurusan.map((j) => (
                    <Button
                      key={j}
                      variant={jurusan === j ? "default" : "outline"}
                      className={cn("justify-start", jurusan === j && "gradient-primary")}
                      onClick={() => setJurusan(j)}
                    >
                      {j}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Mata Kuliah */}
          {step === 2 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Pilih Mata Kuliah</h2>
                <p className="text-muted-foreground mb-4">
                  Pilih mata kuliah yang sedang kamu ambil semester ini.
                </p>
                <div className="flex flex-wrap gap-2">
                  {mataKuliahList.map((mk) => (
                    <Badge
                      key={mk}
                      variant={mataKuliah.includes(mk) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer py-2 px-3",
                        mataKuliah.includes(mk) && "gradient-primary"
                      )}
                      onClick={() => toggleMataKuliah(mk)}
                    >
                      {mk}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Gaya Belajar */}
          {step === 3 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Gaya Belajar</h2>
                <p className="text-muted-foreground mb-4">
                  Pilih cara belajar yang paling cocok untukmu.
                </p>
                <div className="grid gap-3">
                  {gayaBelajarOptions.map((opt) => {
                    const Icon = iconMap[opt.icon as keyof typeof iconMap];
                    return (
                      <Card
                        key={opt.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          gayaBelajar === opt.id && "ring-2 ring-primary"
                        )}
                        onClick={() => setGayaBelajar(opt.id)}
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          <div
                            className={cn(
                              "h-12 w-12 rounded-lg flex items-center justify-center",
                              gayaBelajar === opt.id ? "gradient-primary" : "bg-muted"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-6 w-6",
                                gayaBelajar === opt.id
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{opt.title}</p>
                            <p className="text-sm text-muted-foreground">{opt.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Tujuan */}
          {step === 4 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  Tujuan Belajar{" "}
                  <span className="text-muted-foreground font-normal">(opsional)</span>
                </h2>
                <p className="text-muted-foreground mb-4">Apa yang ingin kamu capai dengan KIRA?</p>
                <div className="space-y-2">
                  {tujuanOptions.map((t) => (
                    <Card
                      key={t.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        tujuan.includes(t.id) && "ring-2 ring-primary"
                      )}
                      onClick={() => toggleTujuan(t.id)}
                    >
                      <CardContent className="flex items-center gap-3 p-4">
                        <div
                          className={cn(
                            "h-5 w-5 rounded border-2 flex items-center justify-center",
                            tujuan.includes(t.id)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground"
                          )}
                        >
                          {tujuan.includes(t.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span>{t.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Kembali
            </Button>
            {step < 4 ? (
              <GradientButton onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
                Lanjut
                <ChevronRight className="h-4 w-4 ml-1" />
              </GradientButton>
            ) : (
              <GradientButton onClick={handleComplete} disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan & Lanjut"}
              </GradientButton>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
