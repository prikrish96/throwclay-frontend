import { useState } from 'react';
import { Plus, Search, Filter, Grid, List, Folder, FolderPlus, Edit, Trash2, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { EntryCard } from './EntryCard';
import { EntryForm } from './EntryForm';
import { FilterDialog } from './FilterDialog';
import { useAppContext, type PotteryEntry, type Project } from '../App';

export function PotteryJournal() {
  const { currentUser } = useAppContext();
  const [entries, setEntries] = useState<PotteryEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Ceramic Bowls Collection',
      description: 'Exploring different bowl forms and glazing techniques',
      color: '#8B4513',
      createdAt: '2025-06-01',
      artistId: currentUser?.id || '',
      throwCount: 3
    },
    {
      id: '2', 
      name: 'Functional Dinnerware',
      description: 'Creating a matching set of plates, bowls, and mugs',
      color: '#2E8B87',
      createdAt: '2025-06-05',
      artistId: currentUser?.id || '',
      throwCount: 8
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PotteryEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // New project form state
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    color: '#8B4513'
  });

  const colorOptions = [
    { value: '#8B4513', label: 'Earth Brown' },
    { value: '#2E8B87', label: 'Teal' },
    { value: '#CD853F', label: 'Clay Orange' },
    { value: '#708090', label: 'Slate Gray' },
    { value: '#9370DB', label: 'Purple' },
    { value: '#228B22', label: 'Forest Green' },
    { value: '#DC143C', label: 'Crimson' },
    { value: '#4682B4', label: 'Steel Blue' }
  ];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.potteryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.clayType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesProject = selectedProject === 'all' || entry.projectId === selectedProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const handleCreateProject = () => {
    if (!newProject.name?.trim() || !currentUser) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name.trim(),
      description: newProject.description || '',
      color: newProject.color || '#8B4513',
      createdAt: new Date().toISOString(),
      artistId: currentUser.id,
      throwCount: 0
    };

    setProjects(prev => [project, ...prev]);
    setNewProject({ name: '', description: '', color: '#8B4513' });
    setShowProjectForm(false);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setEntries(prev => prev.map(entry => 
      entry.projectId === projectId 
        ? { ...entry, projectId: undefined }
        : entry
    ));
  };

  const handleCreateEntry = (entryData: Omit<PotteryEntry, 'id' | 'artistId'>) => {
    if (!currentUser) return;

    const newEntry: PotteryEntry = {
      ...entryData,
      id: Date.now().toString(),
      artistId: currentUser.id,
    };

    setEntries(prev => [newEntry, ...prev]);

    if (newEntry.projectId) {
      setProjects(prev => prev.map(project => 
        project.id === newEntry.projectId 
          ? { ...project, throwCount: project.throwCount + 1 }
          : project
      ));
    }

    setShowEntryForm(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    setEntries(prev => prev.filter(entry => entry.id !== entryId));

    if (entry?.projectId) {
      setProjects(prev => prev.map(project => 
        project.id === entry.projectId 
          ? { ...project, throwCount: Math.max(0, project.throwCount - 1) }
          : project
      ));
    }
  };

  // Check subscription limits
  const getSubscriptionLimits = () => {
    switch (currentUser?.subscription) {
      case 'free':
        return { maxProjects: 2, maxThrowsPerProject: 3 };
      case 'pro':
        return { maxProjects: 15, maxThrowsPerProject: 6 };
      case 'studio':
        return { maxProjects: 30, maxThrowsPerProject: 8 };
      default:
        return { maxProjects: 2, maxThrowsPerProject: 3 };
    }
  };

  const limits = getSubscriptionLimits();
  const canCreateProject = projects.length < limits.maxProjects;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Pottery Journal</h1>
          <p className="text-muted-foreground">
            Document your pottery journey with throws, projects, and creative discoveries
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {projects.length}/{limits.maxProjects} projects
          </Badge>
          <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!canCreateProject}>
                <FolderPlus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Ceramic Bowls Collection"
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">Description (Optional)</Label>
                  <Textarea
                    id="project-description"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project theme or goals..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="project-color">Color Theme</Label>
                  <Select value={newProject.color} onValueChange={(value) => setNewProject(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowProjectForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={!newProject.name?.trim()}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showEntryForm} onOpenChange={setShowEntryForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Throw
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Document New Throw</DialogTitle>
              </DialogHeader>
              <EntryForm 
                projects={projects}
                limits={limits}
                onSubmit={handleCreateEntry} 
                onCancel={() => setShowEntryForm(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects Overview */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl mb-4">Your Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium line-clamp-1">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{project.name}"? This will not delete your throws, but they will be unlinked from this project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                            Delete Project
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {project.throwCount}/{limits.maxThrowsPerProject} throws
                    </div>
                    <Badge 
                      variant={project.throwCount >= limits.maxThrowsPerProject ? 'destructive' : 'secondary'}
                    >
                      {project.throwCount >= limits.maxThrowsPerProject ? 'Full' : 'Active'}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((project.throwCount / limits.maxThrowsPerProject) * 100, 100)}%`,
                        backgroundColor: project.color
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search your throws..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span>{project.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="fired">Fired</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Entries Display */}
      {filteredEntries.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Palette className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-xl mb-2">
              {entries.length === 0 ? 'Start Your Pottery Journey' : 'No throws found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {entries.length === 0 
                ? 'Document your first throw and begin tracking your pottery progress.'
                : 'Try adjusting your search or filters to find your throws.'
              }
            </p>
            {entries.length === 0 && (
              <Button onClick={() => setShowEntryForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Throw
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              projects={projects}
              viewMode={viewMode}
              onEdit={() => setEditingEntry(entry)}
              onDelete={() => handleDeleteEntry(entry.id)}
            />
          ))}
        </div>
      )}

      {/* Edit Entry Dialog */}
      {editingEntry && (
        <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Throw</DialogTitle>
            </DialogHeader>
            <EntryForm
              initialEntry={editingEntry}
              projects={projects}
              limits={limits}
              onSubmit={(updatedData) => {
                const updatedEntry = { ...editingEntry, ...updatedData };
                setEntries(prev => prev.map(entry => 
                  entry.id === updatedEntry.id ? updatedEntry : entry
                ));
                setEditingEntry(null);
              }}
              onCancel={() => setEditingEntry(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}