import {
  Moon,
  Sun,
  LayoutGrid,
  Calendar,
  BarChart3,
  Settings2,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Circle,
  Edit2,
  Trash2,
  User,
  LogOut
} from 'lucide-react';

// Map of icon names to their components
const iconMap = {
  Moon,
  Sun,
  LayoutGrid,
  Calendar,
  BarChart3,
  Settings2,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Circle,
  Edit2,
  Trash2,
  User,
  LogOut
};

// Function to get an icon component by name
export const getIcon = (name) => iconMap[name] || null;