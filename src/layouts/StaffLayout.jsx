import { LayoutDashboard, MessageSquare, BookOpen, BarChart2, User } from 'lucide-react'
import PortalLayout from './PortalLayout'

const NAV = [
  { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff/enquiries', label: 'Enquiries', icon: MessageSquare   },
  { to: '/staff/courses',   label: 'Courses',   icon: BookOpen        },
  { to: '/staff/reports',   label: 'Reports',   icon: BarChart2       },
  { to: '/staff/profile',   label: 'Profile',   icon: User            },
]

export default function StaffLayout() {
  return <PortalLayout navItems={NAV} roleLabel="Academic Staff" />
}
