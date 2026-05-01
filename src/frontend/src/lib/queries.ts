import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SAMPLE_COURSES } from "./constants";
import type {
  AIModelConfig,
  AIStep,
  Certificate,
  CertificateVerification,
  Course,
  CourseFilters,
  CourseGeneration,
  CourseInput,
  Difficulty,
  Enrollment,
  ExternalCourse,
  GenerationStatus,
  Lesson,
  LessonInput,
  LibrarySearchResult,
  Quiz,
  QuizResult,
  Resource,
  ResourceType,
  UserProfile,
  UserRole,
} from "./types";

// -- Simulated data store (bridges to backend when ready) --
let mockEnrollments: Enrollment[] = [
  {
    id: "e1",
    courseId: "1",
    learnerId: "user1",
    progress: 65,
    completedLessons: ["l1", "l2", "l3"],
    enrolledAt: Date.now() - 86400000 * 7,
  },
  {
    id: "e2",
    courseId: "3",
    learnerId: "user1",
    progress: 30,
    completedLessons: ["l1"],
    enrolledAt: Date.now() - 86400000 * 3,
  },
];

let mockCourses: Course[] = SAMPLE_COURSES as unknown as Course[];

const mockLessonsMap: Record<string, Lesson[]> = {
  "1": [
    {
      id: "l1",
      courseId: "1",
      title: "Introduction & Objectifs",
      description: "Vue d'ensemble du cours",
      duration: 900,
      order: 1,
      content:
        "Bienvenue dans ce cours de gestion de projets avancée. Nous allons explorer...",
      published: true,
    },
    {
      id: "l2",
      courseId: "1",
      title: "Planification Stratégique",
      description: "Techniques de planification",
      duration: 1800,
      order: 2,
      content: "La planification stratégique est essentielle pour...",
      published: true,
    },
    {
      id: "l3",
      courseId: "1",
      title: "Gestion des Risques",
      description: "Identification et mitigation",
      duration: 2400,
      order: 3,
      videoUrl: "https://example.com/video1",
      published: true,
    },
    {
      id: "l4",
      courseId: "1",
      title: "Leadership d'Équipe",
      description: "Motiver et coordonner",
      duration: 1500,
      order: 4,
      content: "Diriger une équipe multidisciplinaire nécessite...",
      published: true,
    },
  ],
  "2": [
    {
      id: "l5",
      courseId: "2",
      title: "Introduction à la Data Science",
      description: "Concepts fondamentaux",
      duration: 1200,
      order: 1,
      content: "La science des données est une discipline qui...",
      published: true,
    },
    {
      id: "l6",
      courseId: "2",
      title: "Python pour Data Scientists",
      description: "Bases de Python",
      duration: 3600,
      order: 2,
      content: "Python est le langage de référence pour...",
      published: true,
    },
  ],
  "3": [
    {
      id: "l7",
      courseId: "3",
      title: "Définir son Leadership",
      description: "Styles et approches",
      duration: 1800,
      order: 1,
      content:
        "Le leadership authentique commence par une profonde connaissance de soi...",
      published: true,
    },
    {
      id: "l8",
      courseId: "3",
      title: "Intelligence Émotionnelle",
      description: "Les 5 composantes",
      duration: 2100,
      order: 2,
      videoUrl: "https://example.com/video3",
      published: true,
    },
  ],
};

const mockQuizzesMap: Record<string, Quiz> = {
  l1: {
    lessonId: "l1",
    questions: [
      {
        id: "q1",
        text: "Quelle est la première étape d'un projet?",
        options: ["Exécution", "Planification", "Clôture", "Contrôle"],
        correctIndex: 1,
      },
    ],
    passingScore: 70,
  },
  l2: {
    lessonId: "l2",
    questions: [
      {
        id: "q2",
        text: "WBS signifie?",
        options: [
          "Work Breakdown Structure",
          "Work Budget Schedule",
          "Workflow Business System",
          "Work Based Strategy",
        ],
        correctIndex: 0,
      },
    ],
    passingScore: 80,
  },
};

const mockCourseEnrollments: Record<
  string,
  Array<{
    learnerId: string;
    learnerName: string;
    progress: number;
    completedLessons: number;
    enrolledAt: number;
  }>
