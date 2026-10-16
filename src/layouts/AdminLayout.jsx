import { LayoutDashboard, Users, BookOpen, BarChart2, Activity, Mail, Settings, GraduationCap, Megaphone } from 'lucide-react'
import PortalLayout from './PortalLayout'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/staff',     label: 'Staff',     icon: Users           },
  { to: '/admin/students',   label: 'Students',  icon: GraduationCap   },
  { to: '/admin/courses',   label: 'Courses',   icon: BookOpen        },
  { to: '/admin/reports',   label: 'Reports',   icon: BarChart2       },
  { to: '/admin/activity',  label: 'Activity',  icon: Activity        },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/messages',  label: 'Messages',  icon: Mail            },
  { to: '/admin/settings',  label: 'Settings',  icon: Settings        },
]

export default function AdminLayout() {
  return <PortalLayout navItems={NAV} roleLabel="Administrator" />
}
