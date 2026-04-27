import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import StudentLayout from './layouts/StudentLayout'
import StaffLayout from './layouts/StaffLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/public/Home/Home'
import Courses from './pages/public/Courses'
import CourseDetail from './pages/public/CourseDetail'
import Login from './pages/public/Login'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import Blog from './pages/public/Blog'
import BlogPost from './pages/public/BlogPost'

import StudentDashboard from './pages/student/Dashboard'
import StudentEnquiries from './pages/student/Enquiries'
import NewEnquiry from './pages/student/NewEnquiry'
import EnquiryDetail from './pages/student/EnquiryDetail'
import StudentProfile from './pages/student/Profile'

import StaffDashboard from './pages/staff/Dashboard'
import StaffEnquiries from './pages/staff/Enquiries'
import StaffEnquiryDetail from './pages/staff/EnquiryDetail'
import StaffCourses from './pages/staff/Courses'
import StaffReports from './pages/staff/Reports'
import StaffProfile from './pages/staff/Profile'

import AdminDashboard from './pages/admin/Dashboard'
import AdminStaff from './pages/admin/Staff'
import AdminCourses from './pages/admin/Courses'
import AdminReports from './pages/admin/Reports'
import AdminActivity from './pages/admin/Activity'
import AdminSettings from './pages/admin/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
          </Route>

          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="enquiries" element={<StudentEnquiries />} />
            <Route path="enquiries/new" element={<NewEnquiry />} />
            <Route path="enquiries/:id" element={<EnquiryDetail />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="enquiries" element={<StaffEnquiries />} />
            <Route path="enquiries/:id" element={<StaffEnquiryDetail />} />
            <Route path="courses" element={<StaffCourses />} />
            <Route path="reports" element={<StaffReports />} />
            <Route path="profile" element={<StaffProfile />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="activity" element={<AdminActivity />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
