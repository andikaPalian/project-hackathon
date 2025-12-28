import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/GradientButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, ClipboardList } from "lucide-react";
import api from "@/utils/api";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await api.get("/quiz");
        setQuizzes(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading)
    return (
      <Layout>
        <div className="container py-8">
          <LoadingSkeleton count={3} />
        </div>
      </Layout>
    );

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Quiz</h1>
            <p className="text-muted-foreground">Uji pemahamanmu dengan quiz</p>
          </div>
          <GradientButton asChild>
            <Link to="/quiz/create">
              <Plus className="h-4 w-4 mr-2" />
              Buat Quiz
            </Link>
          </GradientButton>
        </div>

        {quizzes.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-8 w-8 text-muted-foreground" />}
            title="Belum ada quiz"
            description="Buat quiz pertamamu untuk menguji pemahaman."
            action={
              <GradientButton asChild>
                <Link to="/quiz/create">Buat Quiz</Link>
              </GradientButton>
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const isFinished = quiz.score !== null && quiz.score !== undefined;

              return (
                <Link
                  key={quiz.id}
                  to={isFinished ? `/quiz/result/${quiz.id}` : `/quiz/${quiz.id}`}
                >
                  <Card
                    className={cn(
                      "hover-lift h-full transition-all",
                      isFinished ? "border-green-200 bg-green-50/10" : "border-border"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            isFinished ? "bg-green-100" : "gradient-primary"
                          )}
                        >
                          <ClipboardList
                            className={cn(
                              "h-5 w-5",
                              isFinished ? "text-green-600" : "text-primary-foreground"
                            )}
                          />
                        </div>
                        <StatusBadge status={isFinished ? "Selesai" : quiz.difficulty} />
                      </div>

                      <h3 className="font-medium mt-3">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {quiz.questions?.length || 0} soal
                      </p>

                      {isFinished && (
                        <div className="mt-3 pt-3 border-t border-green-100">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-green-700">
                              Skor: <span className="text-lg font-bold">{quiz.score}%</span>
                            </p>
                            {quiz.completedAt && (
                              <span className="text-[10px] text-muted-foreground">
                                {quiz.completedAt}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-green-600 mt-1 font-medium">
                            Klik untuk lihat pembahasan →
                          </p>
                        </div>
                      )}

                      {!isFinished && (
                        <div className="mt-4 flex items-center text-xs text-primary font-medium">
                          Kerjakan Sekarang →
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
