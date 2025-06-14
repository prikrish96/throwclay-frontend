import { useState, useRef, useEffect } from 'react';
import { 
  Plus, Search, Send, Paperclip, Image as ImageIcon, Video, FileText, 
  Users, Settings, MoreHorizontal, Phone, VideoIcon, Info, Smile,
  X, Edit, UserPlus, UserMinus, Crown, Shield, Trash2, Download,
  MessageCircle, Hash, Lock, Globe, Camera, Mic
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useAppContext, type Message, type ChatGroup, type User } from '../App';

interface ChatParticipant extends User {
  lastSeen?: string;
  isOnline?: boolean;
  role?: 'admin' | 'member' | 'owner';
}

interface FileAttachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  url: string;
  uploadedAt: string;
}

interface ExtendedMessage extends Message {
  replyTo?: string;
  isEdited?: boolean;
  editedAt?: string;
  reactions?: { emoji: string; users: string[] }[];
  attachments?: FileAttachment[];
}

export function MessagingCenter() {
  const { currentUser, currentStudio } = useAppContext();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPrivateGroup, setIsPrivateGroup] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ExtendedMessage | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - in a real app, this would come from your backend
  const [chats] = useState<ChatGroup[]>([
    {
      id: 'chat1',
      name: 'Beginner Wheel Throwing',
      type: 'class',
      members: ['user1', 'instructor1', 'student1', 'student2'],
      adminIds: ['instructor1'],
      description: 'Class discussion and updates',
      isPrivate: false,
      createdAt: '2025-06-01',
      relatedId: 'class1',
      autoCreated: true
    },
    {
      id: 'chat2',
      name: 'Studio Announcements',
      type: 'announcement',
      members: ['user1', 'manager1', 'instructor1', 'student1', 'student2'],
      adminIds: ['manager1'],
      description: 'Important studio updates and announcements',
      isPrivate: false,
      createdAt: '2025-06-01'
    },
    {
      id: 'chat3',
      name: 'Firing Squad',
      type: 'general',
      members: ['user1', 'student1', 'student2', 'student3'],
      adminIds: ['user1', 'student1'],
      description: 'Coordinating firing schedules and sharing tips',
      isPrivate: false,
      createdAt: '2025-06-05'
    }
  ]);

  const [messages, setMessages] = useState<ExtendedMessage[]>([
    {
      id: 'msg1',
      senderId: 'instructor1',
      senderName: 'Emma Davis',
      senderHandle: 'emmadavis',
      groupId: 'chat1',
      content: 'Welcome to our Beginner Wheel Throwing class! Feel free to ask questions and share your progress here.',
      type: 'text',
      timestamp: '2025-06-14T09:00:00Z',
      readBy: ['user1', 'student1'],
      reactions: [{ emoji: '👋', users: ['user1', 'student1'] }]
    },
    {
      id: 'msg2',
      senderId: 'student1',
      senderName: 'Alex Johnson',
      senderHandle: 'alexj',
      groupId: 'chat1',
      content: 'Thanks Emma! I\'m excited to get started. When do we begin working on the wheel?',
      type: 'text',
      timestamp: '2025-06-14T09:15:00Z',
      readBy: ['user1', 'instructor1']
    },
    {
      id: 'msg3',
      senderId: 'user1',
      senderName: 'Jane Potter',
      senderHandle: 'janepotter',
      groupId: 'chat1',
      content: 'Here\'s a photo of my first attempt! Any tips for centering?',
      type: 'image',
      timestamp: '2025-06-14T10:30:00Z',
      readBy: ['instructor1'],
      attachments: [{
        id: 'file1',
        name: 'first_attempt.jpg',
        type: 'image',
        size: 2048000,
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        uploadedAt: '2025-06-14T10:30:00Z'
      }]
    },
    {
      id: 'msg4',
      senderId: 'manager1',
      senderName: 'Sarah Wilson',
      senderHandle: 'sarahwilson',
      groupId: 'chat2',
      content: 'Reminder: Studio will be closed this Sunday for kiln maintenance. All classes are moved to next week.',
      type: 'announcement',
      timestamp: '2025-06-14T08:00:00Z',
      readBy: ['user1', 'instructor1']
    }
  ]);

  // Mock users data - combine studio members, staff, and followers
  const [allUsers] = useState<ChatParticipant[]>([
    {
      id: 'instructor1',
      name: 'Emma Davis',
      email: 'emma@artisanclay.com',
      handle: 'emmadavis',
      type: 'artist',
      role: 'instructor',
      studioId: currentStudio?.id,
      isOnline: true,
      lastSeen: '2025-06-14T11:30:00Z'
    },
    {
      id: 'manager1',
      name: 'Sarah Wilson',
      email: 'sarah@artisanclay.com',
      handle: 'sarahwilson',
      type: 'artist',
      role: 'admin',
      studioId: currentStudio?.id,
      isOnline: true,
      lastSeen: '2025-06-14T11:25:00Z'
    },
    {
      id: 'student1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      handle: 'alexj',
      type: 'artist',
      role: 'student',
      studioId: currentStudio?.id,
      isOnline: false,
      lastSeen: '2025-06-14T10:00:00Z'
    },
    {
      id: 'student2',
      name: 'Maya Chen',
      email: 'maya@example.com',
      handle: 'mayachen',
      type: 'artist',
      role: 'member',
      studioId: currentStudio?.id,
      isOnline: true,
      lastSeen: '2025-06-14T11:20:00Z'
    },
    {
      id: 'student3',
      name: 'David Kim',
      email: 'david@example.com',
      handle: 'davidkim',
      type: 'artist',
      role: 'student',
      studioId: currentStudio?.id,
      isOnline: false,
      lastSeen: '2025-06-14T09:45:00Z'
    },
    {
      id: 'buyer1',
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      handle: 'lisaanderson',
      type: 'artist',
      role: 'buyer',
      isOnline: true,
      lastSeen: '2025-06-14T11:15:00Z'
    },
    {
      id: 'guest1',
      name: 'Tom Wilson',
      email: 'tom@example.com',
      handle: 'tomwilson',
      type: 'artist',
      role: 'guest',
      isOnline: false,
      lastSeen: '2025-06-14T10:30:00Z'
    },
    {
      id: 'future1',
      name: 'Rachel Green',
      email: 'rachel@example.com',
      handle: 'rachelgreen',
      type: 'artist',
      role: 'future-member',
      isOnline: true,
      lastSeen: '2025-06-14T11:45:00Z'
    },
    {
      id: 'manager2',
      name: 'Mike Chen',
      email: 'mike@artisanclay.com',
      handle: 'mikechen',
      type: 'artist',
      role: 'manager',
      studioId: currentStudio?.id,
      isOnline: true,
      lastSeen: '2025-06-14T11:40:00Z'
    }
  ]);

  const activeGroup = chats.find(chat => chat.id === activeChat);
  const activeChatMessages = messages.filter(msg => 
    msg.groupId === activeChat || msg.recipientId === activeChat
  );

  const isGroupAdmin = activeGroup && activeGroup.adminIds.includes(currentUser?.id || '');
  const isGroupOwner = activeGroup && activeGroup.adminIds[0] === currentUser?.id;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeChat) return;

    const newMessage: ExtendedMessage = {
      id: `msg${Date.now()}`,
      senderId: currentUser?.id || '',
      senderName: currentUser?.name || '',
      senderHandle: currentUser?.handle || '',
      groupId: activeChat,
      content: messageText,
      type: 'text',
      timestamp: new Date().toISOString(),
      readBy: [currentUser?.id || ''],
      replyTo: replyingTo?.id
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setReplyingTo(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !activeChat) return;

    Array.from(files).forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'document';
      
      const attachment: FileAttachment = {
        id: `file${Date.now()}_${Math.random()}`,
        name: file.name,
        type: fileType,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      };

      const newMessage: ExtendedMessage = {
        id: `msg${Date.now()}_${Math.random()}`,
        senderId: currentUser?.id || '',
        senderName: currentUser?.name || '',
        senderHandle: currentUser?.handle || '',
        groupId: activeChat,
        content: fileType === 'image' ? 'sent a photo' : 
                fileType === 'video' ? 'sent a video' : 
                `sent ${file.name}`,
        type: fileType === 'image' ? 'image' : 'text',
        timestamp: new Date().toISOString(),
        readBy: [currentUser?.id || ''],
        attachments: [attachment]
      };

      setMessages(prev => [...prev, newMessage]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateChat = () => {
    if (chatType === 'direct' && selectedUsers.length !== 1) return;
    if (chatType === 'group' && (selectedUsers.length < 2 || !groupName.trim())) return;

    const newChat: ChatGroup = {
      id: `chat${Date.now()}`,
      name: chatType === 'direct' 
        ? allUsers.find(u => u.id === selectedUsers[0])?.name || 'Direct Message'
        : groupName,
      type: 'general',
      members: [...selectedUsers, currentUser?.id || ''],
      adminIds: [currentUser?.id || ''],
      description: groupDescription,
      isPrivate: isPrivateGroup,
      createdAt: new Date().toISOString()
    };

    // In a real app, you'd save this to your backend
    console.log('Creating new chat:', newChat);
    
    // Reset form
    setSelectedUsers([]);
    setGroupName('');
    setGroupDescription('');
    setIsPrivateGroup(false);
    setShowNewChatDialog(false);
    setActiveChat(newChat.id);
  };

  const handleAddMember = (userId: string) => {
    if (!activeGroup || !isGroupAdmin) return;
    
    // In a real app, you'd update this on your backend
    console.log('Adding member to group:', userId);
  };

  const handleRemoveMember = (userId: string) => {
    if (!activeGroup || !isGroupAdmin || userId === currentUser?.id) return;
    
    // In a real app, you'd update this on your backend
    console.log('Removing member from group:', userId);
  };

  const handlePromoteToAdmin = (userId: string) => {
    if (!activeGroup || !isGroupOwner) return;
    
    // In a real app, you'd update this on your backend
    console.log('Promoting user to admin:', userId);
  };

  const handleRenameGroup = (newName: string) => {
    if (!activeGroup || !isGroupAdmin) return;
    
    // In a real app, you'd update this on your backend
    console.log('Renaming group to:', newName);
  };

  const getRoleBadge = (role?: string) => {
    if (!role) return null;
    
    const roleConfig = {
      owner: { label: 'Owner', color: 'bg-purple-500 text-white' },
      admin: { label: 'Admin', color: 'bg-red-500 text-white' },
      manager: { label: 'Manager', color: 'bg-blue-500 text-white' },
      instructor: { label: 'Instructor', color: 'bg-green-500 text-white' },
      member: { label: 'Member', color: 'bg-gray-500 text-white' },
      student: { label: 'Student', color: 'bg-indigo-500 text-white' },
      buyer: { label: 'Buyer', color: 'bg-orange-500 text-white' },
      guest: { label: 'Guest', color: 'bg-yellow-500 text-black' },
      'future-member': { label: 'Future Member', color: 'bg-teal-500 text-white' }
    };

    const config = roleConfig[role as keyof typeof roleConfig];
    if (!config) return null;

    return (
      <Badge className={`text-xs ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const getRoleFilterOptions = () => [
    { value: 'all', label: 'All Users' },
    { value: 'admin', label: 'Admins' },
    { value: 'manager', label: 'Managers' },
    { value: 'instructor', label: 'Instructors' },
    { value: 'member', label: 'Members' },
    { value: 'student', label: 'Students' },
    { value: 'buyer', label: 'Buyers' },
    { value: 'guest', label: 'Guests' },
    { value: 'future-member', label: 'Future Members' }
  ];

  const getFilteredUsers = () => {
    return allUsers.filter(user => {
      if (selectedRoleFilter === 'all') return true;
      return user.role === selectedRoleFilter;
    });
  };

  const getUserAvatar = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    return user?.profile?.profileImage || `https://images.unsplash.com/photo-1494790108755-2616b332c35d?w=40&h=40&fit=crop&crop=face`;
  };

  const getUserName = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const handleUserClick = (userId: string) => {
    setShowUserProfile(userId);
    // In a real app, you might navigate to the user's profile page
    console.log('Navigating to user profile:', userId);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getChatIcon = (type: ChatGroup['type']) => {
    switch (type) {
      case 'class': return <Users className="w-4 h-4" />;
      case 'announcement': return <Hash className="w-4 h-4" />;
      case 'project': return <FileText className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Messages</h1>
          <p className="text-muted-foreground">
            Chat with studio members, instructors, and classmates
          </p>
        </div>
        <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Start New Chat</DialogTitle>
              <DialogDescription>
                Create a direct message or group chat with studio members.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={chatType} onValueChange={(value) => setChatType(value as 'direct' | 'group')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="direct">Direct Message</TabsTrigger>
                <TabsTrigger value="group">Group Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="direct" className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Select Person</Label>
                    <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getRoleFilterOptions().map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-3">
                    {getFilteredUsers()
                      .filter(user => user.id !== currentUser?.id)
                      .map(user => (
                        <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded cursor-pointer"
                             onClick={() => setSelectedUsers([user.id])}>
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => {}}
                          />
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={getUserAvatar(user.id)} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{user.name}</p>
                              {getRoleBadge(user.role)}
                            </div>
                            <p className="text-sm text-muted-foreground">@{user.handle}</p>
                            {user.studioId && (
                              <p className="text-xs text-muted-foreground">Studio Member</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.isOnline ? (
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            ) : (
                              <div className="w-2 h-2 bg-gray-300 rounded-full" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="group" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Group Name</Label>
                    <Input
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Enter group name"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isPrivateGroup}
                      onCheckedChange={setIsPrivateGroup}
                    />
                    <Label>Private Group</Label>
                  </div>
                </div>

                <div>
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="What's this group about?"
                    rows={2}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Add Members ({selectedUsers.length} selected)</Label>
                    <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getRoleFilterOptions().map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-3">
                    {getFilteredUsers()
                      .filter(user => user.id !== currentUser?.id)
                      .map(user => (
                        <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded cursor-pointer"
                             onClick={() => {
                               setSelectedUsers(prev => 
                                 prev.includes(user.id) 
                                   ? prev.filter(id => id !== user.id)
                                   : [...prev, user.id]
                               );
                             }}>
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => {}}
                          />
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={getUserAvatar(user.id)} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{user.name}</p>
                              {getRoleBadge(user.role)}
                            </div>
                            <p className="text-sm text-muted-foreground">@{user.handle}</p>
                            {user.studioId && (
                              <p className="text-xs text-muted-foreground">Studio Member</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.isOnline ? (
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            ) : (
                              <div className="w-2 h-2 bg-gray-300 rounded-full" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewChatDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateChat}
                disabled={
                  (chatType === 'direct' && selectedUsers.length !== 1) ||
                  (chatType === 'group' && (selectedUsers.length < 2 || !groupName.trim()))
                }
              >
                Create Chat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-4">
                  {chats
                    .filter(chat => 
                      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      chat.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(chat => {
                      const lastMessage = messages
                        .filter(msg => msg.groupId === chat.id)
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                      
                      const unreadCount = messages
                        .filter(msg => msg.groupId === chat.id && !msg.readBy.includes(currentUser?.id || ''))
                        .length;

                      return (
                        <div
                          key={chat.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            activeChat === chat.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setActiveChat(chat.id)}
                        >
                          <div className="relative">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              {getChatIcon(chat.type)}
                            </div>
                            {chat.isPrivate && (
                              <Lock className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full p-0.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{chat.name}</p>
                              {unreadCount > 0 && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                            {lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {lastMessage.senderName}: {lastMessage.content}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {chat.members.length} members
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Active Chat Area */}
        <div className="lg:col-span-3">
          {activeChat ? (
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      {getChatIcon(activeGroup?.type || 'general')}
                    </div>
                    <div>
                      <h3>{activeGroup?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {activeGroup?.members.length} members
                        {activeGroup?.isPrivate && ' • Private'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <VideoIcon className="w-4 h-4" />
                    </Button>
                    <Sheet open={showGroupSettings} onOpenChange={setShowGroupSettings}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Info className="w-4 h-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Chat Settings</SheetTitle>
                          <SheetDescription>
                            Manage this chat's settings and members.
                          </SheetDescription>
                        </SheetHeader>
                        
                        <div className="space-y-6 mt-6">
                          {/* Group Info */}
                          <div>
                            <h4>Group Information</h4>
                            <div className="space-y-3 mt-3">
                              <div>
                                <Label>Group Name</Label>
                                <div className="flex items-center space-x-2">
                                  <Input 
                                    defaultValue={activeGroup?.name}
                                    disabled={!isGroupAdmin}
                                  />
                                  {isGroupAdmin && (
                                    <Button size="sm" variant="outline">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea 
                                  defaultValue={activeGroup?.description}
                                  disabled={!isGroupAdmin}
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Members */}
                          <div>
                            <div className="flex items-center justify-between">
                              <h4>Members ({activeGroup?.members.length})</h4>
                              {isGroupAdmin && (
                                <Button size="sm" variant="outline">
                                  <UserPlus className="w-4 h-4 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2 mt-3">
                              {activeGroup?.members.map(memberId => {
                                const user = allUsers.find(u => u.id === memberId);
                                const isAdmin = activeGroup.adminIds.includes(memberId);
                                const isOwner = activeGroup.adminIds[0] === memberId;
                                
                                return (
                                  <div key={memberId} className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center space-x-3 cursor-pointer" 
                                         onClick={() => handleUserClick(memberId)}>
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={getUserAvatar(memberId)} />
                                        <AvatarFallback>
                                          {getUserName(memberId).split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="flex items-center space-x-2">
                                          <p className="font-medium">{getUserName(memberId)}</p>
                                          {getRoleBadge(user?.role)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          @{user?.handle}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                                      {isAdmin && !isOwner && <Shield className="w-4 h-4 text-blue-500" />}
                                      {isGroupAdmin && memberId !== currentUser?.id && (
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                              <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                            {isGroupOwner && !isAdmin && (
                                              <DropdownMenuItem onClick={() => handlePromoteToAdmin(memberId)}>
                                                <Shield className="w-4 h-4 mr-2" />
                                                Make Admin
                                              </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem 
                                              onClick={() => handleRemoveMember(memberId)}
                                              className="text-destructive"
                                            >
                                              <UserMinus className="w-4 h-4 mr-2" />
                                              Remove
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {isGroupAdmin && (
                            <>
                              <Separator />
                              
                              {/* Danger Zone */}
                              <div>
                                <h4 className="text-destructive">Danger Zone</h4>
                                <div className="space-y-2 mt-3">
                                  <Button variant="destructive" size="sm" className="w-full">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Chat
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {activeChatMessages.map(message => (
                      <div key={message.id} className="flex items-start space-x-3">
                        <Avatar 
                          className="w-8 h-8 cursor-pointer"
                          onClick={() => handleUserClick(message.senderId)}
                        >
                          <AvatarImage src={getUserAvatar(message.senderId)} />
                          <AvatarFallback>
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline space-x-2">
                            <p 
                              className="font-medium cursor-pointer hover:underline"
                              onClick={() => handleUserClick(message.senderId)}
                            >
                              {message.senderName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </p>
                            {message.isEdited && (
                              <Badge variant="outline" className="text-xs">edited</Badge>
                            )}
                          </div>
                          
                          {message.replyTo && (
                            <div className="bg-muted/50 border-l-2 border-primary/50 pl-3 py-1 my-1">
                              <p className="text-sm text-muted-foreground">
                                Replying to {getUserName(messages.find(m => m.id === message.replyTo)?.senderId || '')}
                              </p>
                            </div>
                          )}
                          
                          <div className="mt-1">
                            {message.type === 'announcement' && (
                              <Badge className="mb-2">Announcement</Badge>
                            )}
                            <p className="text-sm">{message.content}</p>
                            
                            {message.attachments?.map(attachment => (
                              <div key={attachment.id} className="mt-2">
                                {attachment.type === 'image' && (
                                  <div className="relative max-w-sm">
                                    <img 
                                      src={attachment.url} 
                                      alt={attachment.name}
                                      className="rounded border max-w-full h-auto cursor-pointer"
                                    />
                                  </div>
                                )}
                                {attachment.type === 'video' && (
                                  <div className="relative max-w-sm">
                                    <video 
                                      src={attachment.url}
                                      controls
                                      className="rounded border max-w-full h-auto"
                                    />
                                  </div>
                                )}
                                {attachment.type === 'document' && (
                                  <div className="flex items-center space-x-2 p-2 border rounded max-w-sm">
                                    <FileText className="w-8 h-8 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">{attachment.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {(attachment.size / 1024 / 1024).toFixed(1)} MB
                                      </p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex items-center space-x-1 mt-2">
                              {message.reactions.map((reaction, index) => (
                                <Button 
                                  key={index}
                                  variant="outline" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                >
                                  {reaction.emoji} {reaction.users.length}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setReplyingTo(message)}>
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Smile className="w-4 h-4 mr-2" />
                              React
                            </DropdownMenuItem>
                            {message.senderId === currentUser?.id && (
                              <>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <CardContent className="border-t p-4">
                {replyingTo && (
                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded mb-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Replying to </span>
                      <span className="font-medium">{replyingTo.senderName}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex items-end space-x-2">
                  <div className="flex items-center space-x-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <Textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="min-h-[40px] max-h-32 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3>Select a chat to start messaging</h3>
                <p className="text-muted-foreground">
                  Choose from your existing conversations or start a new one.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* User Profile Dialog */}
      <Dialog open={!!showUserProfile} onOpenChange={() => setShowUserProfile(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              View user details and start a conversation.
            </DialogDescription>
          </DialogHeader>
          {showUserProfile && (
            <div className="space-y-4">
              {(() => {
                const user = allUsers.find(u => u.id === showUserProfile);
                return user ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={getUserAvatar(user.id)} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3>{user.name}</h3>
                        <p className="text-muted-foreground">@{user.handle}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleBadge(user.role)}
                          <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm text-muted-foreground">
                            {user.isOnline ? 'Online' : `Last seen ${formatTime(user.lastSeen || '')}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline">
                        View Profile
                      </Button>
                    </div>
                    
                    {user.profile?.bio && (
                      <div>
                        <Label>Bio</Label>
                        <p className="text-sm text-muted-foreground mt-1">{user.profile.bio}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p>User not found</p>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}