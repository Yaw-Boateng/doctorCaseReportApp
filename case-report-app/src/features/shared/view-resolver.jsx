import { RegisterForm } from "../auth/components/register-form"
import { LoginForm } from "../auth/components/login-form"
import { ForgotPasswordForm } from "../auth/components/forgot-password-form"
import { AuthLayout } from "../auth/auth-layout"

import { AdminDashboard } from "../admin/admin-dashboard"
import { MemberManagement } from "../admin/member-management"

import { DoctorManagement } from "../workers/doctor-management"
import { LogCaseManagement } from "../workers/log-case-management"

import { ManagerDashboard } from "../managers/manager-dashboard"


export function ViewResolver({ currentView }) {
  switch (currentView) {
    // Auth Views
    case "Register":
      return <AuthLayout title="Register Account"><RegisterForm /></AuthLayout>
    case "Login":
      return <AuthLayout title="Portal Login"><LoginForm /></AuthLayout>
    case "Forgot Password":
      return <AuthLayout title="Reset Credentials"><ForgotPasswordForm /></AuthLayout>

    // Admin Views
    case "Admin Dashboard":
      return <AdminDashboard />
    case "Member Management":
      return <MemberManagement />

    // Workers Views
    case "Doctor Management":
      return <DoctorManagement />
    case "Log Case Management":
      return <LogCaseManagement />

    // Managers Views
    case "Manager Dashboard":
      return <ManagerDashboard />
    

    default:
      return <div className="text-muted-foreground">Select a module view configuration option.</div>
  }
}