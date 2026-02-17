import { authClient } from '@/lib/jwt-client';

// Define the base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Define types for our task objects
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  user_id: number;
}

// Custom error class for API errors
export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

// Define the API service object
export const taskApi = {
  // Get all tasks for a user
  getTasks: async (userId: number): Promise<Task[]> => {
    try {
      const response = await authClient.secureFetch(`/api/${userId}/tasks/`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `Failed to fetch tasks: ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return data.tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred while fetching tasks', 500);
    }
  },

  // Create a new task
  createTask: async (userId: number, taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    tags?: string[];
  }): Promise<Task> => {
    try {
      const response = await authClient.secureFetch(`/api/${userId}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          priority: taskData.priority || 'medium',
          tags: taskData.tags || []
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `Failed to create task: ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred while creating task', 500);
    }
  },

  // Update a task
  updateTask: async (userId: number, taskId: number, taskData: Partial<Task>): Promise<Task> => {
    try {
      const response = await authClient.secureFetch(`/api/${userId}/tasks/${taskId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `Failed to update task: ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred while updating task', 500);
    }
  },

  // Toggle task completion
  toggleTaskCompletion: async (userId: number, taskId: number, completed: boolean): Promise<Task> => {
    try {
      // Send the PATCH request to toggle completion status directly
      const response = await authClient.secureFetch(`/api/${userId}/tasks/${taskId}/complete/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `Failed to toggle task completion: ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling task completion:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred while toggling task completion', 500);
    }
  },

  // Delete a task
  deleteTask: async (userId: number, taskId: number): Promise<void> => {
    try {
      const response = await authClient.secureFetch(`/api/${userId}/tasks/${taskId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `Failed to delete task: ${response.status}`,
          response.status,
          errorData
        );
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred while deleting task', 500);
    }
  },
};