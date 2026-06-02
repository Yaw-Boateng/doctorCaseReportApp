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


## File Structure 
case-report-app/
├── src/
│   ├── components/
│   │   ├── ui/                 # Shared base layout primitives (shadcn)
│   │   │   ├── button.jsx
│   │   │   └── dropdown-menu.jsx
│   │   ├── theme-provider.jsx  # Context manager for light/dark mode
│   │   └── theme-toggle.jsx    # UI Button to change themes
│   ├── features/
│   │   ├── auth/               # AUTHENTICATION
│   │   │   ├── components/register-form.jsx, login-form.jsx, forgot-password-form.jsx
│   │   │   └── auth-layout.jsx
│   │   ├── admin/              # ADMIN FEATURES
│   │   │   ├── member-management.jsx
│   │   │   └── admin-dashboard.jsx
│   │   ├── workers/            # WORKERS FEATURES
│   │   │   ├── doctor-management.jsx
│   │   │   └── log-case-management.jsx
│   │   └── managers/           # MANAGERS FEATURES
│   │   │   ├── manager-dashboard.jsx
│   │   │   ├── test-dashboard.jsx
│   │   │   ├── finance-dashboard.jsx
│   │   │   └── doctor-dashboard.jsx
│   │   └── shared/             # Layout architectures
│   │       └── dashboard-sidebar.jsx 
│   │       └── view-resolver.jsx 
│   ├── lib/
│   │   └── utils.js            # Classname merger utility
│   ├── App.jsx                 # Routing and feature coordination
│   ├── index.css               # Main Tailwind v4 directive & Dark Mode variables
│   └── main.jsx