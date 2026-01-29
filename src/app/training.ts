import { Injectable } from '@angular/core';

// Define interfaces for better type safety
interface Content {
  id: number;
  title: string;
  text: string;
  type: string;
}

interface ContentData {
  id: number;
  lessonId: number;
  title: string;
  text: string;
}

interface Lesson {
  id: number;
  name: string;
  progress: number;
  content: Content[];
  completed: boolean;
}

interface Module {
  id: number;
  name: string;
  progress: number;
  lessons: Lesson[];
  description?: string;
  difficulty?: string;
  lastAccessedDate?: string;
  isCurrentlyEngaged?: boolean;
  consecutiveDaysEngaged?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private modules: Module[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with all CSV data
    this.modules = this.buildModulesFromCSVData();
  }

  private buildModulesFromCSVData(): Module[] {
    // All modules from learning_modules.csv
    const modulesData = [
      { id: 1, name: 'Digital Basics', code: 'MOD001', description: 'Learn fundamental computer skills including file management, browsers, and typing', difficulty: 'Beginner', progress: 50, lastAccessedDate: '2026-01-28', consecutiveDaysEngaged: 5, isCurrentlyEngaged: true },
      { id: 2, name: 'Internet Safety Fundamentals', code: 'MOD002', description: 'Stay safe online with password security, threat recognition, and personal info protection', difficulty: 'Beginner', progress: 45, lastAccessedDate: '2026-01-25', consecutiveDaysEngaged: 3, isCurrentlyEngaged: false },
      { id: 3, name: 'Social Media Awareness', code: 'MOD003', description: 'Navigate social media responsibly, understand digital footprints, handle cyberbullying', difficulty: 'Beginner', progress: 40, lastAccessedDate: '2026-01-20', consecutiveDaysEngaged: 0, isCurrentlyEngaged: false },
      { id: 4, name: 'Introduction to AI', code: 'MOD004', description: 'Discover what AI is, how it works, and its presence in everyday life', difficulty: 'Intermediate', progress: 60, lastAccessedDate: '2026-01-29', consecutiveDaysEngaged: 7, isCurrentlyEngaged: true },
      { id: 5, name: 'AI in Daily Life', code: 'MOD005', description: 'Explore AI applications like voice assistants, recommendations, and smart devices', difficulty: 'Beginner', progress: 55, lastAccessedDate: '2026-01-28', consecutiveDaysEngaged: 4, isCurrentlyEngaged: true },
      { id: 6, name: 'Future of Work', code: 'MOD006', description: 'Understand how technology is changing careers and what skills will be valuable', difficulty: 'Intermediate', progress: 50, lastAccessedDate: '2026-01-26', consecutiveDaysEngaged: 2, isCurrentlyEngaged: false },
      { id: 7, name: 'Coding Fundamentals', code: 'MOD007', description: 'Learn basic programming concepts through visual programming and logic exercises', difficulty: 'Intermediate', progress: 35, lastAccessedDate: '2026-01-15', consecutiveDaysEngaged: 0, isCurrentlyEngaged: false },
      { id: 8, name: 'Data Literacy', code: 'MOD008', description: 'Read, interpret, and work with data, charts, and basic statistics', difficulty: 'Intermediate', progress: 40, lastAccessedDate: '2026-01-22', consecutiveDaysEngaged: 1, isCurrentlyEngaged: false },
      { id: 9, name: 'Digital Communication', code: 'MOD009', description: 'Master professional email writing, video calls, and online collaboration', difficulty: 'Beginner', progress: 65, lastAccessedDate: '2026-01-29', consecutiveDaysEngaged: 6, isCurrentlyEngaged: true },
      { id: 10, name: 'Career Exploration', code: 'MOD010', description: 'Discover career paths, understand your strengths, plan your educational journey', difficulty: 'Beginner', progress: 30, lastAccessedDate: '2026-01-18', consecutiveDaysEngaged: 0, isCurrentlyEngaged: false },
      { id: 11, name: 'Financial Literacy', code: 'MOD011', description: 'Learn about digital payments, budgeting, and smart money management', difficulty: 'Intermediate', progress: 45, lastAccessedDate: '2026-01-27', consecutiveDaysEngaged: 3, isCurrentlyEngaged: false },
      { id: 12, name: 'Creative Digital Tools', code: 'MOD012', description: 'Express yourself using digital design, photo editing, and content creation', difficulty: 'Intermediate', progress: 55, lastAccessedDate: '2026-01-24', consecutiveDaysEngaged: 1, isCurrentlyEngaged: false }
    ];

    // All lessons from lessons.csv with progress and completion status
    const lessonsData = [
      // Module 1 lessons
      { id: 1, moduleId: 1, title: 'Computer Basics', progress: 70, completed: true },
      { id: 2, moduleId: 1, title: 'File Management', progress: 60, completed: true },
      { id: 3, moduleId: 1, title: 'Web Browsers', progress: 50, completed: false },
      { id: 4, moduleId: 1, title: 'Search Engines', progress: 55, completed: false },
      { id: 5, moduleId: 1, title: 'Typing Skills', progress: 65, completed: true },
      { id: 6, moduleId: 1, title: 'Document Creation', progress: 45, completed: false },
      { id: 7, moduleId: 1, title: 'Spreadsheets Intro', progress: 40, completed: false },
      { id: 8, moduleId: 1, title: 'Presentations', progress: 35, completed: false },
      { id: 9, moduleId: 1, title: 'Email Setup', progress: 50, completed: false },
      { id: 10, moduleId: 1, title: 'Cloud Storage', progress: 55, completed: false },
      // Module 2 lessons
      { id: 11, moduleId: 2, title: 'Password Basics', progress: 65, completed: true },
      { id: 12, moduleId: 2, title: 'Strong Passwords', progress: 55, completed: false },
      { id: 13, moduleId: 2, title: 'Phishing Awareness', progress: 40, completed: false },
      { id: 14, moduleId: 2, title: 'Safe Browsing', progress: 45, completed: false },
      { id: 15, moduleId: 2, title: 'Secure Websites', progress: 50, completed: false },
      { id: 16, moduleId: 2, title: 'Personal Info Protection', progress: 35, completed: false },
      { id: 17, moduleId: 2, title: 'Privacy Settings', progress: 40, completed: false },
      { id: 18, moduleId: 2, title: 'Two-Factor Auth', progress: 30, completed: false },
      { id: 19, moduleId: 2, title: 'Software Updates', progress: 25, completed: false },
      { id: 20, moduleId: 2, title: 'Backup Basics', progress: 35, completed: false },
      // Module 3 lessons
      { id: 21, moduleId: 3, title: 'Social Media Overview', progress: 50, completed: false },
      { id: 22, moduleId: 3, title: 'Profile Privacy', progress: 45, completed: false },
      { id: 23, moduleId: 3, title: 'Digital Footprint', progress: 35, completed: false },
      { id: 24, moduleId: 3, title: 'Responsible Posting', progress: 30, completed: false },
      { id: 25, moduleId: 3, title: 'Cyberbullying', progress: 40, completed: false },
      { id: 26, moduleId: 3, title: 'Reporting Tools', progress: 25, completed: false },
      { id: 27, moduleId: 3, title: 'Fake Accounts', progress: 35, completed: false },
      { id: 28, moduleId: 3, title: 'Screen Time', progress: 30, completed: false },
      { id: 29, moduleId: 3, title: 'Online Reputation', progress: 45, completed: false },
      { id: 30, moduleId: 3, title: 'Healthy Habits', progress: 40, completed: false },
      // Module 4 lessons (10 lessons)
      { id: 31, moduleId: 4, title: 'What is AI', progress: 70, completed: true },
      { id: 32, moduleId: 4, title: 'AI History', progress: 65, completed: true },
      { id: 33, moduleId: 4, title: 'Machine Learning Basics', progress: 55, completed: false },
      { id: 34, moduleId: 4, title: 'Neural Networks Intro', progress: 50, completed: false },
      { id: 35, moduleId: 4, title: 'AI Applications', progress: 60, completed: false },
      { id: 36, moduleId: 4, title: 'ChatBots Explained', progress: 45, completed: false },
      { id: 37, moduleId: 4, title: 'Computer Vision', progress: 40, completed: false },
      { id: 38, moduleId: 4, title: 'Voice Recognition', progress: 50, completed: false },
      { id: 39, moduleId: 4, title: 'AI Limitations', progress: 35, completed: false },
      { id: 40, moduleId: 4, title: 'AI Ethics', progress: 55, completed: false },
      // Module 5 lessons (10 lessons)
      { id: 41, moduleId: 5, title: 'AI in Your Phone', progress: 55, completed: true },
      { id: 42, moduleId: 5, title: 'Smart Assistants', progress: 50, completed: false },
      { id: 43, moduleId: 5, title: 'Recommendation Systems', progress: 60, completed: true },
      { id: 44, moduleId: 5, title: 'AI in Games', progress: 45, completed: false },
      { id: 45, moduleId: 5, title: 'AI in Photos', progress: 55, completed: false },
      { id: 46, moduleId: 5, title: 'Autocomplete & AI', progress: 40, completed: false },
      { id: 47, moduleId: 5, title: 'AI in Navigation', progress: 50, completed: false },
      { id: 48, moduleId: 5, title: 'Smart Home Devices', progress: 65, completed: true },
      { id: 49, moduleId: 5, title: 'AI in Healthcare', progress: 35, completed: false },
      { id: 50, moduleId: 5, title: 'Future AI', progress: 60, completed: false },
      // Module 6 lessons (10 lessons)
      { id: 51, moduleId: 6, title: 'Changing Workplace', progress: 50, completed: false },
      { id: 52, moduleId: 6, title: 'New Job Types', progress: 45, completed: false },
      { id: 53, moduleId: 6, title: 'Skills for Tomorrow', progress: 55, completed: false },
      { id: 54, moduleId: 6, title: 'Remote Work', progress: 40, completed: false },
      { id: 55, moduleId: 6, title: 'Automation Impact', progress: 35, completed: false },
      { id: 56, moduleId: 6, title: 'Gig Economy', progress: 60, completed: true },
      { id: 57, moduleId: 6, title: 'Entrepreneurship', progress: 50, completed: false },
      { id: 58, moduleId: 6, title: 'Lifelong Learning', progress: 55, completed: false },
      { id: 59, moduleId: 6, title: 'Career Adaptability', progress: 40, completed: false },
      { id: 60, moduleId: 6, title: 'Future Planning', progress: 45, completed: false },
      // Module 7 lessons (10 lessons)
      { id: 61, moduleId: 7, title: 'What is Coding', progress: 35, completed: false },
      { id: 62, moduleId: 7, title: 'Logic & Sequences', progress: 30, completed: false },
      { id: 63, moduleId: 7, title: 'Variables', progress: 25, completed: false },
      { id: 64, moduleId: 7, title: 'Loops', progress: 30, completed: false },
      { id: 65, moduleId: 7, title: 'Conditionals', progress: 25, completed: false },
      { id: 66, moduleId: 7, title: 'Functions', progress: 40, completed: false },
      { id: 67, moduleId: 7, title: 'Debugging', progress: 20, completed: false },
      { id: 68, moduleId: 7, title: 'Problem Decomposition', progress: 35, completed: false },
      { id: 69, moduleId: 7, title: 'Algorithms Intro', progress: 30, completed: false },
      { id: 70, moduleId: 7, title: 'First Program', progress: 45, completed: false },
      // Module 8 lessons (10 lessons)
      { id: 71, moduleId: 8, title: 'What is Data', progress: 40, completed: false },
      { id: 72, moduleId: 8, title: 'Types of Data', progress: 45, completed: false },
      { id: 73, moduleId: 8, title: 'Reading Charts', progress: 50, completed: false },
      { id: 74, moduleId: 8, title: 'Making Graphs', progress: 35, completed: false },
      { id: 75, moduleId: 8, title: 'Averages & Percentages', progress: 40, completed: false },
      { id: 76, moduleId: 8, title: 'Data Collection', progress: 30, completed: false },
      { id: 77, moduleId: 8, title: 'Survey Design', progress: 35, completed: false },
      { id: 78, moduleId: 8, title: 'Data Cleaning', progress: 45, completed: false },
      { id: 79, moduleId: 8, title: 'Drawing Conclusions', progress: 50, completed: false },
      { id: 80, moduleId: 8, title: 'Data Stories', progress: 40, completed: false },
      // Module 9 lessons (10 lessons)
      { id: 81, moduleId: 9, title: 'Email Etiquette', progress: 65, completed: true },
      { id: 82, moduleId: 9, title: 'Professional Writing', progress: 60, completed: true },
      { id: 83, moduleId: 9, title: 'Video Calls', progress: 70, completed: true },
      { id: 84, moduleId: 9, title: 'Screen Sharing', progress: 65, completed: true },
      { id: 85, moduleId: 9, title: 'Online Collaboration', progress: 60, completed: false },
      { id: 86, moduleId: 9, title: 'Meeting Netiquette', progress: 55, completed: false },
      { id: 87, moduleId: 9, title: 'Digital Presentations', progress: 65, completed: true },
      { id: 88, moduleId: 9, title: 'Feedback Online', progress: 50, completed: false },
      { id: 89, moduleId: 9, title: 'Time Zones', progress: 45, completed: false },
      { id: 90, moduleId: 9, title: 'Communication Tools', progress: 60, completed: false },
      // Module 10 lessons (10 lessons)
      { id: 91, moduleId: 10, title: 'Self Assessment', progress: 30, completed: false },
      { id: 92, moduleId: 10, title: 'Interest Discovery', progress: 25, completed: false },
      { id: 93, moduleId: 10, title: 'Career Research', progress: 35, completed: false },
      { id: 94, moduleId: 10, title: 'Education Paths', progress: 30, completed: false },
      { id: 95, moduleId: 10, title: 'Skill Mapping', progress: 40, completed: false },
      { id: 96, moduleId: 10, title: 'Industry Overview', progress: 25, completed: false },
      { id: 97, moduleId: 10, title: 'Networking Basics', progress: 35, completed: false },
      { id: 98, moduleId: 10, title: 'Resume Intro', progress: 30, completed: false },
      { id: 99, moduleId: 10, title: 'Interview Prep', progress: 25, completed: false },
      { id: 100, moduleId: 10, title: 'Goal Setting', progress: 35, completed: false },
      // Module 11 lessons (10 lessons)
      { id: 101, moduleId: 11, title: 'Money Basics', progress: 45, completed: false },
      { id: 102, moduleId: 11, title: 'Digital Payments', progress: 50, completed: false },
      { id: 103, moduleId: 11, title: 'UPI & Wallets', progress: 55, completed: false },
      { id: 104, moduleId: 11, title: 'Online Banking Safety', progress: 40, completed: false },
      { id: 105, moduleId: 11, title: 'Budgeting', progress: 35, completed: false },
      { id: 106, moduleId: 11, title: 'Saving Habits', progress: 50, completed: false },
      { id: 107, moduleId: 11, title: 'Wants vs Needs', progress: 45, completed: false },
      { id: 108, moduleId: 11, title: 'Scam Prevention', progress: 40, completed: false },
      { id: 109, moduleId: 11, title: 'Smart Shopping', progress: 35, completed: false },
      { id: 110, moduleId: 11, title: 'Financial Planning', progress: 45, completed: false },
      // Module 12 lessons (10 lessons)
      { id: 111, moduleId: 12, title: 'Design Principles', progress: 55, completed: false },
      { id: 112, moduleId: 12, title: 'Color & Typography', progress: 50, completed: false },
      { id: 113, moduleId: 12, title: 'Canva Basics', progress: 60, completed: true },
      { id: 114, moduleId: 12, title: 'Photo Editing', progress: 55, completed: false },
      { id: 115, moduleId: 12, title: 'Creating Posts', progress: 50, completed: false },
      { id: 116, moduleId: 12, title: 'Infographics', progress: 45, completed: false },
      { id: 117, moduleId: 12, title: 'Video Basics', progress: 40, completed: false },
      { id: 118, moduleId: 12, title: 'Content Planning', progress: 55, completed: false },
      { id: 119, moduleId: 12, title: 'Copyright', progress: 35, completed: false },
      { id: 120, moduleId: 12, title: 'Building Portfolio', progress: 60, completed: false }
    ];

    // All lesson contents from lesson_content.csv
    const contentData: ContentData[] = [
      // Lesson 1 (4 parts each)
      { id: 1, lessonId: 1, title: 'Computer Basics - Part 1', text: 'This text content covers key concepts about computer basics.' },
      { id: 2, lessonId: 1, title: 'Computer Basics - Part 2', text: 'This video content covers key concepts about computer basics.' },
      { id: 3, lessonId: 1, title: 'Computer Basics - Part 3', text: 'This image content covers key concepts about computer basics.' },
      { id: 4, lessonId: 1, title: 'Computer Basics - Part 4', text: 'This interactive content covers key concepts about computer basics.' },
      // Lesson 2
      { id: 5, lessonId: 2, title: 'File Management - Part 1', text: 'This text content covers key concepts about file management.' },
      { id: 6, lessonId: 2, title: 'File Management - Part 2', text: 'This video content covers key concepts about file management.' },
      { id: 7, lessonId: 2, title: 'File Management - Part 3', text: 'This image content covers key concepts about file management.' },
      { id: 8, lessonId: 2, title: 'File Management - Part 4', text: 'This interactive content covers key concepts about file management.' },
      // Lesson 3
      { id: 9, lessonId: 3, title: 'Web Browsers - Part 1', text: 'This text content covers key concepts about web browsers.' },
      { id: 10, lessonId: 3, title: 'Web Browsers - Part 2', text: 'This video content covers key concepts about web browsers.' },
      { id: 11, lessonId: 3, title: 'Web Browsers - Part 3', text: 'This image content covers key concepts about web browsers.' },
      { id: 12, lessonId: 3, title: 'Web Browsers - Part 4', text: 'This interactive content covers key concepts about web browsers.' },
      // Lesson 4
      { id: 13, lessonId: 4, title: 'Search Engines - Part 1', text: 'This text content covers key concepts about search engines.' },
      { id: 14, lessonId: 4, title: 'Search Engines - Part 2', text: 'This video content covers key concepts about search engines.' },
      { id: 15, lessonId: 4, title: 'Search Engines - Part 3', text: 'This image content covers key concepts about search engines.' },
      { id: 16, lessonId: 4, title: 'Search Engines - Part 4', text: 'This interactive content covers key concepts about search engines.' },
      // Lesson 5
      { id: 17, lessonId: 5, title: 'Typing Skills - Part 1', text: 'This text content covers key concepts about typing skills.' },
      { id: 18, lessonId: 5, title: 'Typing Skills - Part 2', text: 'This video content covers key concepts about typing skills.' },
      { id: 19, lessonId: 5, title: 'Typing Skills - Part 3', text: 'This image content covers key concepts about typing skills.' },
      { id: 20, lessonId: 5, title: 'Typing Skills - Part 4', text: 'This interactive content covers key concepts about typing skills.' },
      // Continuing for all 120 lessons with their 4 parts each...
      // For brevity, I'll add a few more key lessons and use the pattern
      { id: 21, lessonId: 6, title: 'Document Creation - Part 1', text: 'This text content covers key concepts about document creation.' },
      { id: 22, lessonId: 6, title: 'Document Creation - Part 2', text: 'This video content covers key concepts about document creation.' },
      { id: 23, lessonId: 6, title: 'Document Creation - Part 3', text: 'This image content covers key concepts about document creation.' },
      { id: 24, lessonId: 6, title: 'Document Creation - Part 4', text: 'This interactive content covers key concepts about document creation.' },
      // Lesson 7
      { id: 25, lessonId: 7, title: 'Spreadsheets Intro - Part 1', text: 'This text content covers key concepts about spreadsheets intro.' },
      { id: 26, lessonId: 7, title: 'Spreadsheets Intro - Part 2', text: 'This video content covers key concepts about spreadsheets intro.' },
      { id: 27, lessonId: 7, title: 'Spreadsheets Intro - Part 3', text: 'This image content covers key concepts about spreadsheets intro.' },
      { id: 28, lessonId: 7, title: 'Spreadsheets Intro - Part 4', text: 'This interactive content covers key concepts about spreadsheets intro.' },
      // Lesson 8
      { id: 29, lessonId: 8, title: 'Presentations - Part 1', text: 'This text content covers key concepts about presentations.' },
      { id: 30, lessonId: 8, title: 'Presentations - Part 2', text: 'This video content covers key concepts about presentations.' },
      { id: 31, lessonId: 8, title: 'Presentations - Part 3', text: 'This image content covers key concepts about presentations.' },
      { id: 32, lessonId: 8, title: 'Presentations - Part 4', text: 'This interactive content covers key concepts about presentations.' },
      // Lesson 9
      { id: 33, lessonId: 9, title: 'Email Setup - Part 1', text: 'This text content covers key concepts about email setup.' },
      { id: 34, lessonId: 9, title: 'Email Setup - Part 2', text: 'This video content covers key concepts about email setup.' },
      { id: 35, lessonId: 9, title: 'Email Setup - Part 3', text: 'This image content covers key concepts about email setup.' },
      { id: 36, lessonId: 9, title: 'Email Setup - Part 4', text: 'This interactive content covers key concepts about email setup.' },
      // Lesson 10
      { id: 37, lessonId: 10, title: 'Cloud Storage - Part 1', text: 'This text content covers key concepts about cloud storage.' },
      { id: 38, lessonId: 10, title: 'Cloud Storage - Part 2', text: 'This video content covers key concepts about cloud storage.' },
      { id: 39, lessonId: 10, title: 'Cloud Storage - Part 3', text: 'This image content covers key concepts about cloud storage.' },
      { id: 40, lessonId: 10, title: 'Cloud Storage - Part 4', text: 'This interactive content covers key concepts about cloud storage.' },
      // Module 2 Lesson contents (11-20)
      { id: 41, lessonId: 11, title: 'Password Basics - Part 1', text: 'This text content covers key concepts about password basics.' },
      { id: 42, lessonId: 11, title: 'Password Basics - Part 2', text: 'This video content covers key concepts about password basics.' },
      { id: 43, lessonId: 11, title: 'Password Basics - Part 3', text: 'This image content covers key concepts about password basics.' },
      { id: 44, lessonId: 11, title: 'Password Basics - Part 4', text: 'This interactive content covers key concepts about password basics.' },
      { id: 45, lessonId: 12, title: 'Strong Passwords - Part 1', text: 'This text content covers key concepts about strong passwords.' },
      { id: 46, lessonId: 12, title: 'Strong Passwords - Part 2', text: 'This video content covers key concepts about strong passwords.' },
      { id: 47, lessonId: 12, title: 'Strong Passwords - Part 3', text: 'This image content covers key concepts about strong passwords.' },
      { id: 48, lessonId: 12, title: 'Strong Passwords - Part 4', text: 'This interactive content covers key concepts about strong passwords.' },
      { id: 49, lessonId: 13, title: 'Phishing Awareness - Part 1', text: 'This text content covers key concepts about phishing awareness.' },
      { id: 50, lessonId: 13, title: 'Phishing Awareness - Part 2', text: 'This video content covers key concepts about phishing awareness.' },
      { id: 51, lessonId: 13, title: 'Phishing Awareness - Part 3', text: 'This image content covers key concepts about phishing awareness.' },
      { id: 52, lessonId: 13, title: 'Phishing Awareness - Part 4', text: 'This interactive content covers key concepts about phishing awareness.' },
      { id: 53, lessonId: 14, title: 'Safe Browsing - Part 1', text: 'This text content covers key concepts about safe browsing.' },
      { id: 54, lessonId: 14, title: 'Safe Browsing - Part 2', text: 'This video content covers key concepts about safe browsing.' },
      { id: 55, lessonId: 14, title: 'Safe Browsing - Part 3', text: 'This image content covers key concepts about safe browsing.' },
      { id: 56, lessonId: 14, title: 'Safe Browsing - Part 4', text: 'This interactive content covers key concepts about safe browsing.' },
      { id: 57, lessonId: 15, title: 'Secure Websites - Part 1', text: 'This text content covers key concepts about secure websites.' },
      { id: 58, lessonId: 15, title: 'Secure Websites - Part 2', text: 'This video content covers key concepts about secure websites.' },
      { id: 59, lessonId: 15, title: 'Secure Websites - Part 3', text: 'This image content covers key concepts about secure websites.' },
      { id: 60, lessonId: 15, title: 'Secure Websites - Part 4', text: 'This interactive content covers key concepts about secure websites.' },
      // Continue pattern for remaining lessons...
      // Adding sample content for lessons 16-30
      ...this.generateContentForLessons(16, 20, 61),
      ...this.generateContentForLessons(21, 30, 81),
      // Module 3 content (lessons 21-30)
      ...this.generateContentForLessons(31, 40, 101),
      // Module 4 content (lessons 31-40)
      ...this.generateContentForLessons(41, 50, 121),
      // Module 5 content (lessons 41-50)
      ...this.generateContentForLessons(51, 60, 141),
      // Module 6 content (lessons 51-60)
      ...this.generateContentForLessons(61, 70, 161),
      // Module 7 content (lessons 61-70)
      ...this.generateContentForLessons(71, 80, 181),
      // Module 8 content (lessons 71-80)
      ...this.generateContentForLessons(81, 90, 201),
      // Module 9 content (lessons 81-90)
      ...this.generateContentForLessons(91, 100, 221),
      // Module 10 content (lessons 91-100)
      ...this.generateContentForLessons(101, 110, 241),
      // Module 11 content (lessons 101-110)
      ...this.generateContentForLessons(111, 120, 261)
      // Module 12 content (lessons 111-120)
    ];

    // Build the complete modules structure
    return modulesData.map(moduleData => {
      const moduleLessons = lessonsData
        .filter(lesson => lesson.moduleId === moduleData.id)
        .map(lesson => {
          const lessonContent = contentData
            .filter(content => content.lessonId === lesson.id)
            .map(content => ({
              id: content.id,
              title: content.title,
              text: content.text,
              type: 'text'
            }));

          return {
            id: lesson.id,
            name: lesson.title,
            progress: lesson.progress,
            content: lessonContent,
            completed: lesson.completed
          };
        });

      return {
        id: moduleData.id,
        name: moduleData.name,
        progress: moduleData.progress,
        description: moduleData.description,
        difficulty: moduleData.difficulty,
        lessons: moduleLessons,
        lastAccessedDate: moduleData.lastAccessedDate,
        isCurrentlyEngaged: moduleData.isCurrentlyEngaged,
        consecutiveDaysEngaged: moduleData.consecutiveDaysEngaged
      };
    });
  }

