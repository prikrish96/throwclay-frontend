import { useState } from 'react';
import { Calendar, Clock, Thermometer, Users, Flame, MessageCircle, Camera, MapPin, Activity, TrendingUp, AlertTriangle, CheckCircle, Star, Bell, Eye, MessageSquare, UserCheck, Palette, Droplets, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAppContext } from '../App';

export function StudioDashboard() {
  const { currentUser, currentStudio } = useAppContext();
  const [selectedCamera, setSelectedCamera] = useState('cam1');

  const isStudioOwner = currentUser?.type === 'studio';
  const isStudioMember = currentUser?.type === 'artist' && currentUser?.studioId;

  // Mock staff data for artist dashboard
  const mockStaffMembers = [
    {
      id: 'staff1',
      name: 'Sarah Wilson',
      role: 'Co-Admin',
      specialties: ['Member Relations', 'Class Coordination'],
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b332c35d?w=200&h=200&fit=crop&crop=face',
      availability: { status: 'available', text: 'Available Now' },
      isOnline: true
    },
    {
      id: 'staff2',
      name: 'Mike Chen',
      role: 'Manager',
      specialties: ['Kiln Operations', 'Glazing'],
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      availability: { status: 'upcoming', text: 'Available at 1:00 PM' },
      isOnline: false
    },
    {
      id: 'staff3',
      name: 'Emma Davis',
      role: 'Instructor',
      specialties: ['Wheel Throwing', 'Hand Building'],
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      availability: { status: 'available', text: 'Available Now' },
      isOnline: true
    }
  ];

  const getQuickStats = () => {
    if (isStudioOwner) {
      return [
        { title: 'Active Members', value: '127', icon: Users, trend: '+12%' },
        { title: 'Classes This Week', value: '24', icon: Calendar, trend: '+5%' },
        { title: 'Revenue This Month', value: '$8,450', icon: TrendingUp, trend: '+18%' },
        { title: 'Kiln Utilization', value: '78%', icon: Flame, trend: '+3%' }
      ];
    } else {
      return [
        { title: 'My Projects', value: '8', icon: Palette, trend: '+2 this week' },
        { title: 'Throws Completed', value: '34', icon: Activity, trend: '+6 this month' },
        { title: 'Classes Enrolled', value: '3', icon: Calendar, trend: '1 starting soon' },
        { title: 'Pieces Fired', value: '12', icon: Flame, trend: '2 in kiln now' }
      ];
    }
  };

  const getQuickActions = () => {
    if (isStudioOwner) {
      return [
        { label: 'Add New Member', icon: Users },
        { label: 'Schedule Firing', icon: Flame },
        { label: 'Create Class', icon: Calendar },
        { label: 'Send Announcement', icon: Bell }
      ];
    } else {
      return [
        { label: 'Book Kiln Time', icon: Flame },
        { label: 'Join Class Chat', icon: MessageSquare },
        { label: 'View My Shelf', icon: MapPin },
        { label: 'Contact Staff', icon: MessageCircle }
      ];
    }
  };

  const quickStats = getQuickStats();
  const quickActions = getQuickActions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1>
          {isStudioOwner 
            ? `${currentStudio?.name} Dashboard` 
            : `Welcome back, ${currentUser?.name}`
          }
        </h1>
        <p className="text-muted-foreground">
          {isStudioOwner 
            ? 'Monitor your studio operations and manage your team'
            : 'Track your pottery journey and stay connected with your studio'
          }
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.trend}</p>
                  </div>
                  <Icon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Studio Staff (For Artists) */}
          {isStudioMember && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>Studio Staff Available</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Get help from our available staff members
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStaffMembers.map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={staff.profileImage} />
                            <AvatarFallback>
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {staff.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{staff.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {staff.role}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className={`text-xs ${staff.availability.status === 'available' ? 'border-green-500 text-green-700' : 'border-yellow-500 text-yellow-700'}`}
                            >
                              {staff.availability.text}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-sm text-muted-foreground">Specializes in:</span>
                            {staff.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant={staff.availability.status === 'available' ? 'default' : 'outline'}
                          disabled={staff.availability.status !== 'available'}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {staff.availability.status === 'available' ? 'Message Now' : 'Message Later'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Need help with something specific? Our staff is here to assist with classes, kiln schedules, glazing, and more!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Firing Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Flame className="w-5 h-5" />
                <span>
                  {isStudioOwner ? 'Firing Schedule' : 'Upcoming Firings'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentStudio?.firingSchedule.map((firing) => (
                  <div key={firing.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                        <Thermometer className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{firing.type} Firing</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(firing.date).toLocaleDateString()} • {firing.temperature}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {firing.bookedSlots}/{firing.capacity} slots filled
                          </span>
                          <Progress 
                            value={(firing.bookedSlots / firing.capacity) * 100} 
                            className="w-20 h-2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={firing.status === 'scheduled' ? 'default' : 'secondary'}
                      >
                        {firing.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {firing.startTime} - {firing.endTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Studio Cameras */}
          {currentStudio?.cameras && currentStudio.cameras.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Studio Monitoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCamera} onValueChange={setSelectedCamera}>
                  <TabsList className="grid w-full grid-cols-2">
                    {currentStudio.cameras.map((camera) => (
                      <TabsTrigger key={camera.id} value={camera.id}>
                        {camera.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {currentStudio.cameras.map((camera) => (
                    <TabsContent key={camera.id} value={camera.id}>
                      <div className="space-y-4">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {camera.name} Feed
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {camera.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={camera.isActive ? 'default' : 'secondary'}>
                              {camera.isActive ? 'Live' : 'Offline'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {camera.type === 'ring' ? 'Ring Camera' : 'Camera'}
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Screen
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    icon: Users,
                    text: isStudioOwner ? 'New member application received' : 'Class enrollment confirmed',
                    time: '2 hours ago',
                    color: 'text-blue-600'
                  },
                  {
                    icon: Flame,
                    text: isStudioOwner ? 'Bisque firing completed' : 'Your pieces are ready for glazing',
                    time: '4 hours ago',
                    color: 'text-orange-600'
                  },
                  {
                    icon: MessageSquare,
                    text: isStudioOwner ? 'Class chat group created' : 'New message in class group',
                    time: '6 hours ago',
                    color: 'text-green-600'
                  },
                  {
                    icon: Calendar,
                    text: isStudioOwner ? 'Workshop scheduled for next week' : 'Reminder: Class tomorrow at 2 PM',
                    time: '1 day ago',
                    color: 'text-purple-600'
                  }
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button key={index} variant="outline" className="w-full justify-start">
                    <Icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Studio Locations */}
          {currentStudio?.locations && currentStudio.locations.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Studio Locations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentStudio.locations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{location.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {location.city}, {location.state}
                        </p>
                      </div>
                      <Badge variant={location.isActive ? 'default' : 'secondary'}>
                        {location.isActive ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}