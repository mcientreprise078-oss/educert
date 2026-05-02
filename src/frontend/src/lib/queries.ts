import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AIModelConfig,
  AppNotification,
  Certificate,
  CertificateVerification,
  Course,
  CourseFilters,
  CourseGeneration,
  CourseInput,
  Domain,
  DomainTier,
  Enrollment,
  ExternalCourse,
  GenerationStatus,
  Lesson,
  LessonInput,
  LibrarySearchResult,
  Quiz,
  QuizResult,
  ResearchProject,
  ResearchType,
  Resource,
  ResourceType,
  TutorMessage,
  UserProfile,
  UserRole,
  YouTubeVideoResult,
} from "./types";

// -- In-memory stores (no mock courses or sample data) --
let mockEnrollments: Enrollment[] = [];
let mockCourses: Course[] = [];
const mockLessonsMap: Record<string, Lesson[]> = {};
const mockQuizzesMap: Record<string, Quiz> = {};
const mockCourseEnrollments: Record<
  string,
  Array<{
    learnerId: string;
    learnerName: string;
    progress: number;
    completedLessons: number;
    enrolledAt: number;
  }>
> = {};
let mockResources: Resource[] = [];
let mockGenerations: CourseGeneration[] = [];
let mockExternalCourses: ExternalCourse[] = [];

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
    queryFn: async () => [],
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
      return mockCourses;
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

// ---- Admin: Import Google Doc resource ----

export function useImportGoogleDoc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      docUrl: string;
      title: string;
      userId: string;
    }): Promise<{ ok: string } | { err: string }> => {
      await new Promise((r) => setTimeout(r, 1000));
      const resource: Resource = {
        id: `r${Date.now()}`,
        title: params.title,
        description: `Importé depuis Google Docs : ${params.docUrl}`,
        resourceType: "html",
        status: "indexed",
        externalUrl: params.docUrl,
        keywords: [],
        subjects: [],
        uploadedAt: Date.now(),
      };
      mockResources = [resource, ...mockResources];
      return { ok: resource.id };
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
    mutationFn: async (params: {
      description: string;
      title?: string;
      domain?: string;
      chapterCount?: number;
      sources?: string[];
      modelPreset?: string;
    }) => {
      await new Promise((r) => setTimeout(r, 600));
      const gen: CourseGeneration = {
        id: `gen${Date.now()}`,
        requestDescription: params.description,
        requestedBy: "user1",
        status: "queued",
        steps: [],
        resourceIds: mockResources
          .filter((r) => r.status === "indexed")
          .slice(0, 5)
          .map((r) => r.id),
        createdAt: Date.now(),
        libraryResultsCount: 0,
        aiModelConfig: { ...mockModelConfig },
      };
      mockGenerations = [gen, ...mockGenerations];
      // Simulate pipeline progression
      simulatePipeline(gen.id);
      return gen;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      queryClient.invalidateQueries({ queryKey: ["myGenerations"] });
    },
  });
}

// Simulate the 3-step AI pipeline in memory
function simulatePipeline(genId: string) {
  const steps: GenerationStatus[] = [
    "step1_deepseek",
    "step2_qwen",
    "step3_gpt4o",
    "approved",
  ];
  let delay = 2000;
  for (const status of steps) {
    const d = delay;
    setTimeout(() => {
      mockGenerations = mockGenerations.map((g) => {
        if (g.id !== genId) return g;
        if (status === "approved") {
          return {
            ...g,
            status,
            generatedPreview: {
              title: g.requestDescription.slice(0, 60),
              description:
                "Formation complète générée par IA à partir des ressources disponibles et des bibliothèques mondiales. Ce cours couvre les fondamentaux et les applications pratiques du domaine.",
              chapters: [
                {
                  number: 1,
                  title: "Introduction et Fondements Théoriques",
                  lessons: [
                    "Présentation du domaine et historique",
                    "Concepts clés et terminologie de base",
                    "Cadre réglementaire et normes applicables",
                  ],
                  videoId: "dQw4w9WgXcQ",
                },
                {
                  number: 2,
                  title: "Méthodologie et Approches Pratiques",
                  lessons: [
                    "Les différentes méthodes et leur application",
                    "Outils et technologies utilisés",
                    "Cas pratiques et études de terrain",
                  ],
                },
                {
                  number: 3,
                  title: "Applications Avancées et Projets",
                  lessons: [
                    "Projets professionnels types",
                    "Gestion des défis courants",
                    "Perspectives et évolutions du secteur",
                  ],
                  videoId: "YQHsXMglC9A",
                },
              ],
            },
          };
        }
        return { ...g, status };
      });
    }, d);
    delay += 3000;
  }
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
      return TERMINAL_STATUSES.includes(data.status) ? false : 2000;
    },
  });
}

