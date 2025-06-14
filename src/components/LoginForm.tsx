import { useState } from 'react';
import { User, Building2, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface LoginFormProps {
  onLogin: (email: string, password: string, userType: 'studio' | 'artist') => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (userType: 'studio' | 'artist') => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onLogin(email, password, userType);
    setIsLoading(false);
  };

  const demoLogin = (userType: 'studio' | 'artist') => {
    const demoCredentials = {
      studio: { email: 'admin@artisanclay.com', password: 'demo123' },
      artist: { email: 'jane@artist.com', password: 'demo123' }
    };
    
    setEmail(demoCredentials[userType].email);
    setPassword(demoCredentials[userType].password);
    handleSubmit(userType);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="studio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="studio" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Studio</span>
            </TabsTrigger>
            <TabsTrigger value="artist" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Artist</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="studio" className="space-y-4">
            <div className="text-center mb-4">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3>Studio Login</h3>
              <p className="text-sm text-muted-foreground">
                Manage your pottery studio, artists, classes, and business operations
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="studio-email">Email</Label>
                <Input
                  id="studio-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourstudio.com"
                />
              </div>
              <div>
                <Label htmlFor="studio-password">Password</Label>
                <Input
                  id="studio-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <Button
                onClick={() => handleSubmit('studio')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Signing in...' : 'Sign in to Studio'}
              </Button>
              <Button
                variant="outline"
                onClick={() => demoLogin('studio')}
                className="w-full"
              >
                Try Studio Demo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="artist" className="space-y-4">
            <div className="text-center mb-4">
              <Palette className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3>Artist Login</h3>
              <p className="text-sm text-muted-foreground">
                Access your pottery journal, portfolio, and connect with studios
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="artist-email">Email</Label>
                <Input
                  id="artist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="artist-password">Password</Label>
                <Input
                  id="artist-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <Button
                onClick={() => handleSubmit('artist')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Signing in...' : 'Sign in as Artist'}
              </Button>
              <Button
                variant="outline"
                onClick={() => demoLogin('artist')}
                className="w-full"
              >
                Try Artist Demo
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>New to our platform?</p>
          <Button variant="link" className="p-0 h-auto">
            Create an account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}