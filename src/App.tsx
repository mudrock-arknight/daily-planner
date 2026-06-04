import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, CheckCircle2, ListTodo, BarChart3, Target } from 'lucide-react'
import HomePage from './pages/HomePage'
import CheckinPage from './pages/CheckinPage'
import TodoPage from './pages/TodoPage'
import SchedulePage from './pages/SchedulePage'
import StatsPage from './pages/StatsPage'
import WeeklyPlanPage from './pages/WeeklyPlanPage'
import ErrorBoundary from './components/ErrorBoundary'

function Navbar() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: '计划' },
    { path: '/checkin', icon: CheckCircle2, label: '打卡' },
    { path: '/todo', icon: ListTodo, label: '待办' },
    { path: '/weekly', icon: Target, label: '周计划' },
    { path: '/stats', icon: BarChart3, label: '统计' },
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          // 处理路径匹配，适配 basename
          let isActive = false
          if (item.path === '/') {
            isActive = location.pathname === '/' || location.pathname === ''
          } else {
            isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router basename="/daily-planner">
      <div className="min-h-screen bg-gray-50 pb-20">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkin" element={<CheckinPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/weekly" element={<WeeklyPlanPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </ErrorBoundary>
        <Navbar />
      </div>
    </Router>
  );
}

export default App
