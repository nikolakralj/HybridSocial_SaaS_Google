// Phase 5 M5.1: Projects API
// API functions for creating and managing collaborative projects

import { Project, ProjectMember, ProjectRole } from '../../types/collaboration';

/**
 * Create a new project
 */
export async function createProject(
  data: Partial<Project>,
  members: Partial<ProjectMember>[]
): Promise<{ project: Project; members: ProjectMember[] }> {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: data, members }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Get all projects for the current user
 */
export async function getUserProjects(
  userId?: string
): Promise<Project[]> {
  try {
    const url = userId ? `/api/projects?userId=${userId}` : '/api/projects';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Get a specific project by ID
 */
export async function getProject(
  projectId: string
): Promise<Project> {
  try {
    const response = await fetch(`/api/projects/${projectId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

/**
 * Update project details
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Project>
): Promise<Project> {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

/**
 * Delete a project (owner only)
 */
export async function deleteProject(
  projectId: string
): Promise<void> {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

/**
 * Get project members
 */
export async function getProjectMembers(
  projectId: string
): Promise<ProjectMember[]> {
  try {
    const response = await fetch(`/api/projects/${projectId}/members`);

    if (!response.ok) {
      throw new Error(`Failed to fetch members: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
}

/**
 * Add a member to a project
 */
export async function addProjectMember(
  projectId: string,
  member: Partial<ProjectMember>
): Promise<ProjectMember> {
  try {
    const response = await fetch(`/api/projects/${projectId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });

    if (!response.ok) {
      throw new Error(`Failed to add member: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
}

/**
 * Update a member's role
 */
export async function updateMemberRole(
  projectId: string,
  memberId: string,
  role: ProjectRole
): Promise<ProjectMember> {
  try {
    const response = await fetch(`/api/projects/${projectId}/members/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update member role: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating member role:', error);
    throw error;
  }
}

/**
 * Remove a member from a project
 */
export async function removeProjectMember(
  projectId: string,
  memberId: string
): Promise<void> {
  try {
    const response = await fetch(`/api/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to remove member: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
}

/**
 * Get user's role in a project
 */
export async function getUserProjectRole(
  projectId: string,
  userId: string
): Promise<ProjectRole | null> {
  try {
    const response = await fetch(`/api/projects/${projectId}/members/${userId}/role`);

    if (response.status === 404) {
      return null; // User not a member
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch user role: ${response.statusText}`);
    }

    const data = await response.json();
    return data.role;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
}

/**
 * MOCK IMPLEMENTATIONS FOR DEVELOPMENT
 * Replace these with real API calls when backend is ready
 */

let mockProjects: (Project & { members: ProjectMember[] })[] = [];
let mockNextId = 1;

// Initialize with some sample projects for testing
function initializeMockProjects() {
  if (mockProjects.length > 0) return; // Already initialized
  
  const now = new Date().toISOString();
  const currentUserId = 'current-user-id';
  
  // Sample project 1: Demo Project (for visual-builder route)
  mockProjects.push({
    id: 'demo-project-1',
    name: 'Demo Project - Visual Builder',
    description: 'Demo project for testing the visual builder',
    region: 'US',
    currency: 'USD',
    startDate: now,
    workWeek: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    ownerId: currentUserId,
    createdAt: now,
    updatedAt: now,
    members: [
      {
        id: 'member-demo-1',
        projectId: 'demo-project-1',
        userId: currentUserId,
        userName: 'Current User',
        userEmail: 'current@example.com',
        role: 'Owner',
        invitedBy: currentUserId,
        invitedAt: now,
        acceptedAt: now,
      },
    ],
  });
  
  // Sample project 2: Mobile App Redesign
  mockProjects.push({
    id: 'project-demo-1',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of the mobile application',
    region: 'US',
    currency: 'USD',
    startDate: now,
    workWeek: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    ownerId: currentUserId,
    createdAt: now,
    updatedAt: now,
    members: [
      {
        id: 'member-demo-2',
        projectId: 'project-demo-1',
        userId: currentUserId,
        userName: 'Current User',
        userEmail: 'current@example.com',
        role: 'Owner',
        invitedBy: currentUserId,
        invitedAt: now,
        acceptedAt: now,
      },
    ],
  });
  
  // Sample project 3: E-commerce Platform
  mockProjects.push({
    id: 'project-demo-2',
    name: 'E-commerce Platform',
    description: 'New e-commerce platform with advanced features',
    region: 'US',
    currency: 'USD',
    startDate: now,
    workWeek: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    ownerId: currentUserId,
    createdAt: now,
    updatedAt: now,
    members: [
      {
        id: 'member-demo-3',
        projectId: 'project-demo-2',
        userId: currentUserId,
        userName: 'Current User',
        userEmail: 'current@example.com',
        role: 'Owner',
        invitedBy: currentUserId,
        invitedAt: now,
        acceptedAt: now,
      },
    ],
  });
  
  mockNextId = 100; // Start user-created projects from 100
}

/**
 * Mock: Create project
 */
export async function createProjectMock(
  data: Partial<Project>,
  members: Partial<ProjectMember>[]
): Promise<{ project: Project; members: ProjectMember[] }> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  const now = new Date().toISOString();
  const currentUserId = 'current-user-id'; // TODO: Get from auth context

  const newProject: Project = {
    id: `project-${mockNextId++}`,
    name: data.name || 'Untitled Project',
    description: data.description,
    region: data.region || 'US',
    currency: data.currency || 'USD',
    startDate: data.startDate || now,
    endDate: data.endDate,
    workWeek: data.workWeek || {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    ownerId: currentUserId,
    createdAt: now,
    updatedAt: now,
  };

  // Add owner as first member
  const projectMembers: ProjectMember[] = [
    {
      id: `member-${mockNextId++}`,
      projectId: newProject.id,
      userId: currentUserId,
      userName: 'Current User',
      userEmail: 'current@example.com',
      role: 'Owner',
      invitedBy: currentUserId,
      invitedAt: now,
      acceptedAt: now,
    },
  ];

  // Add additional members
  members.forEach(m => {
    projectMembers.push({
      id: `member-${mockNextId++}`,
      projectId: newProject.id,
      userId: m.userId || `user-${mockNextId}`,
      userName: m.userName,
      userEmail: m.userEmail || '',
      role: m.role || 'Viewer',
      invitedBy: currentUserId,
      invitedAt: now,
      acceptedAt: m.acceptedAt,
    });
  });

  mockProjects.push({ ...newProject, members: projectMembers });

  return {
    project: newProject,
    members: projectMembers,
  };
}

/**
 * Mock: Get user projects
 */
export async function getUserProjectsMock(userId?: string): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  initializeMockProjects(); // Ensure sample data exists
  
  // Return all projects (in real implementation, filter by userId)
  return mockProjects.map(p => {
    const { members, ...project } = p;
    return project;
  });
}

/**
 * Mock: Get project
 */
export async function getProjectMock(projectId: string): Promise<Project> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  initializeMockProjects(); // Ensure sample data exists
  
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  
  const { members, ...projectData } = project;
  return projectData;
}

/**
 * Mock: Get project members
 */
export async function getProjectMembersMock(projectId: string): Promise<ProjectMember[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  initializeMockProjects(); // Ensure sample data exists
  
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  
  return project.members;
}

/**
 * Mock: Get user's role in project
 */
export async function getUserProjectRoleMock(
  projectId: string,
  userId: string
): Promise<ProjectRole | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) return null;
  
  const member = project.members.find(m => m.userId === userId);
  return member?.role || null;
}

// For development, export mock versions as default
export const dev = {
  createProject: createProjectMock,
  getUserProjects: getUserProjectsMock,
  getProject: getProjectMock,
  getProjectMembers: getProjectMembersMock,
  getUserProjectRole: getUserProjectRoleMock,
};
