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
export type CertificateId = string;
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
    sourceType?: string;
    coverUrl?: string;
    videoId?: string;
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
export interface ResearchProjectPublic {
    id: bigint;
    status: ResearchStatus;
    title: string;
    userId: UserId;
    createdAt: Timestamp;
    resourceCitations: Array<string>;
    updatedAt: Timestamp;
    steps: Array<[ResearchStep, ResearchStepDataPublic]>;
    currentStep: ResearchStep;
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
export interface AIStep {
    completedAt?: Timestamp;
    model: string;
    output?: string;
    step: bigint;
}
export interface ResearchStepDataPublic {
    content: string;
    resources: Array<string>;
    validated: boolean;
    step: ResearchStep;
    validatedAt?: Timestamp;
    aiResponse: string;
}
export interface NotificationPublic {
    id: bigint;
    title: string;
    userId: UserId;
    notificationType: NotificationType;
    createdAt: Timestamp;
    isRead: boolean;
    message: string;
    courseId?: CourseId;
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
export interface TutorMessage {
    id: bigint;
    lessonId: LessonId;
    content: string;
    userId: UserId;
    createdAt: Timestamp;
    role: TutorMessageRole;
    courseId: CourseId;
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
    avatarUrl?: string;
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
export interface LessonInput {
    title: string;
    content: string;
    videoBlob?: ExternalBlob;
    lessonType: LessonType;
}
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
export interface Domain {
    id: bigint;
    name: string;
    createdAt: Timestamp;
    createdBy: UserId;
    requiresManualApproval: boolean;
    tier: DomainTier;
    description: string;
}
export interface LibrarySearchQuery {
    domain?: string;
    profession?: string;
    searchTerm: string;
    maxResults: bigint;
}
export interface CourseInput {
    title: string;
    thumbnail?: ExternalBlob;
    difficulty: Difficulty;
    description: string;
    learningOutcomes: Array<string>;
    category: string;
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
    portfolioPhotoUrl?: string;
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
export enum DomainTier {
    vip = "vip",
    standard = "standard"
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
export enum NotificationType {
    course_update = "course_update",
    certificate_issued = "certificate_issued",
    quiz_ready = "quiz_ready",
    inactivity_reminder = "inactivity_reminder",
    research_feedback = "research_feedback"
}
export enum ResearchStatus {
    in_progress = "in_progress",
    completed = "completed",
    draft = "draft"
}
export enum ResearchStep {
    plan = "plan",
    problematique = "problematique",
    hypotheses = "hypotheses",
    sujet = "sujet",
    methodologie = "methodologie",
    redaction = "redaction"
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
export enum TutorMessageRole {
    user = "user",
    assistant = "assistant"
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
    askTutor(arg0: {
        lessonId: LessonId;
        question: string;
        lessonContext: string;
        courseId: CourseId;
    }): Promise<{
        __kind__: "ok";
        ok: TutorMessage;
    } | {
        __kind__: "err";
        err: string;
    }>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    clearMyNotifications(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    clearTutorHistory(arg0: {
        courseId: CourseId;
    }): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCourse(input: CourseInput): Promise<CourseId>;
    createDomain(name: string, tier: DomainTier, description: string, requiresManualApproval: boolean): Promise<{
        __kind__: "ok";
        ok: Domain;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createResearchProject(arg0: {
        title: string;
    }): Promise<{
        __kind__: "ok";
        ok: ResearchProjectPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCourse(courseId: CourseId): Promise<void>;
    deleteDomain(id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
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
    generateCertificate(courseId: CourseId): Promise<Certificate>;
    generateChapterQuiz(courseId: CourseId, lessonId: LessonId, lessonContent: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    generateInactivityNotifications(): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
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
    getMyNotifications(arg0: {
        unreadOnly: boolean;
    }): Promise<Array<NotificationPublic>>;
    getQuiz(lessonId: LessonId): Promise<QuizPublic | null>;
    getResearchProject(arg0: {
        projectId: bigint;
    }): Promise<{
        __kind__: "ok";
        ok: ResearchProjectPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getResource(id: bigint): Promise<ResourcePublic | null>;
    getUserProfile(userId: UserId): Promise<UserProfilePublic | null>;
    importGoogleDocResource(docUrl: string, title: string, adminId: Principal): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    indexResourceText(id: bigint, extractedText: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listAllGenerations(): Promise<Array<CourseGenerationPublic>>;
    listCourses(category: string | null): Promise<Array<CoursePublic>>;
    listDomains(): Promise<Array<Domain>>;
    listExternalCourses(): Promise<Array<ExternalCoursePublic>>;
    listMyGenerations(): Promise<Array<CourseGenerationPublic>>;
    listMyResearchProjects(): Promise<Array<ResearchProjectPublic>>;
    listResources(resourceType: ResourceType | null, search: string | null): Promise<Array<ResourcePublic>>;
    markAllNotificationsRead(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markLessonComplete(courseId: CourseId, lessonId: LessonId): Promise<void>;
    markNotificationRead(arg0: {
        notifId: bigint;
    }): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    queryTutorHistory(arg0: {
        courseId: CourseId;
    }): Promise<Array<TutorMessage>>;
    rejectGeneratedCourse(generationId: bigint, reason: string): Promise<CourseGenerationPublic>;
    reorderLesson(lessonId: LessonId, newOrder: bigint): Promise<void>;
    requestCourseGeneration(description: string, resourceIds: Array<bigint> | null): Promise<CourseGenerationPublic>;
    runAIGeneration(generationId: bigint): Promise<void>;
    saveCallerUserProfile(name: string, bio: string, role: UserRole, avatarUrl: string | null): Promise<void>;
    saveLastViewedLesson(courseId: CourseId, lessonId: LessonId): Promise<void>;
    searchCourses(searchTerm: string, category: string | null): Promise<Array<CoursePublic>>;
    searchRealLibraries(searchTerm: string, sources: Array<string>): Promise<Array<string>>;
    searchWorldLibraries(searchQuery: LibrarySearchQuery): Promise<Array<LibrarySearchResult>>;
    sendResearchMessage(arg0: {
        step: ResearchStep;
        userInput: string;
        projectId: bigint;
    }): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setAdminModelConfig(config: AIModelConfig): Promise<void>;
    setCoursePublished(courseId: CourseId, published: boolean): Promise<void>;
    setQuiz(lessonId: LessonId, questions: Array<QuizQuestion>, passingScore: bigint): Promise<QuizId>;
    submitQuiz(courseId: CourseId, submission: QuizSubmission): Promise<QuizResult>;
    trackExternalCourseView(id: string): Promise<void>;
    transformHttpResponse(input: TransformationInput): Promise<TransformationOutput>;
    transformNotifHttpResponse(input: TransformationInput): Promise<TransformationOutput>;
    transformResearchHttpResponse(input: TransformationInput): Promise<TransformationOutput>;
    transformResourcesHttpResponse(input: TransformationInput): Promise<TransformationOutput>;
    transformTutorHttpResponse(input: TransformationInput): Promise<TransformationOutput>;
    unenrollCourse(courseId: CourseId): Promise<void>;
    updateCourse(courseId: CourseId, input: CourseInput): Promise<void>;
    updateDomain(id: bigint, tier: DomainTier, requiresManualApproval: boolean): Promise<{
        __kind__: "ok";
        ok: Domain;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateLesson(lessonId: LessonId, input: LessonInput): Promise<void>;
    updateResourceMetadata(id: bigint, title: string, description: string, keywords: Array<string> | null, subjects: Array<string> | null): Promise<ResourcePublic>;
    uploadResource(title: string, description: string, resourceType: ResourceType, fileUrl: string | null, externalUrl: string | null, keywords: Array<string> | null): Promise<ResourcePublic>;
    validateResearchStep(arg0: {
        step: ResearchStep;
        projectId: bigint;
    }): Promise<{
        __kind__: "ok";
        ok: ResearchProjectPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    verifyCertificateQR(qrPayload: string): Promise<CertificateVerification | null>;
}
