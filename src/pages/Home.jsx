import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

export default function Home() {
  const [activeTab, setActiveTab] = useState('board');
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Redesign the company website for better user experience',
      progress: 65,
      dueDate: '2023-12-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Create a mobile application for our customers',
      progress: 32,
      dueDate: '2024-01-30',
      status: 'active'
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      description: 'Q1 Marketing Campaign for product launch',
      progress: 15,
      dueDate: '2024-02-28',
      status: 'planning'
    }
  ]);

  const handleProjectSelect = (projectId) => {
    // In a full implementation, this would navigate to a project detail page
    // or update the view to show the selected project
    toast.info(`Viewing project details - ID: ${projectId}`);
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
            onClick={() => toast.success("Project creation would open here!")}
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
          <p className="text-3xl font-bold mt-2">3</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">2 active, 1 planning</p>
        </div>
        
        <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-secondary/20 dark:to-secondary/10 border border-secondary/20">
          <h3 className="text-lg font-semibold text-secondary-dark dark:text-secondary-light">Tasks</h3>
          <p className="text-3xl font-bold mt-2">24</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">8 completed, 16 in progress</p>
        </div>
        
        <div className="card bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 border border-accent/20">
          <h3 className="text-lg font-semibold text-accent dark:text-accent">Upcoming Deadlines</h3>
          <p className="text-3xl font-bold mt-2">5</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Next: Website Redesign (3 days)</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200">Team Members</h3>
          <p className="text-3xl font-bold mt-2">7</p>
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

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-surface-50">Recent Projects</h2>
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
                Due: {new Date(project.dueDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}