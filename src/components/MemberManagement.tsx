import { useState } from 'react';
import { Search, Filter, Download, Upload, Plus, Edit, Trash2, MessageCircle, Eye, CheckCircle, X, Mail, Phone, MapPin, Calendar, DollarSign, Settings, Users2, FileText, MoreHorizontal } from 'lucide-react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useAppContext, type StudioMembership, type MembershipApplication, type PaymentInvoice, type User, type StudioLocation } from '../App';

interface MemberData extends User {
  membership: StudioMembership;
  invoices: PaymentInvoice[];
  classHistory: any[];
  eventHistory: any[];
}

export function MemberManagement() {
  const { currentStudio } = useAppContext();
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock member data
  const [members] = useState<MemberData[]>([
    {
      id: 'mem1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      handle: 'sarahj',
      type: 'artist',
      studioId: currentStudio?.id,
      phone: '(503) 555-0101',
      subscription: 'free',
      role: 'member',
      membership: {
        id: 'membership1',
        userId: 'mem1',
        studioId: currentStudio?.id || '',
        locationId: 'loc1',
        membershipType: 'basic',
        status: 'active',
        startDate: '2025-01-15',
        shelfNumber: 'A-12',
        monthlyRate: 85,
        passionProjectsUpgrade: true,
        passionProjectsRate: 5,
        joinedAt: '2025-01-15',
        lastActivity: '2025-06-13'
      },
      invoices: [
        {
          id: 'inv1',
          userId: 'mem1',
          studioId: currentStudio?.id || '',
          type: 'membership',
          amount: 85,
          description: 'Monthly Membership - June 2025',
          dueDate: '2025-06-01',
          paidDate: '2025-06-01',
          status: 'paid'
        },
        {
          id: 'inv2',
          userId: 'mem1',
          studioId: currentStudio?.id || '',
          type: 'passion-projects',
          amount: 5,
          description: 'Passion Projects Upgrade - June 2025',
          dueDate: '2025-06-01',
          paidDate: '2025-06-01',
          status: 'paid'
        }
      ],
      classHistory: [
        { id: 'class1', title: 'Wheel Throwing Basics', status: 'completed', date: '2025-03-15' },
        { id: 'class2', title: 'Glazing Workshop', status: 'enrolled', date: '2025-06-20' }
      ],
      eventHistory: [
        { id: 'event1', title: 'Spring Pottery Sale', status: 'participated', date: '2025-04-12' }
      ]
    },
    {
      id: 'mem2',
      name: 'Mike Rodriguez',
      email: 'mike.r@email.com',
      handle: 'mikerod',
      type: 'artist',
      studioId: currentStudio?.id,
      phone: '(503) 555-0102',
      subscription: 'free',
      role: 'member',
      membership: {
        id: 'membership2',
        userId: 'mem2',
        studioId: currentStudio?.id || '',
        locationId: 'loc2',
        membershipType: 'premium',
        status: 'active',
        startDate: '2025-02-01',
        shelfNumber: 'B-08',
        monthlyRate: 125,
        passionProjectsUpgrade: false,
        passionProjectsRate: 5,
        joinedAt: '2025-02-01',
        lastActivity: '2025-06-12'
      },
      invoices: [
        {
          id: 'inv3',
          userId: 'mem2',
          studioId: currentStudio?.id || '',
          type: 'membership',
          amount: 125,
          description: 'Premium Membership - June 2025',
          dueDate: '2025-06-01',
          status: 'overdue'
        }
      ],
      classHistory: [
        { id: 'class3', title: 'Advanced Throwing', status: 'enrolled', date: '2025-06-15' }
      ],
      eventHistory: []
    }
  ]);

  // Mock pending applications
  const [applications] = useState<MembershipApplication[]>([
    {
      id: 'app1',
      applicantName: 'Emma Thompson',
      applicantEmail: 'emma.t@email.com',
      applicantPhone: '(503) 555-0200',
      studioId: currentStudio?.id || '',
      locationId: 'loc1',
      membershipType: 'basic',
      experience: 'Beginner - took a few classes elsewhere',
      interests: ['Wheel Throwing', 'Glazing'],
      goals: 'Learn pottery as a hobby and stress relief',
      referralSource: 'Google Search',
      emergencyContact: {
        name: 'John Thompson',
        phone: '(503) 555-0201',
        relationship: 'Spouse'
      },
      status: 'pending',
      submittedAt: '2025-06-10',
      customFields: {
        hearAboutUs: 'Friend recommendation',
        preferredClassTime: 'Evenings'
      }
    },
    {
      id: 'app2',
      applicantName: 'David Kim',
      applicantEmail: 'david.kim@email.com',
      applicantPhone: '(503) 555-0203',
      studioId: currentStudio?.id || '',
      locationId: 'loc2',
      membershipType: 'premium',
      experience: 'Intermediate - 2 years experience',
      interests: ['Hand Building', 'Sculpture', 'Raku'],
      goals: 'Develop advanced techniques and sell work',
      referralSource: 'Instagram',
      emergencyContact: {
        name: 'Lisa Kim',
        phone: '(503) 555-0204',
        relationship: 'Sister'
      },
      status: 'pending',
      submittedAt: '2025-06-12',
      customFields: {
        hearAboutUs: 'Social media',
        preferredClassTime: 'Weekends'
      }
    }
  ]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.membership.shelfNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || member.membership.locationId === selectedLocation;
    const matchesStatus = activeTab === 'all' || member.membership.status === activeTab;
    
    return matchesSearch && matchesLocation && matchesStatus;
  });

  const handleMemberSelect = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, memberId]);
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(filteredMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const getLocationName = (locationId?: string) => {
    if (!locationId) return 'Unassigned';
    const location = currentStudio?.locations.find(loc => loc.id === locationId);
    return location?.name || 'Unknown Location';
  };

  const getMembershipStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (invoice: PaymentInvoice) => {
    switch (invoice.status) {
      case 'paid':
        return <Badge variant="default">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{invoice.status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Member Management</h1>
          <p className="text-muted-foreground">
            Manage studio memberships, applications, and member information
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>
                  Create a new studio membership by filling out the member information below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberName">Full Name</Label>
                    <Input id="memberName" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="memberEmail">Email</Label>
                    <Input id="memberEmail" type="email" placeholder="Enter email" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberPhone">Phone</Label>
                    <Input id="memberPhone" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <Label htmlFor="memberLocation">Location</Label>
                    <Select>
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="membershipType">Membership Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic - $85/month</SelectItem>
                        <SelectItem value="premium">Premium - $125/month</SelectItem>
                        <SelectItem value="unlimited">Unlimited - $185/month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="shelfNumber">Shelf Number</Label>
                    <Input id="shelfNumber" placeholder="e.g., A-15" />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Member</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Members</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Applications
              {applications.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {applications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suspended">Suspended</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {currentStudio?.locations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Members */}
        <TabsContent value="active" className="space-y-6">
          {/* Bulk Actions */}
          {selectedMembers.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Bulk Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Change Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Members Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Shelf</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={(checked) => handleMemberSelect(member.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">@{member.handle}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1" />
                            {member.email}
                          </div>
                          {member.phone && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="w-3 h-3 mr-1" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                          {getLocationName(member.membership.locationId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium capitalize">
                            {member.membership.membershipType}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${member.membership.monthlyRate}/month
                          </div>
                          {member.membership.passionProjectsUpgrade && (
                            <Badge variant="secondary" className="text-xs">
                              +Passion Projects
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {member.membership.shelfNumber || 'Unassigned'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getMembershipStatusBadge(member.membership.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {member.membership.lastActivity ? 
                            new Date(member.membership.lastActivity).toLocaleDateString() : 
                            'Never'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              View Invoices
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DollarSign className="w-4 h-4 mr-2" />
                              Payment History
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Applications */}
        <TabsContent value="pending" className="space-y-6">
          <div className="grid gap-6">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{application.applicantName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Applied {new Date(application.submittedAt).toLocaleDateString()} • {application.membershipType} membership
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <Label className="text-xs text-muted-foreground">Contact Information</Label>
                      <div className="space-y-1 mt-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {application.applicantEmail}
                        </div>
                        {application.applicantPhone && (
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1" />
                            {application.applicantPhone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Preferred Location</Label>
                      <div className="mt-1">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          {getLocationName(application.locationId)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Experience Level</Label>
                      <p className="text-sm mt-1">{application.experience}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Emergency Contact</Label>
                      <div className="space-y-1 mt-1">
                        <div className="text-sm">{application.emergencyContact.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {application.emergencyContact.phone} ({application.emergencyContact.relationship})
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Interests</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {application.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Goals</Label>
                      <p className="text-sm mt-1">{application.goals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other status tabs */}
        <TabsContent value="suspended">
          <Card>
            <CardContent className="text-center py-12">
              <Users2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg mb-2">No Suspended Members</h3>
              <p className="text-muted-foreground">
                All members are currently in good standing.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired">
          <Card>
            <CardContent className="text-center py-12">
              <Users2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg mb-2">No Expired Memberships</h3>
              <p className="text-muted-foreground">
                All current memberships are active.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}