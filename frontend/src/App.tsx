import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Materi from "./pages/Materi";
import MateriDetail from "./pages/MateriDetail";
import Belajar from "./pages/Belajar";
import Quiz from "./pages/Quiz";
import QuizCreate from "./pages/QuizCreate";
import QuizTake from "./pages/QuizTake";
import Progress from "./pages/Progress";
import Ringkasan from "./pages/Ringkasan";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/materi" element={<Materi />} />
            <Route path="/materi/:id" element={<MateriDetail />} />
            <Route path="/belajar" element={<Belajar />} />
            <Route path="/belajar/:topicId" element={<Belajar />} />
            <Route path="/belajar/:materialId/:topicId" element={<Belajar />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/create" element={<QuizCreate />} />
            <Route path="/quiz/:id" element={<QuizTake />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/ringkasan" element={<Ringkasan />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