> = {
  "1": [
    {
      learnerId: "u1",
      learnerName: "Sophie Martin",
      progress: 85,
      completedLessons: 20,
      enrolledAt: Date.now() - 86400000 * 30,
    },
    {
      learnerId: "u2",
      learnerName: "Thomas Dubois",
      progress: 45,
      completedLessons: 10,
      enrolledAt: Date.now() - 86400000 * 15,
    },
    {
      learnerId: "u3",
      learnerName: "Clara Bernard",
      progress: 100,
      completedLessons: 24,
      enrolledAt: Date.now() - 86400000 * 60,
    },
    {
      learnerId: "u4",
      learnerName: "Lucas Petit",
      progress: 20,
      completedLessons: 4,
      enrolledAt: Date.now() - 86400000 * 5,
    },
    {
      learnerId: "u5",
      learnerName: "Emma Robert",
      progress: 65,
      completedLessons: 15,
      enrolledAt: Date.now() - 86400000 * 22,
    },
  ],
  "2": [
    {
      learnerId: "u6",
      learnerName: "Pierre Dupont",
      progress: 30,
      completedLessons: 9,
      enrolledAt: Date.now() - 86400000 * 10,
    },
    {
      learnerId: "u7",
      learnerName: "Julie Moreau",
      progress: 75,
      completedLessons: 24,
      enrolledAt: Date.now() - 86400000 * 40,
    },
  ],
  "3": [
    {
      learnerId: "u8",
      learnerName: "Antoine Lefebvre",
      progress: 55,
      completedLessons: 10,
      enrolledAt: Date.now() - 86400000 * 18,
    },
    {
      learnerId: "u9",
      learnerName: "Marie Simon",
      progress: 90,
      completedLessons: 16,
      enrolledAt: Date.now() - 86400000 * 50,
    },
    {
      learnerId: "u10",
      learnerName: "Nicolas Garcia",
      progress: 10,
      completedLessons: 2,
      enrolledAt: Date.now() - 86400000 * 3,
    },
  ],
};

// ---- Mock resources ----
let mockResources: Resource[] = [
  {
    id: "r1",
    title: "Manuel de Gestion des Projets — RDC",
    description:
      "Guide officiel du Ministère de la Formation Professionnelle pour la gestion de projets de développement.",
    resourceType: "pdf",
    status: "indexed",
    fileUrl: "/assets/docs/gestion-projets.pdf",
    keywords: ["gestion", "projet", "planification", "RDC"],
    subjects: ["Gestion de Projets", "Management"],
    uploadedAt: Date.now() - 86400000 * 45,
  },
  {
    id: "r2",
    title: "Introduction à la Data Science — Université de Kinshasa",
    description:
      "Cours universitaire couvrant Python, statistiques et machine learning pour les professionnels.",
    resourceType: "word",
    status: "indexed",
    fileUrl: "/assets/docs/data-science-unikin.docx",
    keywords: ["data science", "python", "machine learning", "statistiques"],
    subjects: ["Informatique", "Data Science"],
    uploadedAt: Date.now() - 86400000 * 30,
  },
  {
    id: "r3",
    title: "Leadership & Management en Afrique — Conférence 2024",
    description:
      "Actes de la conférence régionale sur les pratiques managériales adaptées au contexte africain.",
    resourceType: "pdf",
    status: "indexed",
    fileUrl: "/assets/docs/leadership-afrique.pdf",
    keywords: ["leadership", "management", "Afrique", "organisation"],
    subjects: ["Leadership", "Ressources Humaines"],
    uploadedAt: Date.now() - 86400000 * 20,
  },
  {
    id: "r4",
    title: "Chaîne YouTube — Formations Professionnelles RDC",
    description:
      "Vidéos officielles de formation technique et professionnelle du Ministère.",
    resourceType: "youtube",
    status: "indexed",
    externalUrl: "https://youtube.com/@formationrdc",
    keywords: ["formation", "technique", "vidéo", "professionnel"],
    subjects: ["Formation Professionnelle"],
    uploadedAt: Date.now() - 86400000 * 15,
  },
  {
    id: "r5",
    title: "Portail des Ressources Éducatives — MENFOP",
    description:
      "Ressources pédagogiques officielles du Ministère de l'Enseignement National.",
    resourceType: "weblink",
    status: "pending",
    externalUrl: "https://menfop.gouv.cd/ressources",
    keywords: ["éducation", "pédagogie", "national"],
    subjects: ["Éducation Nationale"],
    uploadedAt: Date.now() - 86400000 * 5,
  },
];

