import { GATEWAY_ENDPOINT } from "../axios.config";

export const courses_api = {
  // Course CRUD operations
  $_create_course(data: any) {
    return GATEWAY_ENDPOINT.post("/courses", data);
  },
  
  $_get_all_courses(params: any = {}) {
    return GATEWAY_ENDPOINT.get("/courses", { params });
  },
  
  $_get_course_by_id(id: string) {
    return GATEWAY_ENDPOINT.get(`/courses/${id}`);
  },
  
  $_get_course_by_slug(slug: string) {
    return GATEWAY_ENDPOINT.get(`/courses/slug/${slug}`);
  },
  
  $_update_course(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/courses/${id}`, data);
  },
  
  $_delete_course(id: string) {
    return GATEWAY_ENDPOINT.delete(`/courses/${id}`);
  },
  
  // Course discovery endpoints
  $_get_popular_courses(limit?: number) {
    return GATEWAY_ENDPOINT.get("/courses/popular", { params: { limit } });
  },
  
  $_get_recent_courses(limit?: number) {
    return GATEWAY_ENDPOINT.get("/courses/recent", { params: { limit } });
  },
  
  $_get_featured_courses(limit?: number) {
    return GATEWAY_ENDPOINT.get("/courses/featured", { params: { limit } });
  },
  
  $_search_courses(query: string, limit?: number) {
    return GATEWAY_ENDPOINT.get("/courses/search", { params: { q: query, limit } });
  },
  
  $_get_related_courses(id: string, limit?: number) {
    return GATEWAY_ENDPOINT.get(`/courses/related/${id}`, { params: { limit } });
  },
  
  // Section management
  $_create_section(data: any) {
    return GATEWAY_ENDPOINT.post("/courses/sections", data);
  },
  
  $_update_section(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/courses/sections/${id}`, data);
  },
  
  $_delete_section(id: string) {
    return GATEWAY_ENDPOINT.delete(`/courses/sections/${id}`);
  },
  
  // Lesson management
  $_create_lesson(data: any) {
    return GATEWAY_ENDPOINT.post("/courses/lessons", data);
  },
  
  $_update_lesson(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/courses/lessons/${id}`, data);
  },
  
  $_delete_lesson(id: string) {
    return GATEWAY_ENDPOINT.delete(`/courses/lessons/${id}`);
  },
  
  // Enrollment
  $_enroll_in_course(courseId: string) {
    return GATEWAY_ENDPOINT.post("/courses/enroll", { courseId });
  },
  
  $_get_user_enrollments() {
    return GATEWAY_ENDPOINT.get("/courses/enrollments/user");
  },
  
  $_get_course_enrollments(courseId: string) {
    return GATEWAY_ENDPOINT.get(`/courses/enrollments/course/${courseId}`);
  },
  
  $_update_lesson_progress(courseId: string, lessonId: string, completed: boolean) {
    return GATEWAY_ENDPOINT.post("/courses/progress", { courseId, lessonId, completed });
  },
  
  $_check_enrollment(courseId: string) {
    return GATEWAY_ENDPOINT.get(`/courses/check-enrollment/${courseId}`);
  },
  
  // Reviews
  $_create_review(data: any) {
    return GATEWAY_ENDPOINT.post("/courses/reviews", data);
  },
  
  $_get_course_reviews(courseId: string) {
    return GATEWAY_ENDPOINT.get(`/courses/reviews/course/${courseId}`);
  },
  
  $_get_user_reviews() {
    return GATEWAY_ENDPOINT.get("/courses/reviews/user");
  },
  
  $_delete_review(id: string) {
    return GATEWAY_ENDPOINT.delete(`/courses/reviews/${id}`);
  },
  
  // Certificates
  $_generate_certificate(courseId: string) {
    return GATEWAY_ENDPOINT.post(`/courses/certificates/${courseId}`);
  },
  
  $_get_user_certificates() {
    return GATEWAY_ENDPOINT.get("/courses/certificates/user");
  },
  
  $_verify_certificate(certificateNumber: string) {
    return GATEWAY_ENDPOINT.get(`/courses/certificates/verify/${certificateNumber}`);
  }
};