export function useListMyGenerations() {
  return useQuery<CourseGeneration[]>({
    queryKey: ["myGenerations"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockGenerations;
    },
    refetchInterval: 3000,
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
      return {
        isValid: false,
        errorMessage: "Certificat introuvable ou non valide.",
      };
    },
    enabled: !!payload,
  });
}

// ---- External courses ----

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

let mockModelConfig: import("./types").AIModelConfig = {
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
  sources?: LibraryApiType[];
}

export type LibraryApiType =
  | "open_library"
  | "gutenberg"
  | "internet_archive"
  | "google_books"
  | "doaj"
  | "crossref"
  | "youtube";

export const LIBRARY_SOURCE_ORDER = [
  "Biblioth\u00e8que Ouverte",
  "Projet Gutenberg",
  "Archives Internet",
  "Google Livres",
  "YouTube",
];

export function useSearchWorldLibraries(params: LibrarySearchQuery | null) {
  return useQuery<LibrarySearchResult[]>({
    queryKey: [
      "worldLibraries",
      params?.query,
      params?.domain,
      params?.sources,
    ],
    queryFn: async () => {
      if (!params?.query || params.query.trim().length < 3) return [];
      await new Promise((r) => setTimeout(r, 900));
      // Return YouTube results if youtube source is selected
      if (params.sources?.includes("youtube")) {
        return [
          {
            id: "yt-1",
            title: `${params.query} — Guide complet pour débutants`,
            author: "EDUCERT Academy",
            source: "YouTube",
            description: "Cours vidéo complet en français",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            videoId: "dQw4w9WgXcQ",
            sourceType: "youtube",
          },
          {
            id: "yt-2",
            title: `Maîtriser ${params.query} en pratique`,
            author: "Formation Pro RDC",
            source: "YouTube",
            description: "Formation professionnelle accélérée",
            url: "https://www.youtube.com/watch?v=YQHsXMglC9A",
            videoId: "YQHsXMglC9A",
            sourceType: "youtube",
          },
        ];
      }
      return [];
    },
    enabled: !!params && params.query.trim().length >= 3,
    staleTime: 30000,
  });
}

export function useSearchYouTubeVideos() {
  return useMutation({
    mutationFn: async (params: {
      query: string;
      maxResults?: number;
    }): Promise<YouTubeVideoResult[]> => {
      await new Promise((r) => setTimeout(r, 1200));
      return [
        {
          videoId: "dQw4w9WgXcQ",
          title: `${params.query} — Cours complet en français`,
          channelTitle: "EDUCERT Academy",
          description: "Formation professionnelle officielle — Module 1",
          thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
          duration: "45:22",
        },
        {
          videoId: "YQHsXMglC9A",
          title: `Maîtriser ${params.query} — Niveau avancé`,
          channelTitle: "Formation Pro RDC",
          description: "Techniques avancées et cas pratiques",
          thumbnailUrl: "https://img.youtube.com/vi/YQHsXMglC9A/hqdefault.jpg",
          duration: "1:12:05",
        },
        {
          videoId: "3tmd-ClpJxA",
          title: `Les fondamentaux de ${params.query}`,
          channelTitle: "Académie Numérique Congo",
          description: "Introduction et concepts de base",
          thumbnailUrl: "https://img.youtube.com/vi/3tmd-ClpJxA/hqdefault.jpg",
          duration: "28:47",
        },
      ];
    },
  });
}

