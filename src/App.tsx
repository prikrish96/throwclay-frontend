import { Palette } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import { ArtistProfile } from './components/ArtistProfile';
import { ClassesManagement } from './components/ClassesManagement';
import { CommerceMarketplace } from './components/CommerceMarketplace';
import { EventsManagement } from './components/EventsManagement';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/LoginForm';
import { MemberManagement } from './components/MemberManagement';
import { MessagingCenter } from './components/MessagingCenter';
import { Navigation } from './components/Navigation';
import { PotteryJournal } from './components/PotteryJournal';
import { PublicCeramicsMarketplace } from './components/PublicCeramicsMarketplace';
import { PublicStudiosDirectory } from './components/PublicStudiosDirectory';
import { Settings } from './components/Settings';
import { StaffManagement } from './components/StaffManagement';
import { StudioDashboard } from './components/StudioDashboard';
import { Button } from './components/ui/button';
import { Theme } from "@radix-ui/themes";

export interface PhotoEntry {
  id: string;
  url: string;
  type: 'photo' | 'sketch';
  caption: string;
  notes: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  artistId: string;
  throwCount: number;
}

export interface PotteryEntry {
  id: string;
  date: string;
  title: string;
  potteryType: string;
  clayType: string;
  techniques: string[];
  firingType: string;
  firingTemp: string;
  glazes: string[];
  status: 'planning' | 'in-progress' | 'fired' | 'completed';
  notes: string;
  photos: PhotoEntry[];
  challenges: string;
  nextSteps: string;
  artistId: string;
  projectId?: string; // New: Link throws to projects
  isForSale?: boolean;
  price?: number;
  description?: string;
  dimensions?: string;
}

export interface StudioLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  manager?: string;
  capacity: number;
  amenities: string[];
  isActive: boolean;
}