// ---- Mock generations ----
let mockGenerations: CourseGeneration[] = [
  {
    id: "gen1",
    requestDescription:
      "Formation complète en comptabilité générale pour les PME congolaises, incluant la TVA et les normes OHADA",
    requestedBy: "user1",
    status: "approved",
    steps: [
      {
        step: 1,
        model: "deepseek",
        completedAt: Date.now() - 86400000 * 3 - 3600000,
        output: "Structure pédagogique générée",
      },
      {
        step: 2,
        model: "qwen",
        completedAt: Date.now() - 86400000 * 3 - 1800000,
        output: "Contenu en français généré",
      },
      {
        step: 3,
        model: "gpt4o",
        completedAt: Date.now() - 86400000 * 3,
        output: "Cours validé et approuvé",
      },
    ] as AIStep[],
    resourceIds: ["r1", "r2"],
    generatedCourseId: "1",
    createdAt: Date.now() - 86400000 * 4,
    libraryResultsCount: 47,
    aiModelConfig: {
      structureModel: "DeepSeek R1",
      contentModel: "Qwen 72B",
      validationModel: "GPT-4o",
    },
  },
  {
    id: "gen2",
    requestDescription:
      "Cours sur les technologies agricoles modernes adaptées aux régions tropicales de la RDC",
    requestedBy: "user2",
    status: "step2_qwen",
    steps: [
      {
        step: 1,
        model: "deepseek",
        completedAt: Date.now() - 7200000,
        output: "Structure pédagogique générée",
      },
      { step: 2, model: "qwen", output: "En cours..." },
    ] as AIStep[],
    resourceIds: ["r3", "r4"],
    createdAt: Date.now() - 86400000,
    libraryResultsCount: 23,
    aiModelConfig: {
      structureModel: "DeepSeek R1",
      contentModel: "Qwen 72B",
      validationModel: "GPT-4o",
    },
  },
  {
    id: "gen3",
    requestDescription:
      "Formation en entrepreneuriat numérique pour les jeunes de 18-30 ans en RDC",
    requestedBy: "user3",
    status: "queued",
    steps: [],
    resourceIds: ["r1"],
    createdAt: Date.now() - 3600000,
    libraryResultsCount: 0,
    aiModelConfig: {
      structureModel: "DeepSeek R1",
      contentModel: "Qwen 72B",
      validationModel: "GPT-4o",
    },
  },
];

// ---- Learner queries ----

export function useGetCourses(filters?: CourseFilters) {
  return useQuery<Course[]>({
    queryKey: ["courses", filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      let courses = mockCourses;
      if (filters?.category)
        courses = courses.filter((c) => c.category === filters.category);
      if (filters?.difficulty)
        courses = courses.filter((c) => c.difficulty === filters.difficulty);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        courses = courses.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.instructor.toLowerCase().includes(q),
        );
      }
      return courses;
    },
    staleTime: 60000,
  });
}

export function useGetCourse(id: string) {
  return useQuery<Course | null>({
    queryKey: ["course", id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockCourses.find((c) => c.id === id) ?? null;
    },
    enabled: !!id,
  });
}

export function useGetEnrollments() {
  return useQuery<Enrollment[]>({
    queryKey: ["enrollments"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockEnrollments;
    },
  });
}

export function useGetEnrollment(courseId: string) {
  return useQuery<Enrollment | null>({
    queryKey: ["enrollment", courseId],
    queryFn: async () =>
      mockEnrollments.find((e) => e.courseId === courseId) ?? null,
    enabled: !!courseId,
  });
}

export function useEnroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      await new Promise((r) => setTimeout(r, 500));
      const enrollment: Enrollment = {
        id: `e${Date.now()}`,
        courseId,
        learnerId: "user1",
        progress: 0,
        completedLessons: [],
        enrolledAt: Date.now(),
      };
      mockEnrollments = [...mockEnrollments, enrollment];
      return enrollment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment"] });
    },
  });
}

export function useGetCertificates() {
  return useQuery<Certificate[]>({
    queryKey: ["certificates"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      const completed = mockEnrollments.filter((e) => e.completedAt != null);
      const fromCompleted: Certificate[] = completed.map((e) => {
        const course = SAMPLE_COURSES.find((c) => c.id === e.courseId);
        return {
          id: `cert-${e.id}`,
          courseId: e.courseId,
          courseTitle:
            (course as unknown as { title?: string })?.title ??
            "Formation inconnue",
          instructor:
            (course as unknown as { instructor?: string })?.instructor ?? "",
          learnerId: "user1",
          learnerName: "Alexandre Martin",
          issuedAt: e.completedAt ?? Date.now(),
          resourceCitations: [],
          qrCodePayload: `EDUCERT-${e.id}-${Date.now()}`,
          isMinistryApproved: false,
        };
      });
      const sample: Certificate = {
        id: "cert1",
        courseId: "1",
        courseTitle: "Gestion Avancée de Projets",
        instructor: "Dr. Amina Benali",
        learnerId: "user1",
        learnerName: "Alexandre Martin",
        issuedAt: Date.now() - 86400000 * 30,
        ministryReviewerName: "M. Jean-Baptiste Kabila",
        resourceCitations: [
          "Manuel de Gestion des Projets — RDC (2023)",
          "Introduction à la Data Science — Université de Kinshasa",
        ],
        qrCodePayload: "EDUCERT-cert1-VERIFIED-2024",
        isMinistryApproved: true,
        approvedAt: Date.now() - 86400000 * 28,
      };
      const all = [sample, ...fromCompleted.filter((c) => c.id !== "cert1")];
      return all;
    },
  });
}