export function useSearchRealLibraries() {
  return useMutation({
    mutationFn: async (_params: {
      searchTerm: string;
      sources?: string[];
    }): Promise<string[]> => {
      await new Promise((r) => setTimeout(r, 1200));
      return [];
    },
  });
}

// ---- AI Tutor hooks ----

const _tutorStore: Record<string, TutorMessage[]> = {};

export function useGetTutorHistory(courseId: string) {
  return useQuery<TutorMessage[]>({
    queryKey: ["tutorHistory", courseId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return _tutorStore[courseId] ?? [];
    },
    enabled: !!courseId,
    staleTime: 0,
  });
}

export function useAskTutor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      courseId: string;
      lessonId: string;
      question: string;
      lessonContext?: string;
    }): Promise<TutorMessage> => {
      const key = params.courseId;
      if (!_tutorStore[key]) _tutorStore[key] = [];
      const userMsg: TutorMessage = {
        id: BigInt(Date.now()),
        courseId: BigInt(0),
        lessonId: BigInt(0),
        userId: "user1",
        role: "user",
        content: params.question,
        createdAt: BigInt(Date.now()),
      };
      _tutorStore[key].push(userMsg);
      await new Promise((r) => setTimeout(r, 1200));
      const aiReply: TutorMessage = {
        id: BigInt(Date.now() + 1),
        courseId: BigInt(0),
        lessonId: BigInt(0),
        userId: "ai",
        role: "assistant",
        content: `Excellente question\u00a0! En tant que votre tuteur, je vais vous expliquer ce concept.\n\nConcernant \u00ab\u00a0${params.question.slice(0, 80)}\u00a0\u00bb \u2014 ce sujet est fondamental dans le cadre de cette le\u00e7on. Il convient d'abord de poser les bases th\u00e9oriques, puis d'illustrer par des exemples concrets.\n\nN'h\u00e9sitez pas \u00e0 approfondir si vous souhaitez explorer un aspect particulier.`,
        createdAt: BigInt(Date.now() + 1),
      };
      _tutorStore[key].push(aiReply);
      return aiReply;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["tutorHistory", vars.courseId],
      });
    },
  });
}

export function useClearTutorHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      await new Promise((r) => setTimeout(r, 200));
      _tutorStore[courseId] = [];
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({ queryKey: ["tutorHistory", courseId] });
    },
  });
}

// ---- Chapter quiz generation (AI) ----

