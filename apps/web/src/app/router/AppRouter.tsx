import { Route, Routes } from 'react-router'

import { RootLayout } from '@/app/layouts/RootLayout'
import { HomePage } from '@/pages/home/HomePage'
import { LearningPathPage } from '@/pages/learning-path/LearningPathPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { ModulePage } from '@/pages/module/ModulePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { RegisterPage } from '@/pages/register/RegisterPage'
import { TechnologyPage } from '@/pages/technology/TechnologyPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="learning-paths/:slug" element={<LearningPathPage />} />
        <Route
          path="technologies/:technologySlug/modules/:moduleSlug"
          element={<ModulePage />}
        />
        <Route path="technologies/:slug" element={<TechnologyPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