export function useGetUserProfile() {
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const stored = localStorage.getItem("userProfile");
      if (stored) return JSON.parse(stored) as UserProfile;
      return null;
    },
  });
}

export function useSaveUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      await new Promise((r) => setTimeout(r, 400));
      localStorage.setItem("userProfile", JSON.stringify(profile));
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useGetUserRole(): UserRole {
  const { data: profile } = useGetUserProfile();
  return profile?.role ?? "guest";
}

// ---- Instructor queries ----

export function useGetInstructorCourses() {
  return useQuery<Course[]>({
    queryKey: ["instructorCourses"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockCourses.slice(0, 3);
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CourseInput) => {
      await new Promise((r) => setTimeout(r, 600));
      const newCourse: Course = {
        ...data,
        id: `c${Date.now()}`,
        instructor: "Moi",
        duration: 0,
        lessonCount: 0,
        enrollmentCount: 0,
        rating: 0,
        ratingCount: 0,
        published: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      mockCourses = [...mockCourses, newCourse];
      return newCourse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: Partial<CourseInput> }) => {
      await new Promise((r) => setTimeout(r, 500));
      mockCourses = mockCourses.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: Date.now() } : c,
      );
      return mockCourses.find((c) => c.id === id) as Course;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
      queryClient.invalidateQueries({ queryKey: ["course", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 400));
      mockCourses = mockCourses.filter((c) => c.id !== id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useSetCoursePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      published,
    }: { id: string; published: boolean }) => {
      await new Promise((r) => setTimeout(r, 400));
      mockCourses = mockCourses.map((c) =>
        c.id === id ? { ...c, published, updatedAt: Date.now() } : c,
      );
      return mockCourses.find((c) => c.id === id) as Course;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
      queryClient.invalidateQueries({ queryKey: ["course", vars.id] });
    },
  });
}

export function useGetLessons(courseId: string) {
  return useQuery<Lesson[]>({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockLessonsMap[courseId] ?? [];
    },
    enabled: !!courseId,
  });
}

export function useAddLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LessonInput) => {
      await new Promise((r) => setTimeout(r, 500));
      const newLesson: Lesson = {
        ...data,
        id: `l${Date.now()}`,
        duration: 0,
        published: true,
      };
      const existing = mockLessonsMap[data.courseId] ?? [];
      mockLessonsMap[data.courseId] = [...existing, newLesson];
      mockCourses = mockCourses.map((c) =>
        c.id === data.courseId ? { ...c, lessonCount: c.lessonCount + 1 } : c,
      );
      return newLesson;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", vars.courseId] });
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lessonId,
      courseId,
      data,
    }: { lessonId: string; courseId: string; data: Partial<LessonInput> }) => {
      await new Promise((r) => setTimeout(r, 400));
      const lessons = mockLessonsMap[courseId] ?? [];
      mockLessonsMap[courseId] = lessons.map((l) =>
        l.id === lessonId ? { ...l, ...data } : l,
      );
      return mockLessonsMap[courseId].find((l) => l.id === lessonId) as Lesson;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", vars.courseId] });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lessonId,
      courseId,
    }: { lessonId: string; courseId: string }) => {
      await new Promise((r) => setTimeout(r, 400));
      const lessons = mockLessonsMap[courseId] ?? [];
      mockLessonsMap[courseId] = lessons.filter((l) => l.id !== lessonId);
      mockCourses = mockCourses.map((c) =>
        c.id === courseId
          ? { ...c, lessonCount: Math.max(0, c.lessonCount - 1) }
          : c,
      );
      return lessonId;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", vars.courseId] });
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
  });
}

export function useSetQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quiz: Quiz) => {
      await new Promise((r) => setTimeout(r, 400));
      mockQuizzesMap[quiz.lessonId] = quiz;
      return quiz;
    },
    onSuccess: (_, quiz) => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quiz.lessonId] });
    },
  });
}

export function useGetQuiz(lessonId: string) {
  return useQuery<Quiz | null>({
    queryKey: ["quiz", lessonId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150));
      return mockQuizzesMap[lessonId] ?? null;
    },
    enabled: !!lessonId,
  });
}

export function useGetCourseEnrollments(courseId: string) {
  return useQuery<
    Array<{
      learnerId: string;
      learnerName: string;
      progress: number;
      completedLessons: number;
      enrolledAt: number;
    }>
  >({
    queryKey: ["courseEnrollments", courseId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockCourseEnrollments[courseId] ?? [];
    },
    enabled: !!courseId,
  });
}