export function useGenerateChapterQuiz() {
  return useMutation({
    mutationFn: async (_params: {
      courseId: string;
      lessonId: string;
      lessonContent: string;
    }): Promise<string> => {
      await new Promise((r) => setTimeout(r, 1500));
      const questions = [
        {
          id: "q1",
          text: "Quelle est la d\u00e9finition correcte du concept principal abord\u00e9 dans cette le\u00e7on\u00a0?",
          options: [
            "Une m\u00e9thode permettant d'analyser et de structurer les probl\u00e8mes complexes",
            "Un outil de gestion des ressources humaines uniquement",
            "Une technique de marketing digital",
            "Un cadre de d\u00e9veloppement logiciel exclusivement",
          ],
          correctIndex: 0,
          explanation:
            "Le concept principal porte sur l'analyse et la structuration des probl\u00e8mes complexes.",
        },
        {
          id: "q2",
          text: "Parmi les \u00e9l\u00e9ments suivants, lequel est essentiel \u00e0 la mise en pratique des notions de ce chapitre\u00a0?",
          options: [
            "La m\u00e9morisation passive des d\u00e9finitions",
            "L'application pratique et la r\u00e9flexion critique",
            "L'utilisation exclusive d'outils num\u00e9riques",
            "Le travail individuel sans collaboration",
          ],
          correctIndex: 1,
          explanation:
            "L'application pratique combin\u00e9e \u00e0 la r\u00e9flexion critique est indispensable pour ma\u00eetriser les comp\u00e9tences d\u00e9velopp\u00e9es dans ce chapitre.",
        },
        {
          id: "q3",
          text: "Quel est l'objectif p\u00e9dagogique principal de ce chapitre\u00a0?",
          options: [
            "Acqu\u00e9rir des comp\u00e9tences th\u00e9oriques sans application",
            "M\u00e9moriser une liste de termes techniques",
            "D\u00e9velopper une compr\u00e9hension approfondie et op\u00e9rationnelle",
            "Obtenir un certificat sans apprentissage r\u00e9el",
          ],
          correctIndex: 2,
          explanation:
            "L'objectif est de d\u00e9velopper une compr\u00e9hension \u00e0 la fois th\u00e9orique et pratique.",
        },
        {
          id: "q4",
          text: "Comment les ressources acad\u00e9miques contribuent-elles \u00e0 votre formation\u00a0?",
          options: [
            "Elles remplacent l'effort personnel de l'apprenant",
            "Elles servent uniquement de d\u00e9coration bibliographique",
            "Elles apportent une base scientifique authentique et v\u00e9rifiable",
            "Elles sont optionnelles et sans impact sur l'apprentissage",
          ],
          correctIndex: 2,
          explanation:
            "Les ressources acad\u00e9miques authentiques constituent le socle scientifique du cours.",
        },
        {
          id: "q5",
          text: "Quelle approche est recommand\u00e9e pour valider sa compr\u00e9hension apr\u00e8s une le\u00e7on\u00a0?",
          options: [
            "Passer directement \u00e0 la le\u00e7on suivante sans r\u00e9vision",
            "R\u00e9pondre au quiz de validation et consulter le tuteur IA en cas de doute",
            "Copier les r\u00e9ponses des autres apprenants",
            "Ignorer les \u00e9valuations et se concentrer sur le certificat final",
          ],
          correctIndex: 1,
          explanation:
            "La validation par quiz et le recours au tuteur IA sont les meilleures pratiques pour consolider les acquis.",
        },
      ];
      return JSON.stringify({ questions, passingScore: 70 });
    },
  });
}

// ---- Notification hooks ----

export function useGetMyNotifications(_unreadOnly = false) {
  return useQuery<AppNotification[]>({
    queryKey: ["notifications", _unreadOnly],
    queryFn: async () => [],
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notifId: string) => {
      await new Promise((r) => setTimeout(r, 200));
      return notifId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useClearMyNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ---- Research project hooks ----

const _mockResearchProjects: ResearchProject[] = [];

export function useListMyResearchProjects() {
  return useQuery<ResearchProject[]>({
    queryKey: ["researchProjects"],
    queryFn: async () => [..._mockResearchProjects],
    staleTime: 10000,
  });
}

export function useGetResearchProject(projectId: bigint | string | null) {
  return useQuery<ResearchProject | null>({
    queryKey: ["researchProject", projectId?.toString()],
    queryFn: async () =>
      _mockResearchProjects.find(
        (p) => p.id.toString() === projectId?.toString(),
      ) ?? null,
    enabled: !!projectId,
    staleTime: 0,
  });
}

export function useCreateResearchProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      researchType?: ResearchType;
      domain?: string;
      institution?: string;
      directorName?: string;
    }): Promise<ResearchProject> => {
      await new Promise((r) => setTimeout(r, 500));
      const project: ResearchProject = {
        id: BigInt(Date.now()),
        userId: "user1",
        title: params.title,
        researchType: params.researchType,
        domain: params.domain,
        institution: params.institution,
        directorName: params.directorName,
        steps: [],
        currentStep: "sujet",
        status: "draft",
        createdAt: BigInt(Date.now()),
        updatedAt: BigInt(Date.now()),
        resourceCitations: [],
      };
      _mockResearchProjects.push(project);
      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researchProjects"] });
    },
  });
}

