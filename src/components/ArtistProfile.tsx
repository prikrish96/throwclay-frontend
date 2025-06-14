import { useState } from 'react';
import { User, Camera, Edit, Save, ExternalLink, Instagram, Globe, Twitter, Facebook } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useAppContext, type ArtistProfile as ArtistProfileType } from '../App';

export function ArtistProfile() {
  const { currentUser, setCurrentUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ArtistProfileType>(
    currentUser?.profile || {
      bio: '',
      socialMedia: {},
      branding: {
        primaryColor: '#030213'
      }
    }
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSave = () => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      profile: editedProfile
    };
    setCurrentUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(currentUser?.profile || {
      bio: '',
      socialMedia: {},
      branding: { primaryColor: '#030213' }
    });
    setIsEditing(false);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'website': return <Globe className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3>Not Logged In</h3>
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={editedProfile.profileImage} />
            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1>{currentUser.name}</h1>
            <p className="text-muted-foreground">{currentUser.email}</p>
            <Badge variant="outline" className="mt-1">
              {currentUser.type === 'studio_artist' ? 'Studio Artist' : 'Independent Artist'}
            </Badge>
          </div>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="profile-image">Profile Image URL</Label>
                  <Input
                    id="profile-image"
                    value={editedProfile.profileImage || ''}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, profileImage: e.target.value }))}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Artist Bio</Label>
                  <Textarea
                    id="bio"
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell people about your pottery journey, inspiration, and artistic style..."
                    rows={6}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>Artist Bio</Label>
                  <p className="text-muted-foreground mt-1">
                    {editedProfile.bio || 'No bio added yet. Click "Edit Profile" to add your story.'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={editedProfile.socialMedia.instagram || ''}
                    onChange={(e) => setEditedProfile(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                    }))}
                    placeholder="@yourusername"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editedProfile.socialMedia.website || ''}
                    onChange={(e) => setEditedProfile(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, website: e.target.value }
                    }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={editedProfile.socialMedia.twitter || ''}
                    onChange={(e) => setEditedProfile(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                    }))}
                    placeholder="@yourusername"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={editedProfile.socialMedia.facebook || ''}
                    onChange={(e) => setEditedProfile(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                    }))}
                    placeholder="Your Facebook page URL"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {Object.entries(editedProfile.socialMedia).filter(([_, value]) => value).length > 0 ? (
                  Object.entries(editedProfile.socialMedia)
                    .filter(([_, value]) => value)
                    .map(([platform, value]) => (
                      <div key={platform} className="flex items-center space-x-3">
                        {getSocialIcon(platform)}
                        <span className="capitalize">{platform}:</span>
                        <a 
                          href={platform === 'website' ? value : `https://${platform}.com/${value?.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {value}
                        </a>
                      </div>
                    ))
                ) : (
                  <p className="text-muted-foreground">No social media links added yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Branding (for Independent Artists) */}
        {currentUser.type === 'independent_artist' && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Branding & Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="primary-color">Primary Brand Color</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={editedProfile.branding?.primaryColor || '#030213'}
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev,
                          branding: { ...prev.branding, primaryColor: e.target.value }
                        }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={editedProfile.branding?.primaryColor || '#030213'}
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev,
                          branding: { ...prev.branding, primaryColor: e.target.value }
                        }))}
                        placeholder="#030213"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <Input
                      id="logo-url"
                      value={editedProfile.branding?.logoUrl || ''}
                      onChange={(e) => setEditedProfile(prev => ({
                        ...prev,
                        branding: { ...prev.branding, logoUrl: e.target.value }
                      }))}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-domain">Custom Domain</Label>
                    <Input
                      id="custom-domain"
                      value={editedProfile.customDomain || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, customDomain: e.target.value }))}
                      placeholder="yourname.com"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Custom domain for your pottery showcase (Pro feature)
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: editedProfile.branding?.primaryColor || '#030213' }}
                    />
                    <span>Primary Color: {editedProfile.branding?.primaryColor || '#030213'}</span>
                  </div>
                  {editedProfile.branding?.logoUrl && (
                    <div>
                      <Label>Logo</Label>
                      <img 
                        src={editedProfile.branding.logoUrl} 
                        alt="Logo" 
                        className="w-16 h-16 object-contain mt-2"
                      />
                    </div>
                  )}
                  {editedProfile.customDomain && (
                    <div>
                      <Label>Custom Domain</Label>
                      <p className="text-muted-foreground">{editedProfile.customDomain}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Profile Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Profile Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Journal Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Items for Sale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Completed Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Profile Views</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}