export function useGetCourseLessons(courseId: string) {
  return useGetLessons(courseId);
}

export function useMarkLessonComplete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      lessonId,
      totalLessons,
    }: { courseId: string; lessonId: string; totalLessons: number }) => {
      await new Promise((r) => setTimeout(r, 400));
      mockEnrollments = mockEnrollments.map((e) => {
        if (e.courseId !== courseId) return e;
        const completed = e.completedLessons.includes(lessonId)
          ? e.completedLessons
          : [...e.completedLessons, lessonId];
        const progress = Math.round(
          (completed.length / Math.max(1, totalLessons)) * 100,
        );
        return { ...e, completedLessons: completed, progress };
      });
      return { courseId, lessonId };
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["enrollment", vars.courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}

export function useSubmitQuiz() {
  return useMutation({
    mutationFn: async ({
      lessonId,
      answers,
      quiz,
    }: {
      lessonId: string;
      answers: number[];
      quiz: Quiz;
    }): Promise<QuizResult> => {
      await new Promise((r) => setTimeout(r, 600));
      const correctCount = quiz.questions.reduce(
        (cnt, q, i) => (answers[i] === q.correctIndex ? cnt + 1 : cnt),
        0,
      );
      const score = Math.round(
        (correctCount / Math.max(1, quiz.questions.length)) * 100,
      );
      const passed = score >= quiz.passingScore;
      return {
        id: `qr${Date.now()}`,
        quizId: lessonId,
        learnerId: "user1",
        answers,
        score,
        passed,
        submittedAt: Date.now(),
      };
    },
  });
}

// ---- Admin: Resource queries ----

export function useListResources(type?: ResourceType, search?: string) {
  return useQuery<Resource[]>({
    queryKey: ["resources", type, search],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      let resources = mockResources;
      if (type) resources = resources.filter((r) => r.resourceType === type);
      if (search) {
        const q = search.toLowerCase();
        resources = resources.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.keywords.some((k) => k.toLowerCase().includes(q)),
        );
      }
      return resources;
    },
    staleTime: 30000,
  });
}

export function useUploadResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      resourceType: ResourceType;
      fileUrl?: string;
      externalUrl?: string;
      keywords: string[];
      subjects: string[];
    }) => {
      await new Promise((r) => setTimeout(r, 800));
      const resource: Resource = {
        id: `r${Date.now()}`,
        status: "pending",
        uploadedAt: Date.now(),
        ...params,
      };
      mockResources = [...mockResources, resource];
      return resource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useUpdateResourceMetadata() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      title?: string;
      description?: string;
      keywords?: string[];
      subjects?: string[];
    }) => {
      await new Promise((r) => setTimeout(r, 400));
      mockResources = mockResources.map((r) =>
        r.id === params.id ? { ...r, ...params } : r,
      );
      return mockResources.find((r) => r.id === params.id) as Resource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 400));
      mockResources = mockResources.filter((r) => r.id !== id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useIndexResourceText() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; textContent?: string }) => {
      await new Promise((r) => setTimeout(r, 1200));
      mockResources = mockResources.map((r) =>
        r.id === params.id ? { ...r, status: "indexed" as const } : r,
      );
      return mockResources.find((r) => r.id === params.id) as Resource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

// ---- AI Generation queries ----

export function useRequestGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (description: string) => {
      await new Promise((r) => setTimeout(r, 600));
      const gen: CourseGeneration = {
        id: `gen${Date.now()}`,
        requestDescription: description,
        requestedBy: "user1",
        status: "queued",
        steps: [],
        resourceIds: mockResources
          .filter((r) => r.status === "indexed")
          .slice(0, 5)
          .map((r) => r.id),
        createdAt: Date.now(),
        libraryResultsCount: Math.floor(Math.random() * 80) + 15,
        aiModelConfig: { ...mockModelConfig },
      };
      mockGenerations = [gen, ...mockGenerations];
      return gen;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      queryClient.invalidateQueries({ queryKey: ["myGenerations"] });
    },
  });
}

const TERMINAL_STATUSES: GenerationStatus[] = [
  "approved",
  "rejected",
  "revision_needed",
];

export function useGetGenerationStatus(id: string) {
  return useQuery<CourseGeneration | null>({
    queryKey: ["generation", id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockGenerations.find((g) => g.id === id) ?? null;
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 3000;
      return TERMINAL_STATUSES.includes(data.status) ? false : 3000;
    },
  });
}

export function useListMyGenerations() {
  return useQuery<CourseGeneration[]>({
    queryKey: ["myGenerations"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockGenerations.filter((g) => g.requestedBy === "user1");
    },
  });
}