export function useSendResearchMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      projectId: bigint | string;
      step: string;
      userInput?: string;
      message?: string;
    }): Promise<{ ok: string } | { err: string }> => {
      await new Promise((r) => setTimeout(r, 1400));
      const project = _mockResearchProjects.find(
        (p) => p.id.toString() === params.projectId.toString(),
      );
      if (!project) return { err: "Projet non trouvé" };
      const aiResponse = buildResearchAIResponse(
        params.step,
        params.userInput ?? params.message ?? "",
      );
      const existingIdx = project.steps.findIndex(([s]) => s === params.step);
      const stepData = {
        step: params.step as ResearchProject["currentStep"],
        content: params.userInput ?? params.message ?? "",
        aiResponse,
        validated: false,
        validatedAt: null,
        resources: [
          "Méthodologie de recherche scientifique — Prof. K. Mbula, UNIKIN",
          "Guide rédactionnel des TFC/Mémoires — Ministère de l'ESURS",
        ],
      };
      if (existingIdx >= 0) {
        project.steps[existingIdx] = [
          params.step as ResearchProject["currentStep"],
          stepData,
        ];
      } else {
        project.steps.push([
          params.step as ResearchProject["currentStep"],
          stepData,
        ]);
      }
      project.status = "in_progress";
      project.updatedAt = BigInt(Date.now());
      return { ok: aiResponse };
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["researchProject", vars.projectId?.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["researchProjects"] });
    },
  });
}

function buildResearchAIResponse(step: string, userInput: string): string {
  const preview = userInput.slice(0, 100);
  const responses: Record<string, string> = {
    sujet: `Excellent choix de sujet ! Votre proposition « ${preview} » est pertinente et répond à un besoin réel dans le contexte congolais.\n\nEn tant que votre Directeur de Recherche, je vous recommande de :\n• Délimiter précisément le champ géographique et temporel\n• Identifier les principales variables de votre étude\n• Vérifier la disponibilité des données primaires et secondaires\n\nCe sujet est scientifiquement recevable. Passez maintenant à la formulation de votre problématique.`,
    problematique: `Votre problématique « ${preview} » soulève une question centrale légitime.\n\nAnalyse académique :\n• La question est bien posée et délimitée\n• Elle s'inscrit dans la littérature existante du domaine\n• Elle permet une réponse empiriquement vérifiable\n\nJe valide cette problématique sous réserve que vous précisiez l'unité d'analyse (individus, entreprises, institutions). Formulez maintenant vos hypothèses de travail.`,
    hypotheses: `Vos hypothèses « ${preview} » sont bien articulées.\n\nÉvaluation méthodologique :\n• H1 est vérifiable empiriquement — bonne formulation\n• Assurez-vous que chaque hypothèse découle logiquement de la problématique\n• Distinguez hypothèse principale et hypothèses secondaires\n\nCes hypothèses sont scientifiquement acceptables. Procédez maintenant à la définition de votre méthodologie.`,
    methodologie: `L'approche méthodologique « ${preview} » est cohérente avec vos objectifs.\n\nRecommandations :\n• Précisez si vous optez pour une approche qualitative, quantitative ou mixte\n• Décrivez votre population cible et votre échantillon\n• Mentionnez les outils de collecte (questionnaire, entretien, observation)\n\nCette méthodologie est validée. Construisez maintenant votre plan de travail détaillé.`,
    plan: `Votre plan de travail est structuré de manière académique.\n\nStructure validée :\n• Introduction générale\n• Chapitre I : Cadre théorique et conceptuel\n• Chapitre II : Méthodologie de recherche\n• Chapitre III : Présentation et analyse des résultats\n• Chapitre IV : Discussion et recommandations\n• Conclusion générale et perspectives\n\nCe plan respecte les normes académiques de l'ESURS. Vous pouvez commencer la rédaction.`,
    redaction: `Je vous accompagne dans votre rédaction sur « ${preview} ».\n\nConseils de rédaction académique :\n• Rédigez à la 3ème personne du singulier\n• Chaque affirmation doit être sourcée ou démontrée\n• Utilisez des transitions logiques entre les sections\n\nJe reste disponible pour analyser vos sections au fur et à mesure. Soumettez vos paragraphes pour une révision approfondie.`,
  };
  return (
    responses[step] ??
    `Analyse de votre contribution « ${preview} » effectuée. Continuez selon les directives méthodologiques.`
  );
}

export function useValidateResearchStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      projectId: bigint | string;
      step: string;
    }): Promise<ResearchProject> => {
      await new Promise((r) => setTimeout(r, 400));
      const project = _mockResearchProjects.find(
        (p) => p.id.toString() === params.projectId.toString(),
      );
      if (!project) throw new Error("Projet non trouvé");
      const stepOrder = [
        "sujet",
        "problematique",
        "hypotheses",
        "methodologie",
        "plan",
        "redaction",
      ] as const;
      // Mark step as validated
      const stepIdx = project.steps.findIndex(([s]) => s === params.step);
      if (stepIdx >= 0) {
        project.steps[stepIdx][1].validated = true;
        project.steps[stepIdx][1].validatedAt = BigInt(Date.now());
      }
      // Advance to next step
      const currentIdx = stepOrder.indexOf(
        params.step as (typeof stepOrder)[number],
      );
      if (currentIdx < stepOrder.length - 1) {
        project.currentStep = stepOrder[currentIdx + 1];
      } else {
        project.status = "completed";
      }
      project.updatedAt = BigInt(Date.now());
      return { ...project, steps: [...project.steps] };
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["researchProject", vars.projectId?.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["researchProjects"] });
    },
  });
}

// ---- Domain hooks ----

let _mockDomains: Domain[] = [];

export function useListDomains() {
  return useQuery<Domain[]>({
    queryKey: ["domains"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return _mockDomains;
    },
    staleTime: 60000,
  });
}

export function useCreateDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      tier: DomainTier;
      requiresManualApproval: boolean;
    }): Promise<bigint> => {
      await new Promise((r) => setTimeout(r, 500));
      const id = BigInt(Date.now());
      _mockDomains = [
        ..._mockDomains,
        {
          id,
          ...params,
          createdAt: BigInt(Date.now()),
          createdBy: "admin",
        },
      ];
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
}

export function useUpdateDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name?: string;
      description?: string;
      tier?: DomainTier;
      requiresManualApproval?: boolean;
    }): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 400));
      _mockDomains = _mockDomains.map((d) =>
        d.id === params.id ? { ...d, ...params } : d,
      );
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
}

export function useDeleteDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: bigint | { id: bigint }): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 400));
      const id = typeof params === "bigint" ? params : params.id;
      _mockDomains = _mockDomains.filter((d) => d.id !== id);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
}

// ---- Admin learner / enrollment hooks ----

export function useListEnrollments(_courseId?: string) {
  return useQuery<Enrollment[]>({
    queryKey: ["allEnrollments", _courseId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return [];
    },
    staleTime: 30000,
  });
}

export function useGenerateInactivityNotifications() {
  return useMutation({
    mutationFn: async (): Promise<number> => {
      await new Promise((r) => setTimeout(r, 1000));
      return 0;
    },
  });
}

export function useGetInactivityNotifCount() {
  return useQuery<number>({
    queryKey: ["inactivityNotifCount"],
    queryFn: async () => 0,
    staleTime: 60000,
  });
}

export function useSendLearnerNotification() {
  return useMutation({
    mutationFn: async (_params: {
      learnerId: string;
      message?: string;
      name?: string;
      courseId?: string;
    }): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 500));
      return true;
    },
  });
}
