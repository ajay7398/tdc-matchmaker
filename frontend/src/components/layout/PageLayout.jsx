// src/components/layout/PageLayout.jsx
// Wraps every dashboard page with Sidebar + main content area.
import Sidebar from "./Sidebar.jsx";

const PageLayout = ({ children }) => (
  <div className="flex min-h-screen bg-cream-50">
    <Sidebar />
    <main className="flex-1 overflow-auto">
      {children}
    </main>
  </div>
);

export default PageLayout;
