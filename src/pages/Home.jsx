import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { getProjects, createProject } from '../services/projectService';
import { useSelector } from 'react-redux';

export default function Home() {
  const [activeTab, setActiveTab] = useState('board');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    planningProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    teamMembers: 7
  });
  
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      
      // Update statistics
      const activeProjects = data.filter(p => p.status === 'active').length;
      const planningProjects = data.filter(p => p.status === 'planning').length;
      
      setStats({
        totalProjects: data.length,
        activeProjects,
        planningProjects,
        totalTasks: 24, // This would come from a separate call in a full implementation
        completedTasks: 8,
        upcomingDeadlines: 5,
        teamMembers: 7
      });
    } catch (error) {
      toast.error("Error loading projects");
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (projectId) => {
    // In a full implementation, this would navigate to a project detail page
    // or update the view to show the selected project
    toast.info(`Viewing project details - ID: ${projectId}`);
  };

  const handleCreateProject = async () => {
    try {
      // In a full implementation, this would open a modal with a form
      // For now, we'll create a project with default values
      const newProject = {
        name: `New Project ${Math.floor(Math.random() * 1000)}`,
        description: 'Project description goes here',
        progress: 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        status: 'planning'
      };
      
      const createdProject = await createProject(newProject);
      
      // Update the projects list
      setProjects([createdProject, ...projects]);
      
      // Update statistics
      setStats(prev => ({
        ...prev,
        totalProjects: prev.totalProjects + 1,
        planningProjects: prev.planningProjects + 1
      }));
      
      toast.success("Project created successfully!");
    } catch (error) {
      toast.error("Error creating project");
    }
  };

  const LayoutGridIcon = getIcon('LayoutGrid');
  const CalendarIcon = getIcon('Calendar');
  const BarChartIcon = getIcon('BarChart3');
  const SettingsIcon = getIcon('Settings2');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50">Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Manage your projects and tasks</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            className="btn btn-primary" 
            onClick={handleCreateProject}
          >
            <svg 
              className="w-5 h-5 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20">
          <h3 className="text-lg font-semibold text-primary-dark dark:text-primary-light">Total Projects</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalProjects}</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{stats.activeProjects} active, {stats.planningProjects} planning</p>
        </div>
        
        <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-secondary/20 dark:to-secondary/10 border border-secondary/20">
          <h3 className="text-lg font-semibold text-secondary-dark dark:text-secondary-light">Tasks</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalTasks}</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{stats.completedTasks} completed, {stats.totalTasks - stats.completedTasks} in progress</p>
        </div>
        
        <div className="card bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 border border-accent/20">
          <h3 className="text-lg font-semibold text-accent dark:text-accent">Upcoming Deadlines</h3>
          <p className="text-3xl font-bold mt-2">{stats.upcomingDeadlines}</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Next: Website Redesign (3 days)</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200">Team Members</h3>
          <p className="text-3xl font-bold mt-2">{stats.teamMembers}</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">5 active this week</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card mb-8 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-surface-200 dark:border-surface-700">
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'board' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'}`}
            onClick={() => setActiveTab('board')}
          >
            <div className="flex items-center">
              <LayoutGridIcon className="w-4 h-4 mr-1.5" />
              <span>Board</span>
            </div>
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'calendar' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'}`}
            onClick={() => setActiveTab('calendar')}
          >
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1.5" />
              <span>Calendar</span>
            </div>
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'reports' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'}`}
            onClick={() => setActiveTab('reports')}
          >
            <div className="flex items-center">
              <BarChartIcon className="w-4 h-4 mr-1.5" />
              <span>Reports</span>
            </div>
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'settings' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'}`}
            onClick={() => setActiveTab('settings')}
          >
            <div className="flex items-center">
              <SettingsIcon className="w-4 h-4 mr-1.5" />
              <span>Settings</span>
            </div>
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'board' && (
            <MainFeature />
          )}
          
          {activeTab === 'calendar' && (
            <div className="text-center py-10">
              <div className="bg-surface-100 dark:bg-surface-700 inline-flex rounded-full p-3 mb-4">
                <CalendarIcon className="w-6 h-6 text-surface-500" />
              </div>
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200">Calendar View</h3>
              <p className="text-surface-500 dark:text-surface-400 max-w-sm mx-auto mt-2">
                The calendar view will show deadlines, milestones, and scheduled meetings.
              </p>
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="text-center py-10">
              <div className="bg-surface-100 dark:bg-surface-700 inline-flex rounded-full p-3 mb-4">
                <BarChartIcon className="w-6 h-6 text-surface-500" />
              </div>
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200">Reports View</h3>
              <p className="text-surface-500 dark:text-surface-400 max-w-sm mx-auto mt-2">
                Project performance metrics and analytics will be displayed here.
              </p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="text-center py-10">
              <div className="bg-surface-100 dark:bg-surface-700 inline-flex rounded-full p-3 mb-4">
                <SettingsIcon className="w-6 h-6 text-surface-500" />
              </div>
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200">Settings View</h3>
              <p className="text-surface-500 dark:text-surface-400 max-w-sm mx-auto mt-2">
                Configure project preferences, notifications, and team permissions.
              </p>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-surface-50">
            Recent Projects {projects.length > 0 ? `(${projects.length})` : ''}
          </h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-surface-800 rounded-xl shadow-card">
              <div className="bg-surface-100 dark:bg-surface-700 inline-flex rounded-full p-3 mb-4">
                <svg className="w-6 h-6 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200">No projects yet</h3>
              <p className="text-surface-500 dark:text-surface-400 max-w-sm mx-auto mt-2">
                Click the "New Project" button to create your first project.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="card cursor-pointer hover:shadow-soft"
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-surface-900 dark:text-surface-50">{project.name}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      project.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {project.status === 'active' ? 'Active' : 'Planning'}
                    </span>
                  </div>
                  <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-surface-600 dark:text-surface-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs text-surface-500 dark:text-surface-400 mt-4">
                    Due: {new Date(project.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
  );
}