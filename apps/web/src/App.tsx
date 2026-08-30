import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './layout/Shell';
import { BriefPage } from './pages/BriefPage';
import { HomePage } from './pages/HomePage';
import { PageDetailPage } from './pages/PageDetailPage';
import { PagesPage } from './pages/PagesPage';
import { SearchPage } from './pages/SearchPage';
import { WorkItemPage } from './pages/WorkItemPage';
import { EmptyState } from './ui/States';

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/items/:key" element={<WorkItemPage />} />
          <Route path="/items/:key/brief" element={<BriefPage />} />
          <Route path="/pages" element={<PagesPage />} />
          <Route path="/pages/:id" element={<PageDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/missing"
            element={
              <EmptyState text="This work item or page does not exist." />
            }
          />
          <Route path="*" element={<Navigate to="/missing" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
