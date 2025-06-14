import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Palette, Camera, CreditCard, Shield, Building2, Paintbrush, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useAppContext } from '../App';

export function Settings() {
  const { currentUser, currentStudio } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');

  // Settings state
  const [profileSettings, setProfileSettings] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    handle: currentUser?.handle || '',
    bio: currentUser?.profile?.bio || '',
    website: currentUser?.profile?.socialMedia?.website || '',
    instagram: currentUser?.profile?.socialMedia?.instagram || '',
    facebook: currentUser?.profile?.socialMedia?.facebook || '',
    twitter: currentUser?.profile?.socialMedia?.twitter || ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      classReminders: true,
      firingNotifications: true,
      messages: true,
      announcements: true,
      salesUpdates: true,
      marketplaceActivity: false,
      weeklyDigest: true
    },
    push: {
      classReminders: true,
      firingNotifications: true,
      messages: true,
      announcements: true,
      salesUpdates: false,
      marketplaceActivity: false
    },
    sms: {
      urgentOnly: true,
      classReminders: false,
      firingNotifications: true
    }
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showInDirectory: true,
    dataSharing: false
  });

  const [studioSettings, setStudioSettings] = useState({
    commissionRate: currentStudio?.commissionRate || 15,
    allowPublicClasses: currentStudio?.settings?.allowPublicClasses || true,
    requireApprovalForSales: currentStudio?.settings?.requireApprovalForSales || false,
    enableMessaging: currentStudio?.settings?.enableMessaging || true,
    enableAnnouncements: currentStudio?.settings?.enableAnnouncements || true,
    publicProfile: true,
    bookingApproval: 'automatic'
  });

  const colorPalettes = [
    { name: 'earthy', label: 'Earthy Tones', colors: ['#8B4513', '#D2B48C', '#CD853F'] },
    { name: 'ocean', label: 'Ocean Blues', colors: ['#2E8B87', '#40E0D0', '#B0E0E6'] },
    { name: 'forest', label: 'Forest Greens', colors: ['#228B22', '#90EE90', '#98FB98'] },
    { name: 'sunset', label: 'Sunset Warm', colors: ['#FF6347', '#FFA500', '#FFD700'] },
    { name: 'lavender', label: 'Lavender Fields', colors: ['#9370DB', '#DDA0DD', '#E6E6FA'] },
    { name: 'monochrome', label: 'Monochrome', colors: ['#000000', '#808080', '#FFFFFF'] }
  ];

  const getSubscriptionTiers = () => {
    const baseSubscriptions = [
      {
        name: 'Free',
        price: '$0',
        period: 'forever',
        features: ['2 projects', '3 throws per project', 'Basic journal', 'Community access'],
        current: currentUser?.subscription === 'free' && !currentUser?.membership?.passionProjectsUpgrade
      },
      {
        name: 'Passion Projects',
        price: currentUser?.membership ? '$5' : '$12',
        period: 'month',
        features: ['15 projects', '6 throws per project', 'Advanced journal', 'Photo uploads & editing', 'Community access'],
        current: currentUser?.subscription === 'pro' || currentUser?.membership?.passionProjectsUpgrade,
        note: currentUser?.membership ? 'Special studio member pricing' : undefined
      },
      {
        name: 'Artist/Small Studio',
        price: '$39',
        period: 'month',
        features: ['30 projects', '8 throws per project', '2 manager profiles', '50 member profiles', 'Studio tools', 'Commerce features'],
        current: currentUser?.subscription === 'studio'
      },
      {
        name: 'Studio Pro',
        price: 'Custom',
        period: 'contact sales',
        features: ['Unlimited projects', 'Unlimited throws', 'Advanced analytics', 'White label', 'API access', 'Priority support'],
        current: false
      }
    ];

    return baseSubscriptions;
  };

  const subscriptionTiers = getSubscriptionTiers();

  const isStudio = currentUser?.type === 'studio';
  const isIndependentArtist = currentUser?.type === 'artist' && !currentUser?.studioId;
  const isStudioMember = currentUser?.membership && currentUser?.studioId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, notifications, and preferences
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Privacy</span>
          </TabsTrigger>
          {(isStudio || (currentUser?.type === 'artist' && currentUser?.studioId)) && (
            <TabsTrigger value="studio" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Studio</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Studio Membership Info */}
              {isStudioMember && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Studio Membership</h4>
                    <Badge variant="default">Active Member</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Studio:</span>
                      <span className="ml-2 font-medium">{currentStudio?.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Membership:</span>
                      <span className="ml-2 font-medium capitalize">{currentUser?.membership?.membershipType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shelf:</span>
                      <span className="ml-2 font-medium">{currentUser?.membership?.shelfNumber || 'Unassigned'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="ml-2 font-medium">
                        {currentUser?.membership?.startDate ? 
                          new Date(currentUser.membership.startDate).toLocaleDateString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileSettings.name}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="handle">Handle (@username)</Label>
                  <Input
                    id="handle"
                    value={profileSettings.handle}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, handle: e.target.value }))}
                    placeholder="@username"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileSettings.email}
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileSettings.bio}
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell people about your pottery journey..."
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <Label>Social Media Links</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileSettings.website}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://your-website.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={profileSettings.instagram}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={profileSettings.facebook}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, facebook: e.target.value }))}
                      placeholder="facebook.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter/X</Label>
                    <Input
                      id="twitter"
                      value={profileSettings.twitter}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    <p className="text-sm text-muted-foreground">
                      {key === 'classReminders' && 'Get notified about upcoming classes'}
                      {key === 'firingNotifications' && 'Alerts for kiln firings and schedules'}
                      {key === 'messages' && 'New messages and chat notifications'}
                      {key === 'announcements' && 'Studio announcements and updates'}
                      {key === 'salesUpdates' && 'Updates on your pottery sales'}
                      {key === 'marketplaceActivity' && 'New listings and marketplace activity'}
                      {key === 'weeklyDigest' && 'Weekly summary of your activity'}
                    </p>
                  </div>
                  <Switch
                    checked={value as boolean}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, [key]: checked }
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                  </div>
                  <Switch
                    checked={value as boolean}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev,
                        push: { ...prev.push, [key]: checked }
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.sms).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                  </div>
                  <Switch
                    checked={value as boolean}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, [key]: checked }
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {colorPalettes.map((palette) => (
                  <div key={palette.name} className="border rounded-lg p-4 cursor-pointer hover:bg-muted">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex space-x-1">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{palette.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select value={privacySettings.profileVisibility} onValueChange={(value) => 
                  setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="studio">Studio Members Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {Object.entries(privacySettings).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                  </div>
                  <Switch
                    checked={value as boolean}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Studio Settings */}
        {(isStudio || (currentUser?.type === 'artist' && currentUser?.studioId)) && (
          <TabsContent value="studio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Studio Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={studioSettings.commissionRate}
                    onChange={(e) => setStudioSettings(prev => ({ ...prev, commissionRate: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bookingApproval">Booking Approval</Label>
                  <Select value={studioSettings.bookingApproval} onValueChange={(value) => 
                    setStudioSettings(prev => ({ ...prev, bookingApproval: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {Object.entries(studioSettings).filter(([key]) => 
                  !['commissionRate', 'bookingApproval'].includes(key)
                ).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    </div>
                    <Switch
                      checked={value as boolean}
                      onCheckedChange={(checked) => 
                        setStudioSettings(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptionTiers.map((tier) => (
                  <div key={tier.name} className={`border rounded-lg p-6 ${tier.current ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3>{tier.name}</h3>
                      <div className="flex items-center space-x-2">
                        {tier.current && <Badge variant="default">Current</Badge>}
                        {tier.note && <Badge variant="secondary">Studio Member</Badge>}
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-2xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">/{tier.period}</span>
                      {tier.note && (
                        <p className="text-xs text-muted-foreground mt-1">{tier.note}</p>
                      )}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={tier.current ? "outline" : "default"} 
                      disabled={tier.current}
                      className="w-full"
                    >
                      {tier.current ? 'Current Plan' : tier.name === 'Studio Pro' ? 'Contact Sales' : 'Upgrade'}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Passion Projects Special Pricing Note */}
              {isStudioMember && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Studio Member Benefits</h4>
                  <p className="text-sm text-blue-800">
                    As a studio member, you can upgrade to Passion Projects for just $5/month instead of the regular $12/month. 
                    If your studio membership ends, the price will return to the standard $12/month rate.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}