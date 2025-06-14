import { useState } from 'react';
import {
  User, Building2, ShoppingBag, BarChart3, GraduationCap, Calendar,
  MessageCircle, Camera, Palette, Settings as SettingsIcon, MapPin, Globe,
  Users, UserCog, Menu, X
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import type { User as UserType } from '../App';

interface NavigationProps {
  currentUser: UserType;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

export function Navigation({ currentUser, currentPage, onPageChange, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    ];

    if (currentUser.type === 'artist') {
      baseItems.push(
        { id: 'journal', label: 'Pottery Journal', icon: User },
        { id: 'profile', label: 'Artist Profile', icon: User },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
        { id: 'studios', label: 'Find Studios', icon: MapPin },
        { id: 'ceramics', label: 'Ceramics', icon: Globe }
      );
    }

    if (currentUser.type === 'studio') {
      baseItems.push(
        { id: 'members', label: 'Members', icon: Users },
        { id: 'staff', label: 'Staff', icon: UserCog },
        { id: 'classes', label: 'Classes', icon: GraduationCap },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
        { id: 'ceramics', label: 'Ceramics', icon: Globe }
      );
    }

    // Common items
    baseItems.push(
      { id: 'messages', label: 'Messages', icon: MessageCircle },
      { id: 'settings', label: 'Settings', icon: SettingsIcon }
    );

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const NavigationContent = () => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => {
              onPageChange(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.id === 'staff' && currentUser.type === 'studio' && (
              <Badge variant="secondary" className="ml-auto">
                5
              </Badge>
            )}
          </button>
        );
      })}
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Throw Clay</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationContent />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.profile?.profileImage} alt={currentUser.name} />
                    <AvatarFallback>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onPageChange('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPageChange('settings')}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-2">
              <NavigationContent />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}