// Role-based access control configuration
// In production, this would be stored in a database

export type Role = 'super_admin' | 'admin' | 'editor' | 'viewer'

export interface User {
  id: string
  username: string
  email: string
  name: string
  role: Role
  department?: string
  // Password would be hashed in production
  passwordHash: string
}

export interface Permission {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canPublish: boolean
  canManageUsers: boolean
  canViewAnalytics: boolean
  departments?: string[] // If specified, limits access to these departments
}

// Role permission mappings
export const rolePermissions: Record<Role, Permission> = {
  super_admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canManageUsers: true,
    canViewAnalytics: true,
  },
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canManageUsers: false,
    canViewAnalytics: true,
  },
  editor: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
    canViewAnalytics: false,
  },
  viewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
    canViewAnalytics: true,
  },
}

// Demo users - In production, use a database with hashed passwords
// These passwords are for demonstration only
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@cityofsolvang.com',
    name: 'City Administrator',
    role: 'super_admin',
    passwordHash: 'Solvang2026!', // Demo only - use bcrypt in production
  },
  {
    id: '2',
    username: 'cityclerk',
    email: 'cityclerk@cityofsolvang.com',
    name: 'City Clerk',
    role: 'admin',
    department: 'City Clerk',
    passwordHash: 'Clerk2026!',
  },
  {
    id: '3',
    username: 'editor',
    email: 'editor@cityofsolvang.com',
    name: 'Content Editor',
    role: 'editor',
    passwordHash: 'Editor2026!',
  },
  {
    id: '4',
    username: 'viewer',
    email: 'viewer@cityofsolvang.com',
    name: 'Staff Viewer',
    role: 'viewer',
    passwordHash: 'Viewer2026!',
  },
]

// Helper functions
export function getUserByUsername(username: string): User | undefined {
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase())
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id)
}

export function verifyPassword(user: User, password: string): boolean {
  // In production, use bcrypt.compare()
  return user.passwordHash === password
}

export function getPermissions(role: Role): Permission {
  return rolePermissions[role]
}

export function hasPermission(role: Role, permission: keyof Permission): boolean {
  const permissions = rolePermissions[role]
  const value = permissions[permission]
  return typeof value === 'boolean' ? value : false
}

// Session data structure
export interface SessionData {
  userId: string
  username: string
  name: string
  email: string
  role: Role
  permissions: Permission
}

export function createSessionData(user: User): SessionData {
  return {
    userId: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: getPermissions(user.role),
  }
}

// Role display names
export const roleDisplayNames: Record<Role, string> = {
  super_admin: 'Super Administrator',
  admin: 'Administrator',
  editor: 'Content Editor',
  viewer: 'Viewer',
}
