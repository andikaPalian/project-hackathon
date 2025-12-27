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
            {quizzes.map((quiz) => (
              <Link key={quiz.id} to={`/quiz/${quiz.id}`}>
                <Card className="hover-lift h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <StatusBadge status={quiz.difficulty} />
                    </div>
                    <h3 className="font-medium mt-3">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.questions?.length || 0} soal
                    </p>
                    {quiz.score !== undefined && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm">
                          <span className="font-semibold text-green-600">{quiz.score}%</span>
                          {quiz.completedAt && ` • ${quiz.completedAt}`}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