export function useListAllGenerations() {
  return useQuery<CourseGeneration[]>({
    queryKey: ["generations"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockGenerations;
    },
  });
}

export function useApproveGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      await new Promise((r) => setTimeout(r, 500));
      mockGenerations = mockGenerations.map((g) =>
        g.id === id ? { ...g, status: "approved" as const } : g,
      );
      return { id, notes };
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      queryClient.invalidateQueries({ queryKey: ["generation", vars.id] });
    },
  });
}

export function useRejectGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      await new Promise((r) => setTimeout(r, 500));
      mockGenerations = mockGenerations.map((g) =>
        g.id === id
          ? { ...g, status: "rejected" as const, errorMessage: reason }
          : g,
      );
      return { id, reason };
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      queryClient.invalidateQueries({ queryKey: ["generation", vars.id] });
    },
  });
}

export function useTriggerAIGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 400));
      mockGenerations = mockGenerations.map((g) =>
        g.id === id ? { ...g, status: "step1_deepseek" as const } : g,
      );
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      queryClient.invalidateQueries({ queryKey: ["generation", id] });
    },
  });
}

export function useVerifyCertificateQR(payload: string) {
  return useQuery<CertificateVerification>({
    queryKey: ["verifyCertificate", payload],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      // Mock: check if payload matches any known certificate
      if (payload === "EDUCERT-cert1-VERIFIED-2024") {
        return {
          isValid: true,
          certificate: {
            id: "cert1",
            courseId: "1",
            courseTitle: "Gestion Avancée de Projets",
            instructor: "Dr. Amina Benali",
            learnerId: "user1",
            learnerName: "Alexandre Martin",
            issuedAt: Date.now() - 86400000 * 30,
            ministryReviewerName: "M. Jean-Baptiste Kabila",
            resourceCitations: [
              "Manuel de Gestion des Projets — RDC (2023)",
              "Introduction à la Data Science — Université de Kinshasa",
            ],
            qrCodePayload: "EDUCERT-cert1-VERIFIED-2024",
            isMinistryApproved: true,
            approvedAt: Date.now() - 86400000 * 28,
          },
        };
      }
      return {
        isValid: false,
        errorMessage: "Certificat introuvable ou non valide.",
      };
    },
    enabled: !!payload,
  });
}

// ---- External courses ----

let mockExternalCourses: ExternalCourse[] = [
  {
    id: "ec1",
    url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    title: "Python Full Course for Beginners — freeCodeCamp",
    description:
      "Cours complet Python en anglais, idéal pour les débutants en programmation.",
    platform: "YouTube",
    thumbnailUrl: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg",
    addedBy: "admin",
    addedAt: BigInt(Date.now() - 86400000 * 10),
    viewCount: BigInt(42),
  },
  {
    id: "ec2",
    url: "https://www.coursera.org/learn/machine-learning",
    title: "Machine Learning — Andrew Ng (Stanford/Coursera)",
    description:
      "Le cours de référence mondiale en Machine Learning, adapté aux professionnels RDC.",
    platform: "Coursera",
    addedBy: "admin",
    addedAt: BigInt(Date.now() - 86400000 * 5),
    viewCount: BigInt(18),
  },
  {
    id: "ec3",
    url: "https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery",
    title: "Complete Web Developer — Zero to Mastery",
    description:
      "Formation complète développeur web, de débutant à professionnel.",
    platform: "Udemy",
    addedBy: "admin",
    addedAt: BigInt(Date.now() - 86400000 * 2),
    viewCount: BigInt(7),
  },
];

function detectPlatform(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("coursera.org")) return "Coursera";
  if (url.includes("udemy.com")) return "Udemy";
  if (url.includes("linkedin.com/learning")) return "LinkedIn Learning";
  if (url.includes("edx.org")) return "edX";
  if (url.includes("openclassrooms.com")) return "OpenClassrooms";
  return "Autre";
}

export function useListExternalCourses() {
  return useQuery<ExternalCourse[]>({
    queryKey: ["externalCourses"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockExternalCourses;
    },
    staleTime: 30000,
  });
}

export function useAddExternalCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      url: string;
      title: string;
      description: string;
    }) => {
      await new Promise((r) => setTimeout(r, 600));
      const platform = detectPlatform(params.url);
      let thumbnailUrl: string | undefined;
      const ytMatch = params.url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      if (ytMatch)
        thumbnailUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      const course: ExternalCourse = {
        id: `ec${Date.now()}`,
        url: params.url,
        title: params.title,
        description: params.description,
        platform,
        thumbnailUrl,
        addedBy: "admin",
        addedAt: BigInt(Date.now()),
        viewCount: BigInt(0),
      };
      mockExternalCourses = [course, ...mockExternalCourses];
      return course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["externalCourses"] });
    },
  });
}

