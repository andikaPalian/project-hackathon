import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/GradientButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/utils/api";
import { toast } from "sonner";

export default function QuizTake() {
  const { quizId } = useParams(); // Ambil ID dari URL
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quiz/${quizId}`);
        setQuestions(response.data.data.questions || []);
      } catch (error) {
        toast.error("Gagal memuat soal kuis.");
        navigate("/quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, navigate]);

  const question = questions[current];
  const total = questions.length;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === question.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = async () => {
    if (current < total - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      // const finalScore = Math.round((score / total) * 100);
      const finalScore = Math.round(
        ((score + (selected === question.correctIndex ? 1 : 0)) / total) * 100
      );
      try {
        await api.patch(`/quiz/${quizId}/score`, { score: finalScore });
        toast.success("Progres belajar berhasil disimpan!");
      } catch (e) {
        console.error("Gagal simpan skor");
        toast.error("Gagal menyimpan hasil kuis.");
      }
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <Layout showFooter={false}>
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <Layout showFooter={false}>
        <div className="container py-16 max-w-lg text-center">
          <div
            className={cn(
              "h-24 w-24 mx-auto rounded-full flex items-center justify-center mb-6",
              pct >= 70 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
            )}
          >
            <span className="text-4xl font-bold">{pct}%</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Quiz Selesai!</h1>
          <p className="text-muted-foreground mb-6">
            Kamu menjawab {score} dari {total} soal dengan benar.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/quiz")}>
              Kembali ke Quiz
            </Button>
            <GradientButton onClick={() => navigate("/dashboard")}>Ke Dashboard</GradientButton>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="container py-8 max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Soal {current + 1} dari {total}
            </span>
            <span className="font-medium">{Math.round(((current + 1) / total) * 100)}%</span>
          </div>
          <ProgressBar value={((current + 1) / total) * 100} />
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-6">{question?.question}</h2>
            <div className="space-y-3">
              {question?.options.map((opt: string, idx: number) => {
                const isCorrect = idx === question.correctIndex;
                const isSelected = idx === selected;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={answered}
                    className={cn(
                      "w-full p-4 rounded-lg border text-left transition-all",
                      answered
                        ? isCorrect
                          ? "border-green-500 bg-green-50"
                          : isSelected
                          ? "border-red-500 bg-red-50"
                          : "opacity-50"
                        : isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {answered && isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      )}
                      {answered && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                      )}
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <p className="font-medium mb-2 text-blue-800">Pembahasan:</p>
                <p className="text-blue-700 text-sm">{question.explanation}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              {!answered ? (
                <GradientButton onClick={handleSubmit} disabled={selected === null}>
                  Jawab
                </GradientButton>
              ) : (
                <GradientButton onClick={handleNext}>
                  {current < total - 1 ? (
                    <>
                      Lanjut
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    "Lihat Hasil"
                  )}
                </GradientButton>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
