import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockQuizQuestions } from '@/data/mockData';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuizTake() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  const question = mockQuizQuestions[current];
  const total = mockQuizQuestions.length;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === question.correctAnswer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <Layout showFooter={false}>
        <div className="container py-16 max-w-lg text-center">
          <div className={cn('h-24 w-24 mx-auto rounded-full flex items-center justify-center mb-6', pct >= 70 ? 'bg-success/20' : 'bg-warning/20')}>
            <span className="text-4xl font-bold">{pct}%</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Quiz Selesai!</h1>
          <p className="text-muted-foreground mb-6">Kamu menjawab {score} dari {total} soal dengan benar.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/quiz')}>Kembali ke Quiz</Button>
            <GradientButton onClick={() => navigate('/belajar/2')}>Lanjut Belajar</GradientButton>
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
            <span>Soal {current + 1} dari {total}</span>
            <span className="font-medium">{Math.round(((current + 1) / total) * 100)}%</span>
          </div>
          <ProgressBar value={current + 1} max={total} />
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-6">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                const isCorrect = idx === question.correctAnswer;
                const isSelected = idx === selected;
                return (
                  <button key={idx} onClick={() => handleSelect(idx)} disabled={answered} className={cn('w-full p-4 rounded-lg border text-left transition-all', answered ? (isCorrect ? 'border-success bg-success/10' : isSelected ? 'border-destructive bg-destructive/10' : '') : isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50')}>
                    <div className="flex items-center gap-3">
                      {answered && isCorrect && <CheckCircle className="h-5 w-5 text-success shrink-0" />}
                      {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-6 p-4 rounded-lg bg-muted">
                <p className="font-medium mb-2">Pembahasan:</p>
                <p className="text-muted-foreground">{question.explanation}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              {!answered ? (
                <GradientButton onClick={handleSubmit} disabled={selected === null}>Jawab</GradientButton>
              ) : (
                <GradientButton onClick={handleNext}>{current < total - 1 ? <>Lanjut<ArrowRight className="h-4 w-4 ml-2" /></> : 'Lihat Hasil'}</GradientButton>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}