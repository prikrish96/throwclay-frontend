import { useState } from 'react';
import { 
  Plus, Search, UserPlus, UserCog, Shield, Clock, AlertTriangle, 
  CheckCircle, Edit, Trash2, MoreHorizontal, Eye, Mail, Key, 
  Calendar, MapPin, Flag, Users, Settings as SettingsIcon,
  FileText, Save, X, ExternalLink, Bell, Phone, Camera,
  CalendarDays, CalendarClock, Upload, Image as ImageIcon,
  GraduationCap, Briefcase, Home, Share2, HeartHandshake,
  Plane, Activity, MessageCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAppContext, type ManagerProfile, type InstructorProfile, type ManagerResponsibility, type WorkLog, type User, type ScheduleEntry, type TimeOffRequest, type EmployeeCredentials } from '../App';

interface EmployeeData extends User {
  managerProfile?: ManagerProfile;
  instructorProfile?: InstructorProfile;
  workLogs: WorkLog[];
  scheduleEntries: ScheduleEntry[];
  timeOffRequests: TimeOffRequest[];
  unfilledResponsibilities: string[];
}

export function EmployeeManagement() {
  const { currentStudio } = useAppContext();
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showResponsibilityDialog, setShowResponsibilityDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock employee data
  const [employees] = useState<EmployeeData[]>([
    {
      id: 'mgr1',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@artisanclay.com',
      handle: 'sarahwilson',
      type: 'artist',
      studioId: currentStudio?.id,
      role: 'manager',
      phone: '(503) 555-0100',
      managerProfile: {
        id: 'profile1',
        userId: 'mgr1',
        studioId: currentStudio?.id || '',
        role: 'co-admin',
        responsibilities: ['resp1', 'resp2', 'resp3'],
        standardWorkHours: {
          monday: { start: '09:00', end: '17:00', isAvailable: true },
          tuesday: { start: '09:00', end: '17:00', isAvailable: true },
          wednesday: { start: '09:00', end: '17:00', isAvailable: true },
          thursday: { start: '09:00', end: '17:00', isAvailable: true },
          friday: { start: '09:00', end: '15:00', isAvailable: true },
          saturday: { start: '10:00', end: '14:00', isAvailable: true },
          sunday: { start: '00:00', end: '00:00', isAvailable: false }
        },
        permissions: {
          manageMembers: true,
          manageClasses: true,
          manageEvents: true,
          manageMessages: true,
          manageInventory: true,
          manageFiring: true,
          manageFinances: false,
          manageSettings: false,
          deleteProfiles: false,
          changeSubscription: false
        },
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b332c35d?w=200&h=200&fit=crop&crop=face',
        phone: '(503) 555-0100',
        maxVacationDays: 15,
        maxSickDays: 10,
        usedVacationDays: 5,
        usedSickDays: 2,
        isActive: true,
        hiredDate: '2024-03-15',
        lastActivity: '2025-06-13',
        notes: 'Excellent with member relations and class coordination'
      },
      workLogs: [],
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
      unfilledResponsibilities: [],
      credentials: {
        id: 'cred1',
        employeeId: 'mgr1',
        username: 'sarah.wilson',
        email: 'sarah.wilson@artisanclay.com',
        requirePasswordChange: false,
        loginAttempts: 0,
        createdAt: '2024-03-15',
        updatedAt: '2025-06-13'
      }
    },
    {
      id: 'mgr2',
      name: 'Mike Chen',
      email: 'mike.chen@artisanclay.com',
      handle: 'mikechen',
      type: 'artist',
      studioId: currentStudio?.id,
      role: 'manager',
      phone: '(503) 555-0101',
      managerProfile: {
        id: 'profile2',
        userId: 'mgr2',
        studioId: currentStudio?.id || '',
        role: 'manager',
        responsibilities: ['resp3'],
        standardWorkHours: {
          monday: { start: '13:00', end: '21:00', isAvailable: true },
          tuesday: { start: '13:00', end: '21:00', isAvailable: true },
          wednesday: { start: '13:00', end: '21:00', isAvailable: true },
          thursday: { start: '13:00', end: '21:00', isAvailable: true },
          friday: { start: '13:00', end: '21:00', isAvailable: true },
          saturday: { start: '12:00', end: '20:00', isAvailable: true },
          sunday: { start: '12:00', end: '18:00', isAvailable: true }
        },
        permissions: {
          manageMembers: false,
          manageClasses: true,
          manageEvents: false,
          manageMessages: false,
          manageInventory: true,
          manageFiring: true,
          manageFinances: false,
          manageSettings: false,
          deleteProfiles: false,
          changeSubscription: false
        },
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        phone: '(503) 555-0101',
        maxVacationDays: 12,
        maxSickDays: 8,
        usedVacationDays: 3,
        usedSickDays: 1,
        isActive: true,
        hiredDate: '2024-05-20',
        lastActivity: '2025-06-12',
        notes: 'Specializes in kiln operations and glazing workshops'
      },
      workLogs: [],
      scheduleEntries: [],
      timeOffRequests: [
        {
          id: 'time1',
          employeeId: 'mgr2',
          startDate: '2025-06-20',
          endDate: '2025-06-22',
          type: 'vacation',
          reason: 'Long weekend getaway',
          status: 'pending',
          requestedAt: '2025-06-10'
        }
      ],
      unfilledResponsibilities: ['resp1', 'resp2']
    }
  ]);

  // Mock instructor data
  const [instructors] = useState<EmployeeData[]>([
    {
      id: 'inst1',
      name: 'Emma Davis',
      email: 'emma.davis@artisanclay.com',
      handle: 'emmadavis',
      type: 'artist',
      studioId: currentStudio?.id,
      role: 'instructor',
      phone: '(503) 555-0102',
      instructorProfile: {
        id: 'inst_profile1',
        userId: 'inst1',
        studioId: currentStudio?.id || '',
        bio: 'Professional ceramics instructor with 10+ years of experience in wheel throwing and glazing techniques.',
        specialties: ['Wheel Throwing', 'Glazing', 'Hand Building', 'Raku'],
        certifications: ['Certified Pottery Instructor', 'Kiln Safety Certification'],
        experience: '10+ years',
        hourlyRate: 45,
        availability: {
          monday: { start: '10:00', end: '18:00', isAvailable: true },
          tuesday: { start: '10:00', end: '18:00', isAvailable: true },
          wednesday: { start: '10:00', end: '18:00', isAvailable: true },
          thursday: { start: '10:00', end: '18:00', isAvailable: true },
          friday: { start: '10:00', end: '16:00', isAvailable: true },
          saturday: { start: '09:00', end: '15:00', isAvailable: true },
          sunday: { start: '00:00', end: '00:00', isAvailable: false }
        },
        assignedClasses: ['class1', 'class3'],
        isActive: true,
        hiredDate: '2024-01-15',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        phone: '(503) 555-0102',
        emergencyContact: {
          name: 'John Davis',
          phone: '(503) 555-0103',
          relationship: 'Spouse'
        },
        notes: 'Excellent with beginners, specializes in traditional techniques'
      },
      workLogs: [],
      scheduleEntries: [
        {
          id: 'sched_inst1',
          employeeId: 'inst1',
          date: '2025-06-14',
          startTime: '10:00',
          endTime: '12:00',
          category: 'classes',
          description: 'Beginner Wheel Throwing Class',
          classId: 'class1',
          locationId: 'loc1',
          status: 'scheduled',
          createdAt: '2025-06-10',
          updatedAt: '2025-06-10'
        }
      ],
      timeOffRequests: [],
      unfilledResponsibilities: [],
      credentials: {
        id: 'cred_inst1',
        employeeId: 'inst1',
        username: 'emma.davis',
        email: 'emma.davis@artisanclay.com',
        requirePasswordChange: false,
        loginAttempts: 0,
        createdAt: '2024-01-15',
        updatedAt: '2025-06-13'
      }
    }
  ]);

  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'manager' as 'co-admin' | 'manager' | 'employee',
    hiredDate: '',
    notes: '',
    responsibilities: [] as string[],
    permissions: {
      manageMembers: false,
      manageClasses: false,
      manageEvents: false,
      manageMessages: false,
      manageInventory: false,
      manageFiring: false,
      manageFinances: false,
      manageSettings: false,
      deleteProfiles: false,
      changeSubscription: false
    },
    maxVacationDays: 15,
    maxSickDays: 10,
    profileImage: ''
  });

  const [instructorForm, setInstructorForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    specialties: [] as string[],
    certifications: [] as string[],
    experience: '',
    hourlyRate: 0,
    hiredDate: '',
    profileImage: '',
    notes: ''
  });

  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    category: 'operations' as ScheduleEntry['category'],
    description: '',
    locationId: '',
    classId: '',
    coveringForId: ''
  });

  const [responsibilityForm, setResponsibilityForm] = useState({
    name: '',
    description: '',
    category: 'custom' as ManagerResponsibility['category'],
    taskCompletionLink: '',
    isRequired: false
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'co-admin':
        return <Badge className="bg-purple-500">Co-Admin</Badge>;
      case 'manager':
        return <Badge variant="default">Manager</Badge>;
      case 'employee':
        return <Badge variant="secondary">Employee</Badge>;
      case 'instructor':
        return <Badge className="bg-blue-500">Instructor</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getCategoryIcon = (category: ScheduleEntry['category']) => {
    switch (category) {
      case 'operations': return <Briefcase className="w-4 h-4" />;
      case 'classes': return <GraduationCap className="w-4 h-4" />;
      case 'social-media': return <Share2 className="w-4 h-4" />;
      case 'covering-shift': return <HeartHandshake className="w-4 h-4" />;
      case 'sick-leave': return <Activity className="w-4 h-4" />;
      case 'vacation': return <Plane className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryBadge = (category: ScheduleEntry['category']) => {
    const colors = {
      'operations': 'bg-blue-500',
      'classes': 'bg-green-500',
      'social-media': 'bg-purple-500',
      'covering-shift': 'bg-yellow-500',
      'sick-leave': 'bg-red-500',
      'vacation': 'bg-orange-500'
    };
    
    return (
      <Badge className={colors[category] || 'bg-gray-500'}>
        {getCategoryIcon(category)}
        <span className="ml-1 capitalize">{category.replace('-', ' ')}</span>
      </Badge>
    );
  };

  const getAvailabilityStatus = (employee: EmployeeData) => {
    const now = new Date();
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()] as 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const daySchedule = employee.managerProfile?.standardWorkHours[currentDay] || 
                       employee.instructorProfile?.availability[currentDay];
    
    if (!daySchedule?.isAvailable) {
      return { status: 'unavailable', text: 'Off Today' };
    }
    
    const startTime = parseInt(daySchedule.start.replace(':', ''));
    const endTime = parseInt(daySchedule.end.replace(':', ''));
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { status: 'available', text: 'Available Now' };
    } else if (currentTime < startTime) {
      return { status: 'upcoming', text: `Available at ${daySchedule.start}` };
    } else {
      return { status: 'finished', text: 'Finished for Today' };
    }
  };

  const openScheduleDialog = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setShowScheduleDialog(true);
  };

  const handleAddScheduleEntry = () => {
    if (!selectedEmployee || !scheduleForm.date || !scheduleForm.startTime || !scheduleForm.endTime) {
      return;
    }

    console.log('Adding schedule entry:', {
      employeeId: selectedEmployee.id,
      ...scheduleForm
    });

    // Reset form
    setScheduleForm({
      date: '',
      startTime: '',
      endTime: '',
      category: 'operations',
      description: '',
      locationId: '',
      classId: '',
      coveringForId: ''
    });
  };

  const handleCreateEmployee = () => {
    console.log('Creating employee:', employeeForm);
    setShowCreateDialog(false);
  };

  const handleCreateInstructor = () => {
    console.log('Creating instructor:', instructorForm);
    setShowCreateDialog(false);
  };

  const coAdminCount = employees.filter(emp => emp.managerProfile?.role === 'co-admin').length;
  const maxCoAdmins = currentStudio?.settings.maxCoAdmins || 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Staff Management</h1>
          <p className="text-muted-foreground">
            Manage employees, instructors, schedules, and responsibilities
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={showResponsibilityDialog} onOpenChange={setShowResponsibilityDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Add Responsibility
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Responsibility</DialogTitle>
                <DialogDescription>
                  Create a custom responsibility that can be assigned to staff members.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="respName">Responsibility Name</Label>
                  <Input
                    id="respName"
                    value={responsibilityForm.name}
                    onChange={(e) => setResponsibilityForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Manage Social Media"
                  />
                </div>
                <div>
                  <Label htmlFor="respDescription">Description</Label>
                  <Textarea
                    id="respDescription"
                    value={responsibilityForm.description}
                    onChange={(e) => setResponsibilityForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the tasks and expectations..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowResponsibilityDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    console.log('Creating responsibility:', responsibilityForm);
                    setShowResponsibilityDialog(false);
                  }}>
                    <Save className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Create a new employee or instructor profile.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="employee" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="employee">Employee</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                </TabsList>

                <TabsContent value="employee" className="space-y-6">
                  {/* Employee Form */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={employeeForm.profileImage} />
                          <AvatarFallback>
                            <Camera className="w-8 h-8 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2">
                          <Upload className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Label>Profile Picture</Label>
                        <Input
                          type="url"
                          placeholder="Image URL"
                          value={employeeForm.profileImage}
                          onChange={(e) => setEmployeeForm(prev => ({ ...prev, profileImage: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={employeeForm.name}
                          onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={employeeForm.email}
                          onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEmployee}>
                      <Save className="w-4 h-4 mr-2" />
                      Create Employee
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="instructor" className="space-y-6">
                  {/* Instructor Form */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={instructorForm.profileImage} />
                          <AvatarFallback>
                            <Camera className="w-8 h-8 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2">
                          <Upload className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Label>Profile Picture</Label>
                        <Input
                          type="url"
                          placeholder="Image URL"
                          value={instructorForm.profileImage}
                          onChange={(e) => setInstructorForm(prev => ({ ...prev, profileImage: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={instructorForm.name}
                          onChange={(e) => setInstructorForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={instructorForm.email}
                          onChange={(e) => setInstructorForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Bio</Label>
                      <Textarea
                        value={instructorForm.bio}
                        onChange={(e) => setInstructorForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Brief bio and teaching philosophy..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateInstructor}>
                      <Save className="w-4 h-4 mr-2" />
                      Create Instructor
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="employees">
              Employees
              <Badge variant="secondary" className="ml-2">
                {employees.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="instructors">
              Instructors
              <Badge variant="secondary" className="ml-2">
                {instructors.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="schedule">Schedule Overview</TabsTrigger>
            <TabsTrigger value="time-off">Time Off Requests</TabsTrigger>
          </TabsList>

          {/* Search */}
          {(activeTab === 'employees' || activeTab === 'instructors') && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}
        </div>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => {
              const availability = getAvailabilityStatus(employee);
              const profile = employee.managerProfile;
              
              return (
                <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={profile?.profileImage} />
                          <AvatarFallback>
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{employee.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">@{employee.handle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleBadge(profile?.role || 'employee')}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openScheduleDialog(employee)}>
                              <Calendar className="w-4 h-4 mr-2" />
                              Manage Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="w-4 h-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Employee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{employee.email}</span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{employee.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Availability</span>
                      </div>
                      <Badge 
                        variant={availability.status === 'available' ? 'default' : 'secondary'}
                        className={availability.status === 'available' ? 'bg-green-500' : ''}
                      >
                        {availability.text}
                      </Badge>
                    </div>

                    {/* Time Off Summary */}
                    {profile && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-muted/50 rounded text-center">
                          <div className="font-medium">Vacation</div>
                          <div className="text-muted-foreground">
                            {profile.usedVacationDays}/{profile.maxVacationDays}
                          </div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded text-center">
                          <div className="font-medium">Sick Days</div>
                          <div className="text-muted-foreground">
                            {profile.usedSickDays}/{profile.maxSickDays}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Instructors Tab */}
        <TabsContent value="instructors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map((instructor) => {
              const availability = getAvailabilityStatus(instructor);
              const profile = instructor.instructorProfile;
              
              return (
                <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={profile?.profileImage} />
                          <AvatarFallback>
                            {instructor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{instructor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">@{instructor.handle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleBadge('instructor')}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <GraduationCap className="w-4 h-4 mr-2" />
                              Manage Classes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openScheduleDialog(instructor)}>
                              <Calendar className="w-4 h-4 mr-2" />
                              Manage Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="w-4 h-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Instructor
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Bio */}
                    {profile?.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {profile.bio}
                      </p>
                    )}

                    {/* Specialties */}
                    <div>
                      <Label className="text-sm">Specialties</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile?.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Assigned Classes */}
                    <div>
                      <Label className="text-sm">Assigned Classes</Label>
                      <div className="text-sm text-muted-foreground">
                        {profile?.assignedClasses.length || 0} classes
                      </div>
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Availability</span>
                      </div>
                      <Badge 
                        variant={availability.status === 'available' ? 'default' : 'secondary'}
                        className={availability.status === 'available' ? 'bg-green-500' : ''}
                      >
                        {availability.text}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Schedule Overview Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...employees, ...instructors]
                    .filter(person => person.scheduleEntries.some(entry => entry.date === '2025-06-14'))
                    .map((person) => {
                      const todayEntries = person.scheduleEntries.filter(entry => entry.date === '2025-06-14');
                      return todayEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={person.managerProfile?.profileImage || person.instructorProfile?.profileImage} />
                              <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{person.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {entry.startTime} - {entry.endTime}
                              </p>
                            </div>
                          </div>
                          {getCategoryBadge(entry.category)}
                        </div>
                      ));
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded">
                    <div className="text-2xl font-bold">{employees.length}</div>
                    <div className="text-sm text-muted-foreground">Employees</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded">
                    <div className="text-2xl font-bold">{instructors.length}</div>
                    <div className="text-sm text-muted-foreground">Instructors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Time Off Requests Tab */}
        <TabsContent value="time-off" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Time Off Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...employees, ...instructors]
                    .filter(person => person.timeOffRequests.length > 0)
                    .flatMap(person => 
                      person.timeOffRequests.map(request => ({
                        ...request,
                        employeeName: person.name,
                        employeeImage: person.managerProfile?.profileImage || person.instructorProfile?.profileImage
                      }))
                    )
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={request.employeeImage} />
                              <AvatarFallback>{request.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span>{request.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {request.type.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.startDate} - {request.endDate}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {request.reason || 'No reason provided'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={request.status === 'approved' ? 'default' : 
                                   request.status === 'denied' ? 'destructive' : 'secondary'}
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                <X className="w-4 h-4 mr-1" />
                                Deny
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Schedule - {selectedEmployee?.name}</DialogTitle>
            <DialogDescription>
              Add hours, set standard schedule, and manage time off for this staff member.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="add-hours" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add-hours">Add Hours</TabsTrigger>
              <TabsTrigger value="standard-hours">Standard Hours</TabsTrigger>
              <TabsTrigger value="time-off">Time Off</TabsTrigger>
            </TabsList>

            <TabsContent value="add-hours" className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        {selectedDate ? selectedDate.toLocaleDateString() : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={scheduleForm.endTime}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={scheduleForm.category} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, category: value as ScheduleEntry['category'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="classes">Classes</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="covering-shift">Covering Someone's Shift</SelectItem>
                    <SelectItem value="sick-leave">Sick Leave</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={scheduleForm.description}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of work or reason for time off..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddScheduleEntry}>
                  <Save className="w-4 h-4 mr-2" />
                  Add Schedule Entry
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="standard-hours" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Set Standard Working Hours</h4>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const dayKey = day.toLowerCase() as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
                  const currentHours = selectedEmployee?.managerProfile?.standardWorkHours[dayKey] ||
                                     selectedEmployee?.instructorProfile?.availability[dayKey];
                  
                  return (
                    <div key={day} className="flex items-center space-x-4 p-3 border rounded">
                      <div className="w-20">
                        <Switch checked={currentHours?.isAvailable || false} />
                      </div>
                      <div className="flex-1 font-medium">{day}</div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={currentHours?.start || '09:00'}
                          className="w-24"
                          disabled={!currentHours?.isAvailable}
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={currentHours?.end || '17:00'}
                          className="w-24"
                          disabled={!currentHours?.isAvailable}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="time-off" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Request Time Off</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="sick-leave">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reason (Optional)</Label>
                  <Textarea placeholder="Reason for time off..." rows={3} />
                </div>
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Submit Time Off Request
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Public Staff Directory for Members */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Studio Staff Directory</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Available staff members for member assistance and questions.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...employees.filter(emp => emp.managerProfile?.isActive), 
              ...instructors.filter(inst => inst.instructorProfile?.isActive)]
              .map((person) => {
                const availability = getAvailabilityStatus(person);
                const profile = person.managerProfile || person.instructorProfile;
                const isInstructor = !!person.instructorProfile;
                
                return (
                  <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={profile?.profileImage} />
                        <AvatarFallback>
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {isInstructor ? 'Instructor' : (person.managerProfile?.role.replace('-', ' ') || 'Staff')}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleBadge(isInstructor ? 'instructor' : person.managerProfile?.role || 'employee')}
                          <Badge 
                            variant="outline"
                            className={`text-xs ${availability.status === 'available' ? 'border-green-500 text-green-700' : ''}`}
                          >
                            {availability.text}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}