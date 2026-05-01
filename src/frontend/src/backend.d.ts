import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface AIStep {
    completedAt?: Timestamp;
    model: string;
    output?: string;
    step: bigint;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface QuizQuestion {
    id: bigint;
    question: string;
    correctOptionIndex: bigint;
    options: Array<string>;
}
export interface QuizPublic {
    id: QuizId;
    lessonId: LessonId;
    passingScore: bigint;
    questions: Array<QuizQuestion>;
    courseId: CourseId;
}
export interface LibrarySearchResult {
    id: string;
    url: string;
    title: string;
    source: string;
    previewUrl?: string;
    year?: string;
    description: string;
    author: string;
    coverUrl?: string;
}
export interface ResourcePublic {
    id: bigint;
    status: ResourceStatus;
    title: string;
    subjects?: Array<string>;
    description: string;
    extractedText?: string;
    keywords?: Array<string>;
    resourceType: ResourceType;
    externalUrl?: string;
    uploadedAt: Timestamp;
    uploadedBy: UserId;
    fileUrl?: string;
}
export interface AIModelConfig {
    validationModel: string;
    structureModel: string;
    contentModel: string;
}
export interface QuizAttempt {
    answers: Array<bigint>;
    score: bigint;
    attemptedAt: Timestamp;
    passed: boolean;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface EnrollmentPublic {
    completedAt?: Timestamp;
    lastLessonId?: LessonId;
    lessonProgress: Array<LessonProgressPublic>;
    learnerId: UserId;
    completionPercent: bigint;
    enrolledAt: Timestamp;
    courseId: CourseId;
}
export type CourseId = bigint;
export interface CourseGenerationPublic {
    id: bigint;
    status: GenerationStatus;
    aiModelConfig: AIModelConfig;
    requestDescription: string;
    libraryResultsCount: bigint;
    createdAt: Timestamp;
    errorMessage?: string;
    generatedCourseId?: CourseId;
    updatedAt: Timestamp;
    steps: Array<AIStep>;
    resourceIds: Array<bigint>;
    requestedBy: UserId;
}
export interface LessonProgressPublic {
    lessonId: LessonId;
    completed: boolean;
    quizAttempts: Array<QuizAttempt>;
    lastViewedAt: Timestamp;
}
export interface CoursePublic {
    id: CourseId;
    title: string;
    thumbnail?: ExternalBlob;
    isPublished: boolean;
    difficulty: Difficulty;
    createdAt: Timestamp;
    description: string;
    instructorId: UserId;
    updatedAt: Timestamp;
    learningOutcomes: Array<string>;
    category: string;
}
export type LessonId = bigint;
export interface LessonInput {
    title: string;
    content: string;
    videoBlob?: ExternalBlob;
    lessonType: LessonType;
}
export interface QuizResult {
    score: bigint;
    totalQuestions: bigint;
    correctAnswers: bigint;
    passed: boolean;
}
export interface LessonPublic {
    id: LessonId;
    title: string;
    content: string;
    hasQuiz: boolean;
    order: bigint;
    createdAt: Timestamp;
    videoBlob?: ExternalBlob;
    lessonType: LessonType;
    courseId: CourseId;
}
export interface QuizSubmission {
    answers: Array<bigint>;
    quizId: QuizId;
}
export interface UserProfilePublic {
    id: UserId;
    bio: string;
    name: string;
    createdAt: Timestamp;
    role: UserRole;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface ExternalCoursePublic {
    id: string;
    url: string;
    title: string;
    thumbnailUrl?: string;
    description: string;
    platform: string;
    viewCount: bigint;
    addedAt: Timestamp;
    addedBy: UserId;
}
export interface CourseInput {
    title: string;
    thumbnail?: ExternalBlob;
    difficulty: Difficulty;
    description: string;
    learningOutcomes: Array<string>;
    category: string;
}
export type CertificateId = string;
export interface LibrarySearchQuery {
    domain?: string;
    profession?: string;
    searchTerm: string;
    maxResults: bigint;
}
export interface CertificateVerification {
    issueDate: Timestamp;
    courseTitle: string;
    isValid: boolean;
    ministryApproved: boolean;
}
export interface Certificate {
    id: CertificateId;
    ministryReviewerName?: string;
    approvedAt?: Timestamp;
    isMinistryApproved: boolean;
    resourceCitations: Array<string>;
    learnerId: UserId;
    learnerName: string;
    issuedAt: Timestamp;
    courseTitle: string;
    qrCodePayload: string;
    courseId: CourseId;
    instructorName: string;
}
export type QuizId = bigint;
export enum Difficulty {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export enum GenerationStatus {
    step3_gpt4o = "step3_gpt4o",
    step1_deepseek = "step1_deepseek",
    approved = "approved",
    rejected = "rejected",
    step2_qwen = "step2_qwen",
    queued = "queued",
    revision_needed = "revision_needed"
}
export enum LessonType {
    video = "video",
    text = "text"
}
export enum ResourceStatus {
    pending = "pending",
    error = "error",
    indexed = "indexed"
}
export enum ResourceType {
    pdf = "pdf",
    video = "video",
    html = "html",
    word = "word",
    weblink = "weblink",
    excel = "excel",
    library_book = "library_book",
    youtube = "youtube",
    external_course = "external_course"
}
export enum UserRole {
    ministryReviewer = "ministryReviewer",
    learner = "learner",
    admin = "admin",
    instructor = "instructor"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addExternalCourse(url: string, title: string, description: string, platform: string, thumbnailUrl: string | null): Promise<{
        __kind__: "ok";
        ok: ExternalCoursePublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addLesson(courseId: CourseId, input: LessonInput): Promise<LessonId>;
    approveGeneratedCourse(generationId: bigint, reviewerNotes: string): Promise<CourseGenerationPublic>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createCourse(input: CourseInput): Promise<CourseId>;
    deleteCourse(courseId: CourseId): Promise<void>;
    deleteExternalCourse(id: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteLesson(lessonId: LessonId): Promise<void>;
    deleteQuiz(lessonId: LessonId): Promise<void>;
    deleteResource(id: bigint): Promise<void>;
    enrollCourse(courseId: CourseId): Promise<void>;
    getAdminModelConfig(): Promise<AIModelConfig>;
    getCallerUserProfile(): Promise<UserProfilePublic | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getCertificate(certId: CertificateId): Promise<Certificate | null>;
    getCourse(courseId: CourseId): Promise<CoursePublic | null>;
    getCourseEnrollments(courseId: CourseId): Promise<Array<EnrollmentPublic>>;
    getGenerationStatus(generationId: bigint): Promise<CourseGenerationPublic | null>;
    getInstructorCourses(): Promise<Array<CoursePublic>>;
    getLessons(courseId: CourseId): Promise<Array<LessonPublic>>;
    getMyCertificates(): Promise<Array<Certificate>>;
    getMyEnrollments(): Promise<Array<EnrollmentPublic>>;
    getQuiz(lessonId: LessonId): Promise<QuizPublic | null>;
    getResource(id: bigint): Promise<ResourcePublic | null>;
    getUserProfile(userId: UserId): Promise<UserProfilePublic | null>;
    indexResourceText(id: bigint, extractedText: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listAllGenerations(): Promise<Array<CourseGenerationPublic>>;
    listCourses(category: string | null): Promise<Array<CoursePublic>>;
    listExternalCourses(): Promise<Array<ExternalCoursePublic>>;
    listMyGenerations(): Promise<Array<CourseGenerationPublic>>;
    listResources(resourceType: ResourceType | null, search: string | null): Promise<Array<ResourcePublic>>;
    markLessonComplete(courseId: CourseId, lessonId: LessonId): Promise<void>;
    rejectGeneratedCourse(generationId: bigint, reason: string): Promise<CourseGenerationPublic>;
    reorderLesson(lessonId: LessonId, newOrder: bigint): Promise<void>;
    requestCourseGeneration(description: string, resourceIds: Array<bigint> | null): Promise<CourseGenerationPublic>;
    runAIGeneration(generationId: bigint): Promise<void>;
    saveCallerUserProfile(name: string, bio: string, role: UserRole): Promise<void>;
    saveLastViewedLesson(courseId: CourseId, lessonId: LessonId): Promise<void>;
    searchCourses(searchTerm: string, category: string | null): Promise<Array<CoursePublic>>;
    searchWorldLibraries(searchQuery: LibrarySearchQuery): Promise<Array<LibrarySearchResult>>;
    setAdminModelConfig(config: AIModelConfig): Promise<void>;
    setCoursePublished(courseId: CourseId, published: boolean): Promise<void>;
    setQuiz(lessonId: LessonId, questions: Array<QuizQuestion>, passingScore: bigint): Promise<QuizId>;
    submitQuiz(courseId: CourseId, submission: QuizSubmission): Promise<QuizResult>;
    trackExternalCourseView(id: string): Promise<void>;
    transformHttpResponse(input: TransformationInput): Promise<TransformationOutput>;
    unenrollCourse(courseId: CourseId): Promise<void>;
    updateCourse(courseId: CourseId, input: CourseInput): Promise<void>;
    updateLesson(lessonId: LessonId, input: LessonInput): Promise<void>;
    updateResourceMetadata(id: bigint, title: string, description: string, keywords: Array<string> | null, subjects: Array<string> | null): Promise<ResourcePublic>;
    uploadResource(title: string, description: string, resourceType: ResourceType, fileUrl: string | null, externalUrl: string | null, keywords: Array<string> | null): Promise<ResourcePublic>;
    verifyCertificateQR(qrPayload: string): Promise<CertificateVerification | null>;
}