export function useDeleteExternalCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 400));
      mockExternalCourses = mockExternalCourses.filter((c) => c.id !== id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["externalCourses"] });
    },
  });
}

export function useTrackExternalCourseView() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200));
      mockExternalCourses = mockExternalCourses.map((c) =>
        c.id === id ? { ...c, viewCount: c.viewCount + BigInt(1) } : c,
      );
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["externalCourses"] });
    },
  });
}

// ---- AI Model configuration ----

let mockModelConfig: AIModelConfig = {
  structureModel: "DeepSeek R1",
  contentModel: "Qwen 72B",
  validationModel: "GPT-4o",
};

export function useGetAdminModelConfig() {
  return useQuery<AIModelConfig>({
    queryKey: ["adminModelConfig"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return { ...mockModelConfig };
    },
    staleTime: 60000,
  });
}

export function useSetAdminModelConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: AIModelConfig) => {
      await new Promise((r) => setTimeout(r, 500));
      mockModelConfig = { ...config };
      return mockModelConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminModelConfig"] });
    },
  });
}

// ---- World libraries search ----

export interface LibrarySearchQuery {
  query: string;
  domain?: string;
}

const MOCK_LIBRARY_DB: LibrarySearchResult[] = [
  {
    id: "lib1",
    title: "Principes de Comptabilité Générale — Normes OHADA",
    author: "Jean-Pierre Deschamps",
    year: "2022",
    source: "Bibliothèque Ouverte",
    description:
      "Manuel complet de comptabilité générale pour entreprises selon les normes OHADA et le droit des affaires africain.",
    url: "https://openlibrary.org/books/OL1234567M",
    coverUrl: "https://covers.openlibrary.org/b/id/12345-M.jpg",
  },
  {
    id: "lib2",
    title: "Gestion Financière des PME en Afrique",
    author: "Amina Diallo",
    year: "2021",
    source: "Bibliothèque Ouverte",
    description:
      "Stratégies financières adaptées aux petites et moyennes entreprises africaines et congolaises.",
    url: "https://openlibrary.org/books/OL2345678M",
  },
  {
    id: "lib3",
    title: "The Art of Business Management",
    author: "Peter Drucker",
    year: "1954",
    source: "Projet Gutenberg",
    description:
      "Fondements du management moderne et de la gestion d'entreprise — traduit en français.",
    url: "https://gutenberg.org/ebooks/12345",
  },
  {
    id: "lib4",
    title: "Entrepreneuriat et Innovation en Afrique Subsaharienne",
    author: "Kwame Mensah",
    year: "2023",
    source: "Archives Internet",
    description:
      "Étude des modèles d'innovation adaptés au contexte économique africain et aux startups congolaises.",
    url: "https://archive.org/details/entrepreneuriat-afrique",
  },
  {
    id: "lib5",
    title: "Leadership Transformationnel",
    author: "James M. Burns",
    year: "1978",
    source: "Google Livres",
    description:
      "Théorie fondatrice du leadership transformationnel et son application organisationnelle moderne.",
    url: "https://books.google.com/books?id=ABC123",
  },
  {
    id: "lib6",
    title: "Droit Commercial et des Affaires en RDC",
    author: "Prof. Luc Ngalula",
    year: "2020",
    source: "Bibliothèque Ouverte",
    description:
      "Cadre juridique complet des affaires en République Démocratique du Congo.",
    url: "https://openlibrary.org/books/OL3456789M",
  },
  {
    id: "lib7",
    title: "Systèmes d'Information de Gestion",
    author: "Laudon & Laudon",
    year: "2019",
    source: "Google Livres",
    description:
      "Management des technologies de l'information pour les organisations modernes.",
    url: "https://books.google.com/books?id=DEF456",
  },
  {
    id: "lib8",
    title: "Économie du Développement en Afrique",
    author: "Daron Acemoglu",
    year: "2012",
    source: "Archives Internet",
    description:
      "Analyse économique du développement et des institutions dans les pays émergents d'Afrique.",
    url: "https://archive.org/details/economie-developpement",
  },
  {
    id: "lib9",
    title: "Introduction au Marketing Digital",
    author: "Philippe Kotler",
    year: "2022",
    source: "Projet Gutenberg",
    description:
      "Stratégies marketing numériques pour les marchés émergents et entrepreneurs africains.",
    url: "https://gutenberg.org/ebooks/23456",
  },
  {
    id: "lib10",
    title: "Normes OHADA — Guide Pratique Officiel",
    author: "OHADA Commission",
    year: "2023",
    source: "Bibliothèque Ouverte",
    description:
      "Guide officiel des normes comptables et juridiques de l'Organisation pour l'Harmonisation en Afrique du Droit des Affaires.",
    url: "https://openlibrary.org/books/OL4567890M",
  },
  {
    id: "lib11",
    title: "Agriculture Tropicale Durable",
    author: "Henri Vallin",
    year: "2021",
    source: "Archives Internet",
    description:
      "Techniques agricoles adaptées aux zones tropicales d'Afrique centrale et de la RDC.",
    url: "https://archive.org/details/agriculture-tropicale",
  },
  {
    id: "lib12",
    title: "Data Science avec Python — Cours Pratique",
    author: "Jake VanderPlas",
    year: "2023",
    source: "Google Livres",
    description:
      "Guide complet de la science des données avec Python, pandas, numpy et scikit-learn.",
    url: "https://books.google.com/books?id=GHI789",
  },
  {
    id: "lib13",
    title: "Principes fondamentaux de l'ingénierie logicielle",
    author: "Pressman, Roger S.",
    year: "2019",
    source: "Bibliothèque Ouverte",
    description:
      "Référence mondiale pour l'ingénierie logicielle, couvrant méthodes agiles, architecture et qualité.",
    url: "https://openlibrary.org/works/OL7681497W",
    coverUrl: "https://covers.openlibrary.org/b/id/8091016-M.jpg",
  },
  {
    id: "lib14",
    title: "Droit des affaires OHADA — Guide pratique",
    author: "Issa-Sayegh, Joseph",
    year: "2020",
    source: "Bibliothèque Ouverte",
    description:
      "Guide complet sur le droit des affaires harmonisé en Afrique, incluant la RDC.",
    url: "https://ohada.com/bibliotheque",
  },
  {
    id: "lib15",
    title: "Soins de Santé Primaires en Milieu Rural Africain",
    author: "Dr. Kabuya Ngandu",
    year: "2022",
    source: "Archives Internet",
    description:
      "Manuel de médecine générale et de soins primaires adapté aux contraintes du terrain africain.",
    url: "https://archive.org/details/soins-sante-afrique",
  },
  {
    id: "lib16",
    title: "Génie Civil et Construction en Zone Tropicale",
    author: "Mbala Kiese",
    year: "2021",
    source: "Bibliothèque Ouverte",
    description:
      "Techniques de construction, calculs de structures et matériaux adaptés au climat tropical congolais.",
    url: "https://openlibrary.org/books/OL5678901M",
  },
  {
    id: "lib17",
    title: "Rédaction de Mémoires et TFC selon les Normes RDC",
    author: "Prof. Nsimba Makonda",
    year: "2023",
    source: "Google Livres",
    description:
      "Guide méthodologique complet pour la rédaction de travaux de fin de cycle conformes aux exigences universitaires de la RDC.",
    url: "https://books.google.com/books?id=JKL012",
  },
  {
    id: "lib18",
    title: "Ressources Humaines et Droit du Travail en RDC",
    author: "Me Kasereka Vira",
    year: "2022",
    source: "Projet Gutenberg",
    description:
      "Code du travail et pratiques RH en République Démocratique du Congo — édition mise à jour.",
    url: "https://gutenberg.org/ebooks/34567",
  },
];

