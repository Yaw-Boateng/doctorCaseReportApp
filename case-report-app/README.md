# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Terminal Setup (Branching)

1. Check your progress
   git status
   To see exactly what files you altered. You should see your new layout files listed in red text under Untracked files.

2. Add files to the staging deck
   git add .
   Tell Git you want to include all these changes in your next checkpoint package:

3. Take a localized snapshot (Commit)
   git commit -m "chore: scaffold base router configuration and folder structural blueprint"
   Seal the package with a precise, descriptive message:

4. Ship the branch up to GitHub
   git push -u origin feature/initial-setup
   Push this subbranch online so it can be seen on your remote profile:

5. Cleanup Routine
   git checkout main
   git pull origin main


## FILE STRUCTURE
case-report-app/
├── src/
│   ├── asserts/
│   │   ├── hero.png 
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── ui/                         # Shared base layout primitives (shadcn)
│   │   │   ├── button.jsx
│   │   │   ├── loader.jsx
│   │   │   ├── mobile-menu.jsx
│   │   │   └── dropdown-menu.jsx
│   │   │   └── confirm-delete-modal.jsx
│   │   │   └── pagination-wrapper.jsx
│   │   ├── theme-context.jsx 
│   │   ├── theme-provider.jsx          # Context manager for light/dark mode
│   │   ├── theme-toggle.jsx            # UI Button to change themes
│   │   └── use-theme.jsx
│   ├── features/
│   │   ├── auth/                       # AUTHENTICATION MODULE
│   │   │   ├── components/
│   │   │   │   ├── register-form.jsx
│   │   │   │   ├── login-form.jsx
│   │   │   │   ├── forgot-password-form.jsx
│   │   │   │   ├── otp-form.jsx         # Verification View
│   │   │   │   ├── reset-password-form.jsx # New Password Form View
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── context/
│   │   │   │   ├── auth-context.jsx
│   │   │   │   └── use-auth.jsx
│   │   │   └── auth-layout.jsx
│   │   ├── admin/  
│   │   │   ├── hooks/                  
│   │   │   │   └── useAdminDashboard.js                # ADMIN FEATURES
│   │   │   ├── workers-management.jsx
│   │   │   └── admin-dashboard.jsx
│   │   │   └── workers-details.jsx
│   │   ├── workers/                    # WORKERS FEATURES
│   │   │   ├── doctor-management.jsx
│   │   │   └── log-case-management.jsx
│   │   ├── managers/                   # MANAGERS FEATURES
│   │   │   └── manager-dashboard.jsx
│   │   └── shared/                     # Layout architectures
│   │       ├── dashboard-sidebar.jsx
│   │       └── DashboardLayout.jsx
│   ├── lib/
│   │   ├── api.js                      # axios clients and interceptors (with ngrok patches)
│   │   ├── auth.js                     # Updated API helpers mapping endpoints
│   │   └── utils.js                    # Classname merger utility
│   ├── App.jsx                         # Updated Global Application Router mapping
│   ├── index.css                       # Main Tailwind v4 directive & Dark Mode variables
│   └── main.jsx

## Append a beautifully styled, scrollable shadcn-themed audit log table right under your user metrics display.

## The Complete Git Lifecycle

# Step 1: Work on your Feature Branch & Commit Changes
1. Check the status of your changed files
git status
2. Stage all your changes
git add .
3. Commit your changes with a descriptive message
git commit -m "feat: implement responsive layout for case management platform"

# Step 2: Push your Branch to the Remote Server
- Push your local branch to the remote repository (origin)
- Use -u (upstream) the first time so Git remembers the connection
1. git push -u origin feature/case-portal-ui

# Step 3: Create, Approve, and Merge the Pull Request

Once pushed, you switch from your terminal to your repository platform (like GitHub):
- Open the PR: Go to your repository page on GitHub. You will see a yellow banner saying "feature/case-portal-ui had recent pushes". Click "Compare & pull request".
- Configure: Set the base branch to main and the compare branch to feature/case-portal-ui. Add a description of your changes and click "Create pull request".
- Get Approval: Send the PR link to your teammate.

      # What they do: They click "Files changed", review your code, click "Review changes", select "Approve", and submit.

- Merge: Once you see the green checkmark showing it's approved, click the green "Merge pull request" button (or "Squash and merge"), then click "Confirm merge".

## Step 4: Sync your Local Machine & Clean Up
1. Switch back to your local main branch
git checkout main
2. Pull the newly merged changes from the cloud down to your machine
git pull origin main
3. Delete your old local feature branch safely (since it's already merged)
git branch -d feature/case-portal-ui
4. Optional: Delete the branch from the remote server if GitHub didn't do it automatically
git push origin --delete feature/case-portal-ui

## Step 5: Create a New Branch for your Next Task
- Create and instantly switch to your next branch
1. git checkout -b feature/new-analytics-dashboard

# What if my teammate updated main while I was still working on my feature branch?
# Before you push your branch, run these commands to pull their updates into your branch so you can resolve any conflicts locally:

1. git checkout main
2. git pull origin main
3. git checkout feature/case-portal-ui
4. git merge main