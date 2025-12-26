// Mock data for KARI application

export interface User {
  id: string;
  username: string;
  email: string;
  major: string;
  subjects: string[];
  learningStyle: string;
  goal: string[];
  streak: number;
  lastStudy: string;
  totalMastery: number;
}

export interface Material {
  id: string;
  title: string;
  mataKuliah: string;
  topicCount: number;
  status: 'not_started' | 'learning' | 'mastered';
  uploadedAt: string;
  fileType: 'pdf' | 'ppt';
}

export interface Topic {
  id: string;
  materialId: string;
  title: string;
  subtopics: Subtopic[];
  difficulty: 'easy' | 'medium' | 'hard';
  mastery: number;
}

export interface Subtopic {
  id: string;
  title: string;
  completed: boolean;
}

export interface Quiz {
  id: string;
  materialId: string;
  topicId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  score?: number;
  completedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const mockUser: User = {
  id: '1',
  username: 'Andi Pratama',
  email: 'andi@university.ac.id',
  major: 'Teknik Informatika',
  subjects: ['Sistem Operasi', 'Basis Data', 'Algoritma dan Struktur Data'],
  learningStyle: 'step-by-step',
  goal: ['Persiapan UTS/UAS', 'Memahami konsep'],
  streak: 7,
  lastStudy: '2024-01-15',
  totalMastery: 68,
};

export const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Process Management & Scheduling',
    mataKuliah: 'Sistem Operasi',
    topicCount: 8,
    status: 'learning',
    uploadedAt: '2024-01-10',
    fileType: 'ppt',
  },
  {
    id: '2',
    title: 'Normalisasi Database',
    mataKuliah: 'Basis Data',
    topicCount: 5,
    status: 'not_started',
    uploadedAt: '2024-01-12',
    fileType: 'pdf',
  },
  {
    id: '3',
    title: 'Binary Search Tree',
    mataKuliah: 'Algoritma dan Struktur Data',
    topicCount: 6,
    status: 'mastered',
    uploadedAt: '2024-01-05',
    fileType: 'ppt',
  },
  {
    id: '4',
    title: 'Memory Management',
    mataKuliah: 'Sistem Operasi',
    topicCount: 7,
    status: 'learning',
    uploadedAt: '2024-01-08',
    fileType: 'pdf',
  },
];

export const mockTopics: Topic[] = [
  {
    id: '1',
    materialId: '1',
    title: 'Process & Thread',
    difficulty: 'medium',
    mastery: 80,
    subtopics: [
      { id: '1-1', title: 'Definisi Process', completed: true },
      { id: '1-2', title: 'Process States', completed: true },
      { id: '1-3', title: 'Process vs Thread', completed: false },
    ],
  },
  {
    id: '2',
    materialId: '1',
    title: 'CPU Scheduling',
    difficulty: 'hard',
    mastery: 45,
    subtopics: [
      { id: '2-1', title: 'Scheduling Criteria', completed: true },
      { id: '2-2', title: 'FCFS Algorithm', completed: false },
      { id: '2-3', title: 'SJF Algorithm', completed: false },
      { id: '2-4', title: 'Round Robin', completed: false },
    ],
  },
  {
    id: '3',
    materialId: '1',
    title: 'Context Switching',
    difficulty: 'easy',
    mastery: 100,
    subtopics: [
      { id: '3-1', title: 'Pengertian Context Switch', completed: true },
      { id: '3-2', title: 'Overhead Context Switch', completed: true },
    ],
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    materialId: '1',
    topicId: '1',
    title: 'Quiz Process & Thread',
    difficulty: 'medium',
    questionCount: 10,
    score: 85,
    completedAt: '2024-01-14',
  },
  {
    id: '2',
    materialId: '1',
    topicId: '3',
    title: 'Quiz Context Switching',
    difficulty: 'easy',
    questionCount: 5,
    score: 100,
    completedAt: '2024-01-13',
  },
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Apa perbedaan utama antara Process dan Thread?',
    options: [
      'Process memiliki memory space sendiri, Thread berbagi memory dengan process parent',
      'Thread lebih lambat dari Process',
      'Process tidak bisa berkomunikasi dengan Process lain',
      'Thread tidak bisa dibuat dari Process',
    ],
    correctAnswer: 0,
    explanation: 'Process memiliki address space sendiri yang terisolasi, sedangkan Thread berbagi memory space dengan process induknya. Hal ini membuat thread lebih ringan dan komunikasi antar thread lebih cepat.',
  },
  {
    id: '2',
    question: 'Algoritma scheduling mana yang dapat menyebabkan starvation?',
    options: [
      'Round Robin',
      'First Come First Served',
      'Shortest Job First',
      'FIFO',
    ],
    correctAnswer: 2,
    explanation: 'Shortest Job First (SJF) dapat menyebabkan starvation karena process dengan burst time yang panjang mungkin tidak pernah mendapat giliran jika terus ada process dengan burst time pendek.',
  },
];

export const jurusanList = [
  'Teknik Informatika',
  'Sistem Informasi',
  'Teknik Elektro',
  'Teknik Mesin',
  'Teknik Sipil',
  'Arsitektur',
  'Kedokteran',
  'Farmasi',
  'Hukum',
  'Ekonomi',
  'Manajemen',
  'Akuntansi',
  'Psikologi',
  'Ilmu Komunikasi',
  'Hubungan Internasional',
];

