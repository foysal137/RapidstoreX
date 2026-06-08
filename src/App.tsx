import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { createContext, useState, useContext } from 'react';
import Home from './pages/Home';
import AppDetails from './pages/AppDetails';
import Collection from './pages/Collection';
import AllCollections from './pages/AllCollections';
import { CategoryPage, ProfilePage } from './pages/ExtraPages';
import AppsPage from './pages/AppsPage';
import GamesPage from './pages/GamesPage';
import NewsPage from './pages/NewsPage';
import NewsDetail from './pages/NewsDetail';
import BrowsePage from './pages/BrowsePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminPanel from './pages/AdminPanel';
import InfoPage from './pages/InfoPage';
import { Home as HomeIcon, LayoutGrid, Gamepad2, Flame, Skull, Search } from 'lucide-react';

const ThemeContext = createContext({ isDarkMode: false, toggleDarkMode: () => {} });
export const useTheme = () => useContext(ThemeContext);

function BottomNav() {
  const navItems = [
    { label: 'Home', icon: HomeIcon, path: '/' },
    { label: 'Apps', icon: LayoutGrid, path: '/apps' },
    { label: 'Games', icon: Gamepad2, path: '/games' },
    { label: 'News', icon: Flame, path: '/news' },
    { label: 'Browse', icon: Search, path: '/browse' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex md:hidden items-center justify-around py-3 px-2 z-[60] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => (
        <NavLink 
          key={item.label}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-lite scale-110' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <BrowserRouter>
        <div className={`${isDarkMode ? 'dark' : ''} bg-[#f2f4f1] dark:bg-slate-900 min-h-screen font-sans`}>
          <div className="mx-auto min-h-screen shadow-2xl relative overflow-hidden flex flex-col max-w-7xl w-full bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apps" element={<AppsPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/browse" element={<BrowsePage />} />
              
              <Route path="/collections" element={<AllCollections />} />
              <Route path="/collection/:id" element={<Collection />} />
              <Route path="/app/:id" element={<AppDetails />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/cp-page0" element={<AdminPanel />} />
              <Route path="/info/:slug" element={<InfoPage />} />
            </Routes>
            <BottomNav />
          </div>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}
