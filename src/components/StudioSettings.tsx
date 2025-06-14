import { useState } from 'react';
import { Settings, User, CreditCard, Palette, Globe, Save, Crown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { useAppContext } from '../App';

export function StudioSettings() {
  const { currentUser, currentStudio } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  // Mock subscription data
  const subscriptionInfo = {
    plan: currentUser?.subscription || 'free',
    status: 'active',
    nextBilling: '2025-07-13',
    price: currentUser?.subscription === 'pro' ? 29 : currentUser?.subscription === 'studio' ? 99 : 0
  };

  const subscriptionFeatures = {
    free: [
      'Up to 10 journal entries',
      'Basic photo storage',
      'Community access'
    ],
    pro: [
      'Unlimited journal entries',
      'Advanced photo editing',
      'Custom domain support',
      'Priority support',
      'Export functionality',
      'Analytics dashboard'
    ],
    studio: [
      'Everything in Pro',
      'Multi-user management',
      'Commerce marketplace',
      'Studio branding',
      'Commission tracking',
      'Advanced admin tools',
      'API access'
    ]
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Mock save functionality
    console.log('Profile settings saved');
  };

  const handleUpgradePlan = (plan: 'pro' | 'studio') => {
    // Mock upgrade functionality
    alert(`Upgrading to ${plan} plan...`);
  };

  const handleCancelSubscription = () => {
    // Mock cancellation
    if (confirm('Are you sure you want to cancel your subscription?')) {
      alert('Subscription cancelled. You will retain access until the end of your billing period.');
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'studio': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Badge className={getPlanBadgeColor(subscriptionInfo.plan)}>
          <Crown className="w-3 h-3 mr-1" />
          {subscriptionInfo.plan.toUpperCase()} Plan
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Branding</span>
          </TabsTrigger>
          <TabsTrigger value="domain" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Domain</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={currentUser?.name}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={currentUser?.email}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              {currentUser?.type === 'independent_artist' && (
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue={currentUser?.profile?.bio}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell people about your pottery journey..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about your pottery journal</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Pottery tips, techniques, and studio updates</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Allow others to view your pottery showcase</p>
                </div>
                <Switch defaultChecked={currentUser?.type !== 'studio_admin'} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Settings */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPlanBadgeColor(subscriptionInfo.plan)}>
                        {subscriptionInfo.plan.toUpperCase()}
                      </Badge>
                      <span>${subscriptionInfo.price}/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {subscriptionInfo.status === 'active' ? 'Active' : 'Inactive'} • 
                      Next billing: {subscriptionInfo.nextBilling}
                    </p>
                  </div>
                  {subscriptionInfo.plan !== 'free' && (
                    <Button variant="outline" onClick={handleCancelSubscription}>
                      Cancel Subscription
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {/* Free Plan */}
                  <Card className={subscriptionInfo.plan === 'free' ? 'ring-2 ring-primary' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Free</CardTitle>
                        {subscriptionInfo.plan === 'free' && (
                          <Badge variant="outline">Current</Badge>
                        )}
                      </div>
                      <div className="text-2xl font-bold">$0</div>
                      <p className="text-sm text-muted-foreground">Perfect for beginners</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2 text-sm">
                        {subscriptionFeatures.free.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="w-3 h-3 text-green-600" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Pro Plan */}
                  <Card className={subscriptionInfo.plan === 'pro' ? 'ring-2 ring-primary' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Pro</CardTitle>
                        {subscriptionInfo.plan === 'pro' ? (
                          <Badge variant="outline">Current</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800">Popular</Badge>
                        )}
                      </div>
                      <div className="text-2xl font-bold">$29</div>
                      <p className="text-sm text-muted-foreground">For serious potters</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2 text-sm">
                        {subscriptionFeatures.pro.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="w-3 h-3 text-green-600" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {subscriptionInfo.plan !== 'pro' && (
                        <Button 
                          onClick={() => handleUpgradePlan('pro')}
                          className="w-full mt-4"
                        >
                          Upgrade to Pro
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Studio Plan */}
                  <Card className={subscriptionInfo.plan === 'studio' ? 'ring-2 ring-primary' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Studio</CardTitle>
                        {subscriptionInfo.plan === 'studio' && (
                          <Badge variant="outline">Current</Badge>
                        )}
                      </div>
                      <div className="text-2xl font-bold">$99</div>
                      <p className="text-sm text-muted-foreground">For studios & schools</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2 text-sm">
                        {subscriptionFeatures.studio.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="w-3 h-3 text-green-600" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {subscriptionInfo.plan !== 'studio' && (
                        <Button 
                          onClick={() => handleUpgradePlan('studio')}
                          className="w-full mt-4"
                        >
                          Upgrade to Studio
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding" className="space-y-6">
          {currentUser?.type === 'independent_artist' || currentUser?.type === 'studio_admin' ? (
            <Card>
              <CardHeader>
                <CardTitle>Brand Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="brand-color">Primary Brand Color</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Input
                      id="brand-color"
                      type="color"
                      defaultValue={currentUser?.profile?.branding?.primaryColor || '#030213'}
                      className="w-16 h-10"
                    />
                    <Input
                      defaultValue={currentUser?.profile?.branding?.primaryColor || '#030213'}
                      placeholder="#030213"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="logo-upload">Logo</Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your logo (recommended: 200x200px, PNG or JPG)
                  </p>
                </div>

                {currentUser?.type === 'studio_admin' && (
                  <div>
                    <Label htmlFor="studio-name">Studio Name</Label>
                    <Input
                      id="studio-name"
                      defaultValue={currentStudio?.name}
                      placeholder="Your Studio Name"
                    />
                  </div>
                )}

                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Branding
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <Palette className="w-4 h-4" />
              <AlertDescription>
                Branding customization is available for Pro and Studio subscribers. 
                <Button variant="link" className="p-0 ml-1">Upgrade your plan</Button> to access these features.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Domain Settings */}
        <TabsContent value="domain" className="space-y-6">
          {currentUser?.subscription === 'pro' || currentUser?.subscription === 'studio' ? (
            <Card>
              <CardHeader>
                <CardTitle>Custom Domain</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-domain">Your Custom Domain</Label>
                  <Input
                    id="custom-domain"
                    defaultValue={currentUser?.profile?.customDomain}
                    placeholder="yourname.com"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Point your domain to your pottery showcase
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4>Domain Setup Instructions</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Purchase a domain from your preferred registrar</li>
                    <li>Add a CNAME record pointing to: pottery-platform.com</li>
                    <li>Enter your domain above and click "Connect Domain"</li>
                    <li>Wait 24-48 hours for DNS propagation</li>
                  </ol>
                </div>

                <Button className="w-full">
                  <Globe className="w-4 h-4 mr-2" />
                  Connect Domain
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <Globe className="w-4 h-4" />
              <AlertDescription>
                Custom domains are available for Pro and Studio subscribers. 
                <Button variant="link" className="p-0 ml-1">Upgrade your plan</Button> to use your own domain.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}