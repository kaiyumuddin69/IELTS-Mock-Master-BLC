import { Outlet, useLocation } from 'react-router';
import { Wifi, Bell, Menu } from 'lucide-react';
import { ReadingNavigation } from './ReadingNavigation';

export function ReadingLayout() {
  const location = useLocation();
  
  // Determine current part based on route
  const getCurrentPart = () => {
    if (location.pathname.includes('part1')) return 1;
    if (location.pathname.includes('part2')) return 2;
    if (location.pathname.includes('part3')) return 3;
    return 1;
  };

  const currentPart = getCurrentPart();

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Footer Navigation */}
      <ReadingNavigation currentPart={currentPart} />
    </div>
  );
}
