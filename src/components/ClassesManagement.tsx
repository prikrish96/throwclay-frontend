import { useState } from 'react';
import { 
  Plus, Search, Filter, Calendar, Clock, Users, MapPin, DollarSign, 
  Settings, Edit, Trash2, Eye, MessageCircle, CheckSquare, X, 
  Upload, Camera, Tag, Mail, Bell, MoreHorizontal, CalendarOff,
  UserMinus, AlertTriangle, Pause, Play, Copy
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
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAppContext, type Class, type DiscountCode, type ClassMaterial, type ClassAttendance, type ClassHoliday } from '../App';

export function ClassesManagement() {
  const { currentStudio } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showManageDialog, setShowManageDialog] = useState(false);

  // Mock classes data
  const [classes] = useState<Class[]>([
    {
      id: 'class1',
      title: 'Beginner Wheel Throwing',
      description: 'Learn the fundamentals of pottery wheel throwing in this comprehensive 8-week course. Perfect for complete beginners who want to master the basics.',
      instructorId: 'instructor1',
      instructorName: 'Sarah Wilson',
      type: 'beginner',
      duration: 2,
      maxStudents: 12,
      currentStudents: ['student1', 'student2', 'student3', 'student4'],
      waitlist: ['student5'],
      schedule: {
        startDate: '2025-07-01',
        endDate: '2025-08-26',
        startTime: '18:00',
        endTime: '20:00',
        daysOfWeek: [2, 4], // Tuesday, Thursday
        sessions: 16,
        sessionDuration: 2
      },
      pricing: {
        memberPrice: 240,
        nonMemberPrice: 320,
        groupDiscount: {
          minStudents: 8,
          discountType: 'percentage',
          discountValue: 10
        },
        materials: 'additional',
        materialsPrice: 45
      },
      discountCodes: [
        {
          id: 'disc1',
          code: 'NEWBIE20',
          discountType: 'percentage',
          discountValue: 20,
          maxUses: 50,
          currentUses: 12,
          expiresAt: '2025-06-30',
          isActive: true,
          createdAt: '2025-06-01'
        }
      ],
      materials: [
        {
          id: 'mat1',
          name: 'Pottery Clay (25 lbs)',
          description: 'High-quality stoneware clay perfect for wheel throwing',
          price: 25,
          isRequired: true,
          category: 'clay'
        },
        {
          id: 'mat2',
          name: 'Basic Tool Set',
          description: 'Essential pottery tools including ribs, wire, and trimming tools',
          price: 35,
          isRequired: true,
          productLink: 'https://pottery-supply.com/basic-tools',
          category: 'tools'
        }
      ],
      images: {
        cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1594736797933-d0401ba6fe65?w=400&h=300&fit=crop'
        ]
      },
      requirements: ['No prior experience needed', 'Comfortable clothing that can get dirty'],
      whatToExpect: ['Learn centering techniques', 'Create bowls and cylinders', 'Basic trimming skills'],
      enrollmentEmail: {
        subject: 'Welcome to Beginner Wheel Throwing!',
        content: 'Thank you for enrolling in our beginner pottery class. We\'re excited to have you join us on this creative journey.',
        includeAppInstructions: true
      },
      chatGroupId: 'chat1',
      chatEnabled: true,
      isPublic: true,
      status: 'published',
      locationId: 'loc1',
      holidays: [],
      attendance: [],
      createdAt: '2025-06-01',
      updatedAt: '2025-06-10'
    },
    {
      id: 'class2',
      title: 'Advanced Glazing Workshop',
      description: 'Explore advanced glazing techniques including layering, wax resist, and crystalline glazes.',
      instructorId: 'instructor2',
      instructorName: 'Mike Chen',
      type: 'advanced',
      duration: 4,
      maxStudents: 8,
      currentStudents: ['student6', 'student7'],
      waitlist: [],
      schedule: {
        startDate: '2025-07-15',
        endDate: '2025-07-15',
        startTime: '10:00',
        endTime: '14:00',
        daysOfWeek: [6], // Saturday
        sessions: 1,
        sessionDuration: 4
      },
      pricing: {
        memberPrice: 85,
        nonMemberPrice: 110,
        materials: 'included'
      },
      discountCodes: [],
      materials: [],
      images: {
        cover: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=600&h=400&fit=crop',
        gallery: []
      },
      requirements: ['Previous pottery experience required', 'Bisque-fired pieces to glaze'],
      whatToExpect: ['Advanced glazing techniques', 'Color theory', 'Surface decoration'],
      enrollmentEmail: {
        subject: 'Advanced Glazing Workshop - Preparation Info',
        content: 'Welcome to our advanced glazing workshop! Please bring 3-5 bisque-fired pieces ready for glazing.',
        includeAppInstructions: false
      },
      chatEnabled: false,
      isPublic: true,
      status: 'published',
      locationId: 'loc1',
      holidays: [],
      attendance: [],
      createdAt: '2025-06-05',
      updatedAt: '2025-06-08'
    }
  ]);

  // Form state for creating/editing classes
  const [classForm, setClassForm] = useState({
    title: '',
    description: '',
    instructorId: '',
    type: 'beginner' as Class['type'],
    maxStudents: 12,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [] as number[],
    sessions: 1,
    memberPrice: 0,
    nonMemberPrice: 0,
    materialsIncluded: true,
    materialsPrice: 0,
    locationId: '',
    isPublic: true,
    chatEnabled: true,
    enrollmentSubject: '',
    enrollmentContent: '',
    includeAppInstructions: true
  });

  const [discountCodes, setDiscountCodes] = useState<Partial<DiscountCode>[]>([]);
  const [materials, setMaterials] = useState<Partial<ClassMaterial>[]>([]);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || cls.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: Class['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'published':
        return <Badge variant="default">Published</Badge>;
      case 'full':
        return <Badge variant="outline">Full</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLocationName = (locationId?: string) => {
    if (!locationId) return 'All Locations';
    const location = currentStudio?.locations.find(loc => loc.id === locationId);
    return location?.name || 'Unknown Location';
  };

  const addDiscountCode = () => {
    if (discountCodes.length < 3) {
      setDiscountCodes([...discountCodes, {
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        maxUses: 100,
        currentUses: 0,
        isActive: true
      }]);
    }
  };

  const removeDiscountCode = (index: number) => {
    setDiscountCodes(discountCodes.filter((_, i) => i !== index));
  };

  const addMaterial = () => {
    setMaterials([...materials, {
      name: '',
      description: '',
      price: 0,
      isRequired: true,
      category: 'clay'
    }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleCreateClass = () => {
    // Implementation for creating a new class
    console.log('Creating class:', classForm, discountCodes, materials);
    setShowCreateDialog(false);
    // Reset form
    setClassForm({
      title: '',
      description: '',
      instructorId: '',
      type: 'beginner',
      maxStudents: 12,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      daysOfWeek: [],
      sessions: 1,
      memberPrice: 0,
      nonMemberPrice: 0,
      materialsIncluded: true,
      materialsPrice: 0,
      locationId: '',
      isPublic: true,
      chatEnabled: true,
      enrollmentSubject: '',
      enrollmentContent: '',
      includeAppInstructions: true
    });
    setDiscountCodes([]);
    setMaterials([]);
  };

  const openManageDialog = (cls: Class) => {
    setSelectedClass(cls);
    setShowManageDialog(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Classes Management</h1>
          <p className="text-muted-foreground">
            Create and manage pottery classes, workshops, and courses
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Set up a new pottery class or workshop with all the details students need to know.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        value={classForm.title}
                        onChange={(e) => setClassForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Beginner Wheel Throwing"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={classForm.description}
                        onChange={(e) => setClassForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what students will learn..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor">Instructor</Label>
                      <Select value={classForm.instructorId} onValueChange={(value) => setClassForm(prev => ({ ...prev, instructorId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select instructor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instructor1">Sarah Wilson</SelectItem>
                          <SelectItem value="instructor2">Mike Chen</SelectItem>
                          <SelectItem value="instructor3">Emma Davis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Course Level</Label>
                      <Select value={classForm.type} onValueChange={(value) => setClassForm(prev => ({ ...prev, type: value as Class['type'] }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="masterclass">Masterclass</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maxStudents">Max Students</Label>
                      <Input
                        id="maxStudents"
                        type="number"
                        value={classForm.maxStudents}
                        onChange={(e) => setClassForm(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Select value={classForm.locationId} onValueChange={(value) => setClassForm(prev => ({ ...prev, locationId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentStudio?.locations.map(location => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Schedule */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Schedule</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={classForm.startDate}
                        onChange={(e) => setClassForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={classForm.endDate}
                        onChange={(e) => setClassForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={classForm.startTime}
                        onChange={(e) => setClassForm(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={classForm.endTime}
                        onChange={(e) => setClassForm(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessions">Number of Sessions</Label>
                      <Input
                        id="sessions"
                        type="number"
                        value={classForm.sessions}
                        onChange={(e) => setClassForm(prev => ({ ...prev, sessions: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div>
                      <Label>Days of Week</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`day-${index}`}
                              checked={classForm.daysOfWeek.includes(index)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setClassForm(prev => ({ ...prev, daysOfWeek: [...prev.daysOfWeek, index] }));
                                } else {
                                  setClassForm(prev => ({ ...prev, daysOfWeek: prev.daysOfWeek.filter(d => d !== index) }));
                                }
                              }}
                            />
                            <Label htmlFor={`day-${index}`} className="text-sm">{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Pricing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="memberPrice">Member Price</Label>
                      <Input
                        id="memberPrice"
                        type="number"
                        value={classForm.memberPrice}
                        onChange={(e) => setClassForm(prev => ({ ...prev, memberPrice: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nonMemberPrice">Non-Member Price</Label>
                      <Input
                        id="nonMemberPrice"
                        type="number"
                        value={classForm.nonMemberPrice}
                        onChange={(e) => setClassForm(prev => ({ ...prev, nonMemberPrice: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="materialsIncluded"
                        checked={classForm.materialsIncluded}
                        onCheckedChange={(checked) => setClassForm(prev => ({ ...prev, materialsIncluded: checked }))}
                      />
                      <Label htmlFor="materialsIncluded">Materials Included in Price</Label>
                    </div>
                    {!classForm.materialsIncluded && (
                      <div className="mt-2">
                        <Label htmlFor="materialsPrice">Materials Price</Label>
                        <Input
                          id="materialsPrice"
                          type="number"
                          value={classForm.materialsPrice}
                          onChange={(e) => setClassForm(prev => ({ ...prev, materialsPrice: parseFloat(e.target.value) || 0 }))}
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Discount Codes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Discount Codes</h3>
                    <Button variant="outline" size="sm" onClick={addDiscountCode} disabled={discountCodes.length >= 3}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Code
                    </Button>
                  </div>
                  {discountCodes.map((code, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        placeholder="Code (e.g., SAVE20)"
                        value={code.code || ''}
                        onChange={(e) => {
                          const updated = [...discountCodes];
                          updated[index] = { ...updated[index], code: e.target.value };
                          setDiscountCodes(updated);
                        }}
                      />
                      <Select value={code.discountType} onValueChange={(value) => {
                        const updated = [...discountCodes];
                        updated[index] = { ...updated[index], discountType: value as 'percentage' | 'fixed' };
                        setDiscountCodes(updated);
                      }}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="fixed">$</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Value"
                        className="w-20"
                        value={code.discountValue || ''}
                        onChange={(e) => {
                          const updated = [...discountCodes];
                          updated[index] = { ...updated[index], discountValue: parseFloat(e.target.value) || 0 };
                          setDiscountCodes(updated);
                        }}
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeDiscountCode(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Materials */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Materials to Purchase</h3>
                    <Button variant="outline" size="sm" onClick={addMaterial}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Material
                    </Button>
                  </div>
                  {materials.map((material, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Material Name</Label>
                          <Input
                            value={material.name || ''}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[index] = { ...updated[index], name: e.target.value };
                              setMaterials(updated);
                            }}
                            placeholder="e.g., Pottery Clay"
                          />
                        </div>
                        <div>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            value={material.price || ''}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[index] = { ...updated[index], price: parseFloat(e.target.value) || 0 };
                              setMaterials(updated);
                            }}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Description</Label>
                          <Input
                            value={material.description || ''}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[index] = { ...updated[index], description: e.target.value };
                              setMaterials(updated);
                            }}
                            placeholder="Brief description"
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select value={material.category} onValueChange={(value) => {
                            const updated = [...materials];
                            updated[index] = { ...updated[index], category: value as ClassMaterial['category'] };
                            setMaterials(updated);
                          }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clay">Clay</SelectItem>
                              <SelectItem value="tools">Tools</SelectItem>
                              <SelectItem value="glazes">Glazes</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={material.isRequired || false}
                              onCheckedChange={(checked) => {
                                const updated = [...materials];
                                updated[index] = { ...updated[index], isRequired: checked };
                                setMaterials(updated);
                              }}
                            />
                            <Label>Required</Label>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeMaterial(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="col-span-2">
                          <Label>Product Link (Optional)</Label>
                          <Input
                            value={material.productLink || ''}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[index] = { ...updated[index], productLink: e.target.value };
                              setMaterials(updated);
                            }}
                            placeholder="https://supplier.com/product"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Images */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cover Image</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload cover image</p>
                        <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
                      </div>
                    </div>
                    <div>
                      <Label>Gallery Images</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload gallery images</p>
                        <Button variant="outline" size="sm" className="mt-2">Choose Files</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Enrollment Email */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Enrollment Email</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="enrollmentSubject">Email Subject</Label>
                      <Input
                        id="enrollmentSubject"
                        value={classForm.enrollmentSubject}
                        onChange={(e) => setClassForm(prev => ({ ...prev, enrollmentSubject: e.target.value }))}
                        placeholder="Welcome to [Class Name]!"
                      />
                    </div>
                    <div>
                      <Label htmlFor="enrollmentContent">Email Content</Label>
                      <Textarea
                        id="enrollmentContent"
                        value={classForm.enrollmentContent}
                        onChange={(e) => setClassForm(prev => ({ ...prev, enrollmentContent: e.target.value }))}
                        placeholder="Thank you for enrolling..."
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="includeAppInstructions"
                        checked={classForm.includeAppInstructions}
                        onCheckedChange={(checked) => setClassForm(prev => ({ ...prev, includeAppInstructions: checked }))}
                      />
                      <Label htmlFor="includeAppInstructions">Include app/website signup instructions</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Settings */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Class Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublic"
                        checked={classForm.isPublic}
                        onCheckedChange={(checked) => setClassForm(prev => ({ ...prev, isPublic: checked }))}
                      />
                      <Label htmlFor="isPublic">Make class publicly visible</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="chatEnabled"
                        checked={classForm.chatEnabled}
                        onCheckedChange={(checked) => setClassForm(prev => ({ ...prev, chatEnabled: checked }))}
                      />
                      <Label htmlFor="chatEnabled">Create class chat group (24-48hrs before start)</Label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={handleCreateClass}>
                    Save as Draft
                  </Button>
                  <Button onClick={handleCreateClass}>
                    Publish Class
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <Card key={cls.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <ImageWithFallback
                    src={cls.images.cover || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop'}
                    alt={cls.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(cls.status)}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{cls.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openManageDialog(cls)}>
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Class
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Class Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="w-4 h-4 mr-2" />
                          Send Announcement
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {cls.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Instructor:</span>
                      <span>{cls.instructorName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Students:</span>
                      <span>{cls.currentStudents.length}/{cls.maxStudents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{getLocationName(cls.locationId)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span>${cls.pricing.memberPrice}/${cls.pricing.nonMemberPrice}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(cls.schedule.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{cls.schedule.startTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Manage Class Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Class: {selectedClass?.title}</DialogTitle>
            <DialogDescription>
              Manage enrollments, attendance, schedule changes, and class settings.
            </DialogDescription>
          </DialogHeader>
          
          {selectedClass && (
            <Tabs defaultValue="enrollments" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Enrollments Tab */}
              <TabsContent value="enrollments" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">Current Enrollments</h4>
                  <div className="text-sm text-muted-foreground">
                    {selectedClass.currentStudents.length}/{selectedClass.maxStudents} enrolled
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Member Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClass.currentStudents.map((studentId, index) => (
                      <TableRow key={studentId}>
                        <TableCell>Student {index + 1}</TableCell>
                        <TableCell>student{index + 1}@email.com</TableCell>
                        <TableCell>
                          <Badge variant="default">Member</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Paid</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <UserMinus className="w-4 h-4 mr-2" />
                                Remove from Class
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">Attendance Tracking</h4>
                  <Button size="sm">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Mark Today's Attendance
                  </Button>
                </div>
                
                <div className="text-center py-8 text-muted-foreground">
                  <CheckSquare className="w-12 h-12 mx-auto mb-4" />
                  <p>No attendance records yet.</p>
                  <p className="text-sm">Start tracking when your first class session begins.</p>
                </div>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">Schedule Management</h4>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <CalendarOff className="w-4 h-4 mr-2" />
                      Mark Holiday
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-2" />
                          Cancel Class
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Class</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this class? All enrolled students will be notified.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            Cancel Class
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Current Instructor</Label>
                        <div className="flex items-center justify-between">
                          <span>{selectedClass.instructorName}</span>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Schedule</Label>
                        <p>
                          {selectedClass.schedule.startDate} - {selectedClass.schedule.endDate}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedClass.schedule.startTime} - {selectedClass.schedule.endTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4">Class Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Chat Group</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically create chat group for enrolled students
                          </p>
                        </div>
                        <Switch checked={selectedClass.chatEnabled} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Public Visibility</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow public enrollment for this class
                          </p>
                        </div>
                        <Switch checked={selectedClass.isPublic} />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-lg font-medium mb-4">Notifications</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Send Class Reminder
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Custom Message
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}