export interface ManagerResponsibility {
  id: string;
  name: string;
  description: string;
  category: 'members' | 'classes' | 'operations' | 'content' | 'custom';
  taskCompletionLink?: string;
  isRequired: boolean;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleEntry {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  category: 'operations' | 'classes' | 'social-media' | 'covering-shift' | 'sick-leave' | 'vacation';
  description?: string;
  locationId?: string;
  classId?: string; // If category is 'classes'
  coveringForId?: string; // If category is 'covering-shift'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  approvedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick-leave' | 'personal' | 'other';
  reason?: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface TimeCardEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakStart?: string[];
  breakEnd?: string[];
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  category: 'operations' | 'classes' | 'social-media' | 'covering-shift' | 'training' | 'other';
  locationId?: string;
  notes?: string;
  wasScheduled: boolean;
  scheduledStart?: string;
  scheduledEnd?: string;
  discrepancyReason?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'needs-review';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface TimeCard {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriodId: string;
  entries: TimeCardEntry[];
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'needs-review' | 'processed';
  submittedAt?: string;
  submittedBy: string;
  reviewedAt?: string;
  reviewedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: 'open' | 'locked' | 'processed' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface TimeCardApproval {
  id: string;
  timeCardId: string;
  approverId: string;
  approverName: string;
  action: 'approved' | 'rejected' | 'needs-changes';
  notes?: string;
  timestamp: string;
  level: number; // 1 = supervisor, 2 = manager, 3 = admin
}

export interface EmployeeCredentials {
  id: string;
  employeeId: string;
  username: string;
  email: string;
  lastPasswordReset?: string;
  requirePasswordChange: boolean;
  loginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorProfile {
  id: string;
  userId: string;
  studioId: string;
  bio?: string;
  specialties: string[];
  certifications: string[];
  experience: string;
  hourlyRate?: number;
  availability: {
    monday: { start: string; end: string; isAvailable: boolean };
    tuesday: { start: string; end: string; isAvailable: boolean };
    wednesday: { start: string; end: string; isAvailable: boolean };
    thursday: { start: string; end: string; isAvailable: boolean };
    friday: { start: string; end: string; isAvailable: boolean };
    saturday: { start: string; end: string; isAvailable: boolean };
    sunday: { start: string; end: string; isAvailable: boolean };
  };
  assignedClasses: string[]; // Class IDs they can edit
  isActive: boolean;
  hiredDate: string;
  profileImage?: string;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
}

export interface ManagerProfile {
  id: string;
  userId: string;
  studioId: string;
  role: 'co-admin' | 'manager' | 'employee';
  responsibilities: string[]; // Array of ManagerResponsibility IDs
  standardWorkHours: {
    monday: { start: string; end: string; isAvailable: boolean };
    tuesday: { start: string; end: string; isAvailable: boolean };
    wednesday: { start: string; end: string; isAvailable: boolean };
    thursday: { start: string; end: string; isAvailable: boolean };
    friday: { start: string; end: string; isAvailable: boolean };
    saturday: { start: string; end: string; isAvailable: boolean };
    sunday: { start: string; end: string; isAvailable: boolean };
  };
  permissions: {
    manageMembers: boolean;
    manageClasses: boolean;
    manageEvents: boolean;
    manageMessages: boolean;
    manageInventory: boolean;
    manageFiring: boolean;
    manageFinances: boolean;
    manageSettings: boolean;
    deleteProfiles: boolean;
    changeSubscription: boolean;
    approveTimeCards: boolean;
    viewPayroll: boolean;
  };
  profileImage?: string;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  maxVacationDays: number;
  maxSickDays: number;
  usedVacationDays: number;
  usedSickDays: number;
  isActive: boolean;
  hiredDate: string;
  lastActivity?: string;
  notes?: string;
  hourlyRate?: number;
  salaryType?: 'hourly' | 'salary';
  overtimeEligible: boolean;
}

export interface WorkLog {
  id: string;
  managerId: string;
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  responsibilities: string[]; // Array of completed responsibility IDs
  notes?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'absent';
  locationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  currentUses: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ClassMaterial {
  id: string;
  name: string;
  description?: string;
  price: number;
  isRequired: boolean;
  productLink?: string;
  category: 'clay' | 'tools' | 'glazes' | 'other';
}

export interface ClassAttendance {
  id: string;
  classId: string;
  sessionDate: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedAt: string;
  markedBy: string;
}

export interface ClassHoliday {
  id: string;
  classId: string;
  originalDate: string;
  rescheduleDate?: string;
  reason: string;
  notificationSent: boolean;
  createdAt: string;
}

export interface StudioMembership {
  id: string;
  userId: string;
  studioId: string;
  locationId?: string;
  membershipType: 'basic' | 'premium' | 'unlimited';
  status: 'active' | 'pending' | 'suspended' | 'expired';
  startDate: string;
  endDate?: string;
  shelfNumber?: string;
  monthlyRate: number;
  passionProjectsUpgrade: boolean;
  passionProjectsRate: number; // $5 for studio members, $12 for non-members
  notes?: string;
  joinedAt: string;
  lastActivity?: string;
}

export interface MembershipApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  studioId: string;
  locationId?: string;
  membershipType: 'basic' | 'premium' | 'unlimited';
  experience: string;
  interests: string[];
  goals: string;
  referralSource?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  customFields: Record<string, any>;
}

export interface PaymentInvoice {
  id: string;
  userId: string;
  studioId: string;
  type: 'membership' | 'class' | 'event' | 'materials' | 'firing' | 'passion-projects';
  amount: number;
  description: string;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  stripePaymentId?: string;
}

export interface EnrollmentFormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio fields
  order: number;
}

export interface StudioEnrollmentForm {
  id: string;
  studioId: string;
  title: string;
  description: string;
  fields: EnrollmentFormField[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  handle: string; // @handle for easy identification
  type: 'studio' | 'artist'; // Simplified to only two types
  studioId?: string; // Artists can be linked to a studio
  profile?: ArtistProfile;
  subscription?: 'free' | 'pro' | 'studio';
  role?: 'owner' | 'admin' | 'manager' | 'instructor' | 'member' | 'student' | 'buyer' | 'guest' | 'future-member'; // Role within studio if applicable
  membership?: StudioMembership; // Studio membership details
  managerProfile?: ManagerProfile; // Manager/employee details
  instructorProfile?: InstructorProfile; // Instructor details
  credentials?: EmployeeCredentials; // Login credentials for employees
  phone?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface ArtistProfile {
  bio: string;
  profileImage?: string;
  coverImage?: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    website?: string;
    twitter?: string;
  };
  customDomain?: string;
  branding?: {
    primaryColor: string;
    logoUrl?: string;
    palette?: string; // Selected color palette name
  };
  specialties?: string[];
  experience?: string;
  achievements?: string[];
}

export interface Studio {
  id: string;
  name: string;
  handle: string; // @handle for studio
  description?: string;
  commissionRate: number;
  glazes: string[];
  firingSchedule: FiringSchedule[];
  members: string[]; // User IDs
  instructors: string[]; // User IDs
  managers: string[]; // User IDs of managers
  locations: StudioLocation[];
  enrollmentForm?: StudioEnrollmentForm;
  responsibilities: ManagerResponsibility[];
  scheduleEntries: ScheduleEntry[];
  timeOffRequests: TimeOffRequest[];
  timeCards: TimeCard[];
  payPeriods: PayPeriod[];
  operatingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  branding: {
    logoUrl?: string;
    coverImageUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    palette: string; // Selected palette name
  };
  cameras: CameraSetup[];
  shifts: ShiftSchedule[];
  settings: {
    allowPublicClasses: boolean;
    requireApprovalForSales: boolean;
    enableMessaging: boolean;
    enableAnnouncements: boolean;
    requireMembershipApproval: boolean;
    allowPassionProjectsUpgrade: boolean;
    autoCreateClassChats: boolean;
    chatCreationHours: number; // Hours before class start to create chat
    maxCoAdmins: number; // Maximum number of co-admins (default 2)
    requireAdminConfirmation: boolean; // Require admin confirmation for sensitive actions
    defaultVacationDays: number; // Default vacation days for new employees
    defaultSickDays: number; // Default sick days for new employees
    requireTimeOffApproval: boolean; // Require approval for time off requests
    requireTimeCardApproval: boolean; // Require approval for time cards
    timeCardApprovalLevels: number; // Number of approval levels (1-3)
    overtimeThreshold: number; // Hours per week before overtime (default 40)
    allowSelfClockIn: boolean; // Allow employees to clock themselves in/out
    timeCardSubmissionDeadline: number; // Days after pay period end to submit
  };
}

export interface FiringSchedule {
  id: string;
  date: string;
  type: string;
  temperature: string;
  capacity: number;
  bookedSlots: number;
  notes?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  kilnId?: string;
  startTime?: string;
  endTime?: string;
  locationId?: string;
}

export interface Class {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  type: 'beginner' | 'intermediate' | 'advanced' | 'workshop' | 'masterclass';
  duration: number; // in hours
  maxStudents: number;
  currentStudents: string[]; // User IDs
  waitlist: string[]; // User IDs on waitlist
  schedule: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
    sessions: number;
    sessionDuration: number; // Duration of each session in hours
  };
  pricing: {
    memberPrice: number;
    nonMemberPrice: number;
    groupDiscount?: {
      minStudents: number;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
    };
    materials: 'included' | 'additional';
    materialsPrice?: number;
  };
  discountCodes: DiscountCode[];
  materials: ClassMaterial[];
  images: {
    cover?: string;
    gallery: string[];
  };
  requirements?: string[];
  whatToExpect?: string[];
  enrollmentEmail: {
    subject: string;
    content: string;
    includeAppInstructions: boolean;
  };
  chatGroupId?: string;
  chatEnabled: boolean;
  isPublic: boolean;
  status: 'draft' | 'published' | 'full' | 'in-progress' | 'completed' | 'cancelled';
  locationId?: string;
  holidays: ClassHoliday[];
  attendance: ClassAttendance[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'exhibition' | 'sale' | 'workshop' | 'competition' | 'social';
  date: string;
  endDate?: string;
  location: string;
  organizer: string;
  organizerId: string;
  maxParticipants?: number;
  currentParticipants: string[]; // User IDs
  requirements?: string[];
  pricing?: {
    participationFee?: number;
    commissionRate?: number;
  };
  images?: string[];
  isPublic: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  locationId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderHandle: string;
  recipientId?: string; // For direct messages
  groupId?: string; // For group messages
  content: string;
  type: 'text' | 'image' | 'announcement' | 'system';
  timestamp: string;
  readBy: string[]; // User IDs who have read the message
  attachments?: string[];
}

export interface ChatGroup {
  id: string;
  name: string;
  type: 'class' | 'general' | 'project' | 'announcement';
  members: string[]; // User IDs
  adminIds: string[]; // User IDs who can manage the group
  description?: string;
  isPrivate: boolean;
  createdAt: string;
  relatedId?: string; // Class ID if it's a class group
  autoCreated?: boolean;
  activationDate?: string; // When the chat becomes active
}

export interface CameraSetup {
  id: string;
  name: string;
  location: string; // e.g., "Kiln 1", "Glazing Area"
  locationId?: string; // Reference to StudioLocation
  type: 'ring' | 'other';
  streamUrl?: string;
  isActive: boolean;
  settings?: {
    recordMotion: boolean;
    nightVision: boolean;
    notifications: boolean;
  };
}

export interface ShiftSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'absent' | 'cancelled';
  locationId?: string;
}

type PageType = 'landing' | 'dashboard' | 'journal' | 'profile' | 'marketplace' | 'settings' | 'classes' | 'events' | 'messages' | 'studios' | 'ceramics' | 'members' | 'staff';

interface AppContextType {
  currentUser: User | null;
  currentStudio: Studio | null;
  setCurrentUser: (user: User | null) => void;
  setCurrentStudio: (studio: Studio | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStudio, setCurrentStudio] = useState<Studio | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [showLogin, setShowLogin] = useState(false);

  // Mock data for demonstration
  const [mockStudio] = useState<Studio>({
    id: '1',
    name: 'Artisan Clay Studio',
    handle: 'artisanclay',
    description: 'A creative space for ceramic artists of all levels',
    commissionRate: 15,
    glazes: [
      'Celadon', 'Iron Red', 'Copper Green', 'Matte White', 'Cobalt Blue',
      'Ash Glaze', 'Tenmoku', 'Shino', 'Oribe', 'Rutile Blue'
    ],
    locations: [
      {
        id: 'loc1',
        name: 'Main Studio',
        address: '123 Clay Street',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
        phone: '(503) 555-0123',
        email: 'main@artisanclay.com',
        manager: 'Sarah Wilson',
        capacity: 50,
        amenities: ['Wheels', 'Kilns', 'Glazing Station', 'Hand Building Area'],
        isActive: true
      },
      {
        id: 'loc2',
        name: 'Eastside Branch',
        address: '456 Pottery Lane',
        city: 'Portland',
        state: 'OR',
        zipCode: '97202',
        phone: '(503) 555-0124',
        email: 'eastside@artisanclay.com',
        manager: 'Mike Chen',
        capacity: 30,
        amenities: ['Wheels', 'Kiln', 'Glazing Station'],
        isActive: true
      }
    ],
    operatingHours: {
      monday: { open: '09:00', close: '21:00', isOpen: true },
      tuesday: { open: '09:00', close: '21:00', isOpen: true },
      wednesday: { open: '09:00', close: '21:00', isOpen: true },
      thursday: { open: '09:00', close: '21:00', isOpen: true },
      friday: { open: '09:00', close: '22:00', isOpen: true },
      saturday: { open: '08:00', close: '22:00', isOpen: true },
      sunday: { open: '10:00', close: '18:00', isOpen: true }
    },
    responsibilities: [
      {
        id: 'resp1',
        name: 'Manage Members',
        description: 'Handle member applications, renewals, and member relations',
        category: 'members',
        taskCompletionLink: '/members',
        isRequired: true,
        isCustom: false,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01'
      },
      {
        id: 'resp2',
        name: 'Manage Classes and Certifications',
        description: 'Oversee class scheduling, instructor assignments, and certification programs',
        category: 'classes',
        taskCompletionLink: '/classes',
        isRequired: true,
        isCustom: false,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01'
      },
      {
        id: 'resp3',
        name: 'Manage Firing Schedule',
        description: 'Coordinate kiln firings, temperature monitoring, and firing schedules',
        category: 'operations',
        taskCompletionLink: '/dashboard',
        isRequired: true,
        isCustom: false,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01'
      }
    ],
    scheduleEntries: [
      {
        id: 'sched1',
        employeeId: 'mgr1',
        date: '2025-06-14',
        startTime: '09:00',
        endTime: '17:00',
        category: 'operations',
        description: 'Studio management and member support',
        locationId: 'loc1',
        status: 'scheduled',
        createdAt: '2025-06-10',
        updatedAt: '2025-06-10'
      }
    ],
    timeOffRequests: [],
    timeCards: [],
    payPeriods: [
      {
        id: 'pp1',
        startDate: '2025-06-01',
        endDate: '2025-06-15',
        payDate: '2025-06-22',
        status: 'open',
        createdAt: '2025-06-01',
        updatedAt: '2025-06-01'
      },
      {
        id: 'pp2',
        startDate: '2025-05-16',
        endDate: '2025-05-31',
        payDate: '2025-06-07',
        status: 'processed',
        createdAt: '2025-05-16',
        updatedAt: '2025-06-07'
      }
    ],
    firingSchedule: [
      {
        id: '1',
        date: '2025-06-15',
        type: 'Bisque',
        temperature: '1000°C',
        capacity: 20,
        bookedSlots: 12,
        notes: 'Regular bisque firing',
        status: 'scheduled',
        kilnId: 'kiln1',
        startTime: '09:00',
        endTime: '18:00',
        locationId: 'loc1'
      },
      {
        id: '2',
        date: '2025-06-18',
        type: 'Glaze',
        temperature: '1280°C',
        capacity: 15,
        bookedSlots: 8,
        notes: 'High-fire glaze firing',
        status: 'scheduled',
        kilnId: 'kiln2',
        startTime: '08:00',
        endTime: '20:00',
        locationId: 'loc1'
      }
    ],
    members: ['artist1', 'artist2', 'artist3'],
    instructors: ['instructor1', 'instructor2'],
    managers: ['manager1', 'manager2'],
    branding: {
      logoUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba6fe65?w=200&h=200&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
      primaryColor: '#8B4513',
      secondaryColor: '#D2B48C',
      palette: 'earthy'
    },
    cameras: [
      {
        id: 'cam1',
        name: 'Kiln 1 Camera',
        location: 'Main Kiln Room',
        locationId: 'loc1',
        type: 'ring',
        streamUrl: 'https://example.com/stream1',
        isActive: true,
        settings: {
          recordMotion: true,
          nightVision: true,
          notifications: true
        }
      },
      {
        id: 'cam2',
        name: 'Studio Overview',
        location: 'Main Studio Floor',
        locationId: 'loc1',
        type: 'ring',
        streamUrl: 'https://example.com/stream2',
        isActive: true,
        settings: {
          recordMotion: false,
          nightVision: false,
          notifications: false
        }
      }
    ],
    shifts: [
      {
        id: 'shift1',
        employeeId: 'instructor1',
        employeeName: 'Sarah Wilson',
        date: '2025-06-14',
        startTime: '09:00',
        endTime: '17:00',
        role: 'Lead Instructor',
        status: 'scheduled',
        locationId: 'loc1'
      },
      {
        id: 'shift2',
        employeeId: 'artist1',
        employeeName: 'Jane Potter',
        date: '2025-06-14',
        startTime: '13:00',
        endTime: '18:00',
        role: 'Studio Assistant',
        status: 'scheduled',
        locationId: 'loc2'
      }
    ],
    settings: {
      allowPublicClasses: true,
      requireApprovalForSales: false,
      enableMessaging: true,
      enableAnnouncements: true,
      requireMembershipApproval: true,
      allowPassionProjectsUpgrade: true,
      autoCreateClassChats: true,
      chatCreationHours: 24,
      maxCoAdmins: 2,
      requireAdminConfirmation: true,
      defaultVacationDays: 15,
      defaultSickDays: 10,
      requireTimeOffApproval: true,
      requireTimeCardApproval: true,
      timeCardApprovalLevels: 2,
      overtimeThreshold: 40,
      allowSelfClockIn: true,
      timeCardSubmissionDeadline: 3
    }
  });

  const handleLogin = (email: string, password: string, userType: 'studio' | 'artist') => {
    // Mock login logic - simulate checking if artist email is linked to a studio
    const isArtistLinkedToStudio = userType === 'artist' && email.includes('studio'); // Simple mock logic

    const mockUser: User = {
      id: 'user1',
      name: userType === 'studio' ? 'Studio Manager' : 'Jane Potter',
      email,
      handle: userType === 'studio' ? 'studiomanager' : 'janepotter',
      type: userType,
      studioId: (userType === 'studio' || isArtistLinkedToStudio) ? '1' : undefined,
      role: userType === 'studio' ? 'owner' : (isArtistLinkedToStudio ? 'member' : undefined),
      profile: userType === 'artist' ? {
        bio: 'Passionate ceramic artist exploring traditional and contemporary techniques.',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b332c35-?w=200&h=200&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=300&fit=crop',
        socialMedia: {
          instagram: '@janepotter',
          website: 'https://janepotter.com'
        },
        specialties: ['Wheel Throwing', 'Glazing', 'Raku'],
        experience: '5 years',
        achievements: ['Regional Pottery Award 2024', 'Featured in Ceramics Monthly']
      } : undefined,
      subscription: userType === 'studio' ? 'studio' : (isArtistLinkedToStudio ? 'studio' : 'free'),
      membership: isArtistLinkedToStudio ? {
        id: 'mem1',
        userId: 'user1',
        studioId: '1',
        locationId: 'loc1',
        membershipType: 'basic',
        status: 'active',
        startDate: '2025-01-01',
        shelfNumber: 'A-15',
        monthlyRate: 85,
        passionProjectsUpgrade: false,
        passionProjectsRate: 5,
        joinedAt: '2025-01-01',
        lastActivity: '2025-06-13'
      } : undefined
    };

    setCurrentUser(mockUser);
    if (userType === 'studio' || isArtistLinkedToStudio) {
      setCurrentStudio(mockStudio);
    }
    setCurrentPage('dashboard');
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentStudio(null);
    setCurrentPage('landing');
  };

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page as PageType);
  };

  // Show login form as overlay
  if (showLogin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1>Welcome to Throw Clay</h1>
            <p className="text-muted-foreground">The all-in-one platform for pottery studios and ceramic artists</p>
          </div>
          <LoginForm onLogin={handleLogin} />
          <div className="text-center mt-4">
            <Button variant="ghost" onClick={() => setShowLogin(false)}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Theme>
      <AppContext.Provider value={{ currentUser, currentStudio, setCurrentUser, setCurrentStudio }}>
        <div className="min-h-screen bg-background">
          {/* Show landing page if no user is logged in */}
          {!currentUser && currentPage === 'landing' && (
            <LandingPage
              onGetStarted={handleGetStarted}
              onLogin={handleShowLogin}
              onPageChange={handlePageChange}
            />
          )}

          {/* Show public pages for non-authenticated users */}
          {!currentUser && currentPage === 'studios' && (
            <div>
              {/* Simple navigation for public pages */}
              <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Palette className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold">Throw Clay</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                      <Button variant="ghost" onClick={() => setCurrentPage('landing')}>Home</Button>
                      <Button variant="ghost" onClick={() => setCurrentPage('studios')}>Find Studios</Button>
                      <Button variant="ghost" onClick={() => setCurrentPage('ceramics')}>Ceramics Marketplace</Button>
                      <Button variant="outline" onClick={handleShowLogin}>Sign In</Button>
                      <Button onClick={handleGetStarted}>Get Started</Button>
                    </div>
                  </div>
                </div>
              </nav>
              <PublicStudiosDirectory />
            </div>
          )}

          {!currentUser && currentPage === 'ceramics' && (
            <div>
              {/* Simple navigation for public pages */}
              <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Palette className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold">Throw Clay</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                      <Button variant="ghost" onClick={() => setCurrentPage('landing')}>Home</Button>
                      <Button variant="ghost" onClick={() => setCurrentPage('studios')}>Find Studios</Button>
                      <Button variant="ghost" onClick={() => setCurrentPage('ceramics')}>Ceramics Marketplace</Button>
                      <Button variant="outline" onClick={handleShowLogin}>Sign In</Button>
                      <Button onClick={handleGetStarted}>Get Started</Button>
                    </div>
                  </div>
                </div>
              </nav>
              <PublicCeramicsMarketplace />
            </div>
          )}

          {/* Show authenticated user content */}
          {currentUser && (
            <>
              <Navigation
                currentUser={currentUser}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onLogout={handleLogout}
              />

              <main>
                {currentPage === 'dashboard' && <StudioDashboard />}
                {currentPage === 'journal' && <PotteryJournal />}
                {currentPage === 'profile' && <ArtistProfile />}
                {currentPage === 'marketplace' && <CommerceMarketplace />}
                {currentPage === 'settings' && <Settings />}
                {currentPage === 'classes' && <ClassesManagement />}
                {currentPage === 'events' && <EventsManagement />}
                {currentPage === 'messages' && <MessagingCenter />}
                {currentPage === 'members' && currentUser.type === 'studio' && <MemberManagement />}
                {currentPage === 'staff' && currentUser.type === 'studio' && <StaffManagement />}
                {/* Only show Find Studios for artists */}
                {currentPage === 'studios' && currentUser.type === 'artist' && <PublicStudiosDirectory />}
                {currentPage === 'ceramics' && <PublicCeramicsMarketplace />}
              </main>
            </>
          )}
        </div>
      </AppContext.Provider>
    </Theme>
  );
}