  // Helper method to generate content for lessons
  private generateContentForLessons(startLessonId: number, endLessonId: number, startContentId: number): ContentData[] {
    const contents: ContentData[] = [];
    let contentId = startContentId;

    // Lesson titles mapping
    const lessonTitles: { [key: number]: string } = {
      16: 'Personal Info Protection', 17: 'Privacy Settings', 18: 'Two-Factor Auth', 19: 'Software Updates', 20: 'Backup Basics',
      21: 'Social Media Overview', 22: 'Profile Privacy', 23: 'Digital Footprint', 24: 'Responsible Posting', 25: 'Cyberbullying',
      26: 'Reporting Tools', 27: 'Fake Accounts', 28: 'Screen Time', 29: 'Online Reputation', 30: 'Healthy Habits',
      31: 'What is AI', 32: 'AI History', 33: 'Machine Learning Basics', 34: 'Neural Networks Intro', 35: 'AI Applications',
      36: 'ChatBots Explained', 37: 'Computer Vision', 38: 'Voice Recognition', 39: 'AI Limitations', 40: 'AI Ethics',
      41: 'AI in Your Phone', 42: 'Smart Assistants', 43: 'Recommendation Systems', 44: 'AI in Games', 45: 'AI in Photos',
      46: 'Autocomplete & AI', 47: 'AI in Navigation', 48: 'Smart Home Devices', 49: 'AI in Healthcare', 50: 'Future AI',
      51: 'Changing Workplace', 52: 'New Job Types', 53: 'Skills for Tomorrow', 54: 'Remote Work', 55: 'Automation Impact',
      56: 'Gig Economy', 57: 'Entrepreneurship', 58: 'Lifelong Learning', 59: 'Career Adaptability', 60: 'Future Planning',
      61: 'What is Coding', 62: 'Logic & Sequences', 63: 'Variables', 64: 'Loops', 65: 'Conditionals',
      66: 'Functions', 67: 'Debugging', 68: 'Problem Decomposition', 69: 'Algorithms Intro', 70: 'First Program',
      71: 'What is Data', 72: 'Types of Data', 73: 'Reading Charts', 74: 'Making Graphs', 75: 'Averages & Percentages',
      76: 'Data Collection', 77: 'Survey Design', 78: 'Data Cleaning', 79: 'Drawing Conclusions', 80: 'Data Stories',
      81: 'Email Etiquette', 82: 'Professional Writing', 83: 'Video Calls', 84: 'Screen Sharing', 85: 'Online Collaboration',
      86: 'Meeting Netiquette', 87: 'Digital Presentations', 88: 'Feedback Online', 89: 'Time Zones', 90: 'Communication Tools',
      91: 'Self Assessment', 92: 'Interest Discovery', 93: 'Career Research', 94: 'Education Paths', 95: 'Skill Mapping',
      96: 'Industry Overview', 97: 'Networking Basics', 98: 'Resume Intro', 99: 'Interview Prep', 100: 'Goal Setting',
      101: 'Money Basics', 102: 'Digital Payments', 103: 'UPI & Wallets', 104: 'Online Banking Safety', 105: 'Budgeting',
      106: 'Saving Habits', 107: 'Wants vs Needs', 108: 'Scam Prevention', 109: 'Smart Shopping', 110: 'Financial Planning',
      111: 'Design Principles', 112: 'Color & Typography', 113: 'Canva Basics', 114: 'Photo Editing', 115: 'Creating Posts',
      116: 'Infographics', 117: 'Video Basics', 118: 'Content Planning', 119: 'Copyright', 120: 'Building Portfolio'
    };

    for (let lessonId = startLessonId; lessonId <= endLessonId; lessonId++) {
      const lessonTitle = lessonTitles[lessonId] || 'Lesson';
      const parts = ['Part 1', 'Part 2', 'Part 3', 'Part 4'];
      const types = ['text', 'video', 'image', 'interactive'];

      for (let i = 0; i < 4; i++) {
        contents.push({
          id: contentId++,
          lessonId: lessonId,
          title: `${lessonTitle} - ${parts[i]}`,
          text: `This ${types[i]} content covers key concepts about ${lessonTitle.toLowerCase()}.`
        });
      }
    }

    return contents;
  }

  getModuleById(id: number): Module | undefined {
    return this.modules.find(module => module.id === id);
  }

  getLessonByModuleAndName(moduleId: number, lessonName: string) {
    const module = this.getModuleById(moduleId);
    if (!module) return null;
    return module.lessons.find(lesson => lesson.name === lessonName);
  }

  getAllModules(): Module[] {
    return this.modules;
  }
}