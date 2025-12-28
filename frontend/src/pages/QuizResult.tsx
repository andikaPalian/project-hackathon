import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import api from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function QuizResult() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/quiz/${quizId}`);
        setQuizData(response.data.data);
      } catch (error) {
        toast.error("Gagal memuat hasil kuis.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [quizId]);

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <Card className="text-center p-8 mb-8 bg-primary/5">
          <h1 className="text-3xl font-bold mb-2">Hasil Quiz: {quizData.topic}</h1>
          <div className="text-5xl font-extrabold text-primary mb-4">{quizData.lastScore}%</div>
          <p className="text-muted-foreground">
            Kerja bagus! Pelajari kembali pembahasan di bawah ini.
          </p>
        </Card>

        <div className="space-y-6">
          {quizData.questions.map((q: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">
                  {idx + 1}. {q.question}
                </h3>
                <div className="grid gap-2">
                  {q.options.map((opt: string, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "p-3 rounded-md border",
                        i === q.correctIndex
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-muted/30"
                      )}
                    >
                      {opt} {i === q.correctIndex && "✓"}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                  <strong>Pembahasan:</strong> {q.explanation}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