export const mataKuliahList = [
  'Sistem Operasi',
  'Basis Data',
  'Algoritma dan Struktur Data',
  'Pemrograman Web',
  'Jaringan Komputer',
  'Kecerdasan Buatan',
  'Machine Learning',
  'Statistika',
  'Kalkulus',
  'Fisika Dasar',
  'Kimia Dasar',
  'Biologi',
];

export const gayaBelajarOptions = [
  {
    id: 'visual',
    title: 'Visual',
    description: 'Belajar dengan diagram, gambar, dan ilustrasi',
    icon: 'Eye',
  },
  {
    id: 'teks',
    title: 'Teks',
    description: 'Belajar dengan membaca penjelasan tertulis',
    icon: 'FileText',
  },
  {
    id: 'step-by-step',
    title: 'Step-by-step',
    description: 'Belajar bertahap dengan panduan langkah demi langkah',
    icon: 'ListOrdered',
  },
];

export const tujuanOptions = [
  { id: 'uts-uas', label: 'Persiapan UTS/UAS' },
  { id: 'tugas', label: 'Menyelesaikan tugas' },
  { id: 'konsep', label: 'Memahami konsep' },
];

export const testimonials = [
  {
    id: '1',
    name: 'Sarah Amelia',
    jurusan: 'Teknik Informatika, UI',
    avatar: 'S',
    content: 'KARI benar-benar membantu saya memahami konsep Sistem Operasi yang awalnya sangat membingungkan. Step-by-step explanation-nya luar biasa!',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    jurusan: 'Sistem Informasi, ITS',
    avatar: 'B',
    content: 'Quiz generator-nya super helpful buat persiapan UAS. Pembahasannya detail dan mudah dipahami.',
  },
  {
    id: '3',
    name: 'Dewi Lestari',
    jurusan: 'Teknik Elektro, ITB',
    avatar: 'D',
    content: 'Fitur ringkasan UTS/UAS sangat membantu menghemat waktu belajar. Recommended banget untuk mahasiswa!',
  },
];

export const faqItems = [
  {
    question: 'Apa itu KARI?',
    answer: 'KARI adalah AI companion yang membantu mahasiswa memahami materi kuliah secara step-by-step, menyesuaikan dengan gaya belajar masing-masing, dan membantu mengatur prioritas belajar.',
  },
  {
    question: 'Bagaimana cara mulai menggunakan KARI?',
    answer: 'Cukup daftar akun, upload materi kuliah (PDF/PPT), dan KARI akan otomatis memecah materi menjadi topik-topik yang mudah dipahami. Kamu bisa mulai belajar interaktif dari sana.',
  },
  {
    question: 'Format file apa saja yang didukung?',
    answer: 'Saat ini KARI mendukung file PDF dan PowerPoint (PPT/PPTX). Kami akan terus menambahkan dukungan untuk format lainnya.',
  },
  {
    question: 'Apakah KARI memberikan jawaban langsung?',
    answer: 'KARI dirancang untuk membimbing kamu memahami konsep, bukan memberikan jawaban langsung. AI akan menjelaskan step-by-step dan mengajukan pertanyaan pemandu agar kamu benar-benar paham.',
  },
  {
    question: 'Apakah data dan materi saya aman?',
    answer: 'Ya, keamanan data adalah prioritas kami. Semua materi yang kamu upload dienkripsi dan hanya bisa diakses oleh kamu sendiri.',
  },
];

export const mockConversation: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Halo! Saya KARI, AI companion belajarmu. Hari ini kita akan mempelajari tentang **CPU Scheduling**. Siap untuk mulai? 🎓',
    timestamp: '10:00',
  },
  {
    id: '2',
    role: 'user',
    content: 'Siap! Apa itu CPU Scheduling?',
    timestamp: '10:01',
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Pertanyaan bagus! Mari kita mulai dari dasar.\n\n**CPU Scheduling** adalah mekanisme sistem operasi untuk menentukan proses mana yang akan dieksekusi oleh CPU.\n\nBayangkan CPU seperti kasir di supermarket yang hanya bisa melayani satu pelanggan pada satu waktu. Scheduling adalah sistem antrean yang menentukan siapa yang dilayani duluan.\n\nMenurut kamu, apa yang harus dipertimbangkan saat menentukan urutan antrean?',
    timestamp: '10:01',
  },
];

export const learningModes = [
  { id: 'kayak-sma', label: 'Kayak Anak SMA', description: 'Penjelasan sederhana seperti untuk pemula' },
  { id: 'ringkas', label: 'Ringkas', description: 'Poin-poin penting saja' },
  { id: 'step-by-step', label: 'Step-by-step', description: 'Panduan bertahap yang detail' },
  { id: 'detail', label: 'Detail', description: 'Penjelasan mendalam dan komprehensif' },
];

export const quickPrompts = [
  'Kasih contoh sederhana',
  'Aku masih bingung',
  'Uji pemahamanku',
  'Jelaskan lebih detail',
  'Bagaimana penerapannya?',
];

export const weeklyActivity = [
  { day: 'Sen', minutes: 45 },
  { day: 'Sel', minutes: 30 },
  { day: 'Rab', minutes: 60 },
  { day: 'Kam', minutes: 0 },
  { day: 'Jum', minutes: 90 },
  { day: 'Sab', minutes: 45 },
  { day: 'Min', minutes: 20 },
];