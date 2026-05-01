export type UserRole =
  | "learner"
  | "instructor"
  | "admin"
  | "ministryReviewer"
  | "guest";

export interface UserProfile {
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  thumbnail: string;
  category: string;
  difficulty: Difficulty;
  duration: number; // minutes
  lessonCount: number;
  enrollmentCount: number;
  rating: number;
  ratingCount: number;
  price: number; // 0 = free
  tags: string[];
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number; // seconds
  order: number;
  videoUrl?: string;
  content?: string;
  published: boolean;
}

export interface Enrollment {
  id: string;
  courseId: string;
  learnerId: string;
  progress: number; // 0-100
  completedLessons: string[];
  enrolledAt: number;
  completedAt?: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  instructor?: string;
  learnerId: string;
  learnerName: string;
  issuedAt: number;
  // Ministry-specific fields
  ministryReviewerName?: string;
  resourceCitations: string[];
  qrCodePayload: string;
  isMinistryApproved: boolean;
  approvedAt?: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  learnerId: string;
  answers: number[];
  score: number;
  passed: boolean;
  submittedAt: number;
}

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface CourseFilters {
  category?: string;
  difficulty?: Difficulty;
  search?: string;
  priceType?: "free" | "paid" | "all";
}

export interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  avgRating: number;
}

export interface CourseInput {
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  outcomes: string[];
  thumbnail: string;
  price: number;
  tags: string[];
}

export interface LessonInput {
  courseId: string;
  title: string;
  description: string;
  type: "text" | "video";
  content?: string;
  videoUrl?: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  lessonId: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage 0-100
}

// ---- Resource types ----

export type ResourceType =
  | "pdf"
  | "word"
  | "excel"
  | "html"
  | "video"
  | "youtube"
  | "weblink";
export type ResourceStatus = "pending" | "indexed" | "error";

export interface Resource {
  id: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  status: ResourceStatus;
  fileUrl?: string;
  externalUrl?: string;
  keywords: string[];
  subjects: string[];
  uploadedAt: number;
}

// ---- AI Generation types ----

export type GenerationStatus =
  | "queued"
  | "step1_deepseek"
  | "step2_qwen"
  | "step3_gpt4o"
  | "approved"
  | "rejected"
  | "revision_needed";

export interface AIStep {
  step: 1 | 2 | 3;
  model: "deepseek" | "qwen" | "gpt4o";
  completedAt?: number;
  output?: string;
}

export interface CourseGeneration {
  id: string;
  requestDescription: string;
  requestedBy: string;
  status: GenerationStatus;
  steps: AIStep[];
  resourceIds: string[];
  generatedCourseId?: string;
  errorMessage?: string;
  createdAt: number;
  libraryResultsCount?: number;
  aiModelConfig?: AIModelConfig;
}

// ---- Certificate verification ----

export interface CertificateVerification {
  isValid: boolean;
  certificate?: Certificate;
  errorMessage?: string;
}

// ---- External courses ----

export interface ExternalCourse {
  id: string;
  url: string;
  title: string;
  description: string;
  platform: string;
  thumbnailUrl?: string;
  addedBy: string;
  addedAt: bigint;
  viewCount: bigint;
}

// ---- AI model configuration ----

export type AIModelPreset =
  | "deepseek_r1"
  | "qwen_72b"
  | "gpt4o"
  | "gpt5"
  | "claude_opus"
  | "claude_sonnet";

export interface AIModelConfig {
  structureModel: string;
  contentModel: string;
  validationModel: string;
}

// ---- World library search ----

export interface LibrarySearchResult {
  id: string;
  title: string;
  author: string;
  year?: string;
  source: string;
  description: string;
  url: string;
  previewUrl?: string;
  coverUrl?: string;
}
