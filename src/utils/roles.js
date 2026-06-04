export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff'
}

export const ROLE_LABELS = {
  admin: 'Administrator',
  manager: 'Manager',
  staff: 'Staff'
}

export const ROLE_HIERARCHY = {
  admin: 3,
  manager: 2,
  staff: 1
}

export const PERMISSIONS = {
  admin: [
    'manage_staff',
    'manage_inventory',
    'manage_vehicles',
    'view_billing',
    'manage_billing',
    'view_reports',
    'manage_reports',
    'view_members',
    'manage_members',
    'view_notifications',
    'manage_notifications',
    'view_history',
    'manage_settings'
  ],
  manager: [
    'manage_inventory',
    'manage_vehicles',
    'view_billing',
    'view_reports',
    'view_members',
    'view_notifications',
    'view_history'
  ],
  staff: [
    'view_inventory',
    'view_vehicles',
    'view_billing',
    'view_notifications',
    'view_history'
  ]
}

export const hasPermission = (role, permission) => {
  if (!role || !PERMISSIONS[role]) return false
  return PERMISSIONS[role].includes(permission) || PERMISSIONS[role].includes('all')
}

export const hasMinRole = (userRole, requiredRole) => {
  if (!userRole || !ROLE_HIERARCHY[userRole]) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}