export const LIBRARY_SOURCE_ORDER = [
  "Bibliothèque Ouverte",
  "Projet Gutenberg",
  "Archives Internet",
  "Google Livres",
];

export function useSearchWorldLibraries(params: LibrarySearchQuery | null) {
  return useQuery<LibrarySearchResult[]>({
    queryKey: ["worldLibraries", params?.query, params?.domain],
    queryFn: async () => {
      if (!params?.query || params.query.trim().length < 3) return [];
      await new Promise((r) => setTimeout(r, 900));
      const q = params.query.toLowerCase();
      const domain = params.domain?.toLowerCase() ?? "";
      const allWords = [...q.split(/\s+/), ...domain.split(/\s+/)].filter(
        (w) => w.length > 2,
      );
      if (allWords.length === 0) return MOCK_LIBRARY_DB.slice(0, 6);
      const scored = MOCK_LIBRARY_DB.map((item) => {
        const text =
          `${item.title} ${item.author} ${item.description}`.toLowerCase();
        const matches = allWords.filter((w) => text.includes(w)).length;
        return { item, matches };
      });
      const filtered = scored.filter((s) => s.matches > 0);
      if (filtered.length === 0) return MOCK_LIBRARY_DB.slice(0, 6);
      return filtered
        .sort((a, b) => b.matches - a.matches)
        .map((s) => s.item)
        .slice(0, 12);
    },
    enabled: !!params && params.query.trim().length >= 3,
    staleTime: 30000,
  });
}
