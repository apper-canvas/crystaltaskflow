import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../services/taskService';
import { useSelector } from 'react-redux';

export default function MainFeature() {
  const { isAuthenticated } = useSelector((state) => state.user);

  // Task statuses
  const columns = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'todo', title: 'To Do' },
    { id: 'inProgress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' }
  ];

  // State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error("Error loading tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // New task form state
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    assignee: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  });
  
  // Task details state
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  // Drag and drop logic
  const [draggingTask, setDraggingTask] = useState(null);
  const dragOverColumnId = useRef(null);

  // Icons
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const CheckCircleIcon = getIcon('CheckCircle');
  const AlertCircleIcon = getIcon('AlertCircle');
  const EditIcon = getIcon('Edit2');
  const TrashIcon = getIcon('Trash2');
  
  // Get tasks for a specific column
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Handle opening the new task form
  const handleNewTaskClick = () => {
    setShowNewTaskForm(true);
  };

  // Update new task form fields
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new task
  const handleNewTaskSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    try {
      // Create task in database
      const createdTask = await createTask(newTask);
      
      // Add new task to the UI list
      setTasks(prev => [createdTask, ...prev]);
      setShowNewTaskForm(false);
      
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
      return;
    }
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      status: 'backlog',
      priority: 'medium',
      assignee: {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
    });
    toast.success("Task created successfully!");
  };

  // Handle task click to show details
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  // Handle task status change (drag and drop implementation)
  const handleDragStart = (task) => {
    setDraggingTask(task);
  };
  
  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    dragOverColumnId.current = columnId;
  };
  
  const handleDrop = async (e) => {
    e.preventDefault();
    
    if (!draggingTask || !dragOverColumnId.current) return;
    
    // Only update if status actually changed
    if (draggingTask.status === dragOverColumnId.current) {
      setDraggingTask(null);
      return;
    }

    try {
      // Optimistically update UI
      const updatedTasks = tasks.map(task => 
        task.id === draggingTask.id 
          ? { ...task, status: dragOverColumnId.current }
          : task
      );
      
      setTasks(updatedTasks);
      toast.info(`Task moved to ${columns.find(col => col.id === dragOverColumnId.current).title}`);
      setDraggingTask(null);
      
      // Update in database
      await updateTaskStatus(draggingTask.id, dragOverColumnId.current);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task. Please try again.");
      // Revert the UI change
      fetchTasks();
    }
  };

  // Delete task
  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    try {
      // Optimistically update UI
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      setShowTaskDetails(false);
      
      // Delete from database
      await deleteTask(selectedTask.id);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
      // Refresh task list on error
      fetchTasks();
    }
  };

  // Get color for priority badge
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'high': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get icon for priority
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return AlertCircleIcon;
      case 'high': return AlertCircleIcon;
      case 'medium': return getIcon('AlertTriangle');
      case 'low': return CheckCircleIcon;
      default: return getIcon('Circle');
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50">Task Board</h2>
        <button
          onClick={handleNewTaskClick}
          className="btn btn-primary text-sm"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Task
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4 overflow-x-auto ${loading ? 'opacity-50' : ''}`}>
        {columns.map(column => (
          <div 
            key={column.id}
            className="min-w-[250px] bg-surface-100 dark:bg-surface-700/50 rounded-lg p-3"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={handleDrop}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-surface-800 dark:text-surface-200">{column.title}</h3>
              <span className="bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-300 text-xs px-2 py-1 rounded-full">
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            
            <div className="space-y-2 min-h-[100px]">
              {getTasksByStatus(column.id).length === 0 && (
                <div className="flex items-center justify-center h-20 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg">
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {column.id === 'backlog' ? (
                      'Add a new task to get started'
                    ) : (
                      'Drag tasks here'
                    )}
                  </p>
                </div>
              )}
              <AnimatePresence mode="popLayout">
                {getTasksByStatus(column.id).map(task => {
                  const PriorityIcon = getPriorityIcon(task.priority);
                  
                  return (
                    <motion.div
                      key={task.id}
                      layoutId={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className={`task-card priority-${task.priority}`}
                      onClick={() => handleTaskClick(task)}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-surface-800 dark:text-surface-200 text-sm">
                          {task.title}
                        </h4>
                        <div 
                          className={`flex items-center space-x-1 rounded-full px-2 py-0.5 text-xs ${getPriorityColor(task.priority)}`}
                        >
                          <PriorityIcon className="w-3 h-3" />
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      </div>
                      <p className="text-surface-600 dark:text-surface-400 text-xs mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img 
                            src={task.assignee.avatar} 
                            alt={task.assignee.name} 
                            className="w-6 h-6 rounded-full"
                          />
                        </div>
                        <span className="text-xs text-surface-600 dark:text-surface-400 ml-2">
                          {task.assignee.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* New Task Form Modal */}
      <AnimatePresence>
        {showNewTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewTaskForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                  Create New Task
                </h3>
                <button 
                  onClick={() => setShowNewTaskForm(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleNewTaskSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newTask.title}
                      onChange={handleNewTaskChange}
                      className="input"
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newTask.description}
                      onChange={handleNewTaskChange}
                      rows="3"
                      className="input"
                      placeholder="Enter task description"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={newTask.status}
                        onChange={handleNewTaskChange}
                        className="input"
                      >
                        <option value="backlog">Backlog</option>
                        <option value="todo">To Do</option>
                        <option value="inProgress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={newTask.priority}
                        onChange={handleNewTaskChange}
                        className="input"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Assignee
                    </label>
                    <select
                      id="assignee"
                      name="assigneeId"
                      value={newTask.assignee.id}
                      onChange={(e) => {
                        const id = e.target.value;
                        const assigneeOptions = [
                          { id: '1', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
                          { id: '2', name: 'Michael Johnson', avatar: 'https://i.pravatar.cc/150?img=2' },
                          { id: '3', name: 'Emma Smith', avatar: 'https://i.pravatar.cc/150?img=3' },
                          { id: '4', name: 'Alex Turner', avatar: 'https://i.pravatar.cc/150?img=4' },
                          { id: '5', name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?img=5' }
                        ];
                        const selected = assigneeOptions.find(assignee => assignee.id === id);
                        setNewTask(prev => ({
                          ...prev,
                          assignee: selected
                        }));
                      }}
                      className="input"
                    >
                      <option value="1">Sarah Chen</option>
                      <option value="2">Michael Johnson</option>
                      <option value="3">Emma Smith</option>
                      <option value="4">Alex Turner</option>
                      <option value="5">James Wilson</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewTaskForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Details Modal */}
      <AnimatePresence>
        {showTaskDetails && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTaskDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    selectedTask.priority === 'low' ? 'bg-green-500' :
                    selectedTask.priority === 'medium' ? 'bg-blue-500' :
                    selectedTask.priority === 'high' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                    Task Details
                  </h3>
                </div>
                <button 
                  onClick={() => setShowTaskDetails(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-surface-900 dark:text-surface-50 mb-2">
                    {selectedTask.title}
                  </h4>
                  <p className="text-surface-600 dark:text-surface-400">
                    {selectedTask.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className={`text-xs rounded-full px-3 py-1 ${getPriorityColor(selectedTask.priority)}`}>
                    <span className="capitalize">{selectedTask.priority} Priority</span>
                  </div>
                  
                  <div className="text-xs bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-200 rounded-full px-3 py-1">
                    <span className="capitalize">Status: {
                      columns.find(col => col.id === selectedTask.status)?.title || selectedTask.status
                    }</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-surface-200 dark:border-surface-700">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Assignee</span>
                  <div className="flex items-center mt-2">
                    <img 
                      src={selectedTask.assignee.avatar} 
                      alt={selectedTask.assignee.name} 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="ml-2 text-surface-800 dark:text-surface-200">
                      {selectedTask.assignee.name}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-surface-200 dark:border-surface-700">
                  <button 
                    onClick={() => {
                      setShowTaskDetails(false);
                      // In a complete app, this would open the edit task form
                      toast.info("Edit task functionality would open here");
                    }}
                    className="btn btn-outline py-1.5 text-sm"
                  >
                    <EditIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  
                  <button 
                    onClick={handleDeleteTask}
                    className="btn py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}