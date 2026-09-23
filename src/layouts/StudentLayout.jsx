import { LayoutDashboard, GraduationCap, MessageSquare, User } from 'lucide-react'
import PortalLayout from './PortalLayout'

const NAV = [
  { to: '/student/dashboard', label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/courses',           label: 'Browse Courses', icon: GraduationCap   },
  { to: '/student/enquiries', label: 'My Enquiries',   icon: MessageSquare   },
  { to: '/student/profile',   label: 'Profile',        icon: User            },
]

export default function StudentLayout() {
  return <PortalLayout navItems={NAV} roleLabel="Student" />
}
