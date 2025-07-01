import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './components/loginpage/LoginPage'
import AdminRoute from './routes/AdminRoute'
import MaverickRoute from './routes/MaverickRoute'
import AdminDashboard from './components/admin-dashboard/AdminDashboard'
import MaverickDashboard from './components/maverick-dashboard/MaverickDashboard'
import AdminDashboardHome from "./pages/AdminDashboard-home/AdminDashboardHome"
import AdminDashboardMavericks from './pages/AdminDashboard-mavericks/AdminDashboardMavericks'
import AdminDashboardBatches from './pages/AdminDashboard-batches/AdminDashboardBatches'
import AdminDashboardLearningPaths from './pages/AdminDashboard-learningPath/AdminDashboardLearningPath'
import AdminDashboardOnlineContent from './pages/AdminDashboard-onlineContent/AdminDashboardOnlineContent'
import AdminDashboardOfflineContent from './pages/AdminDashboard-offlineContent/AdminDashboardOfflineContent'
import AdminDashboardProgress from './pages/AdminDashboard-progress/AdminDashboardProgress'
import AdminDashboardReports from './pages/AdminDashboard-reports/AdminDashboardReports'
import AdminDashboardAdminTools from './pages/AdminDashboard-adminTools/AdminDashboardAdminTools'
import CreateBatchWithLearningPath from './components/createBatch/CreateBatchWithLearningPath'
import ImportMavericks from './components/import-maverick/ImportMaverick'
import BatchList from './components/batchList/BatchList'
import AssignMavericks from './components/assign-mavericks/AssignMavericks'
import ActivityScreen from './pages/MavericksDashboard-activityScreen/ActivityScreen'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
        {/* These will appear inside <Outlet /> */}
        <Route index element={<AdminDashboardHome />} /> {/* default route */}
        <Route path="mavericks" element={<AdminDashboardMavericks />} />
        <Route path="batches" element={<AdminDashboardBatches />} />
        <Route path="learning-paths" element={<AdminDashboardLearningPaths />} />
        <Route path="online-content" element={<AdminDashboardOnlineContent />} />
        <Route path="offline-content" element={<AdminDashboardOfflineContent />} />
        <Route path="progress" element={<AdminDashboardProgress />} />
        <Route path="reports" element={<AdminDashboardReports />} />
        <Route path="admin-tools" element={<AdminDashboardAdminTools />} />
      </Route>

      <Route path="/admin-dashboard/mavericks/import" element={<AdminRoute><ImportMavericks /></AdminRoute>} />
      <Route path="/admin-dashboard/batches/add" element={<AdminRoute><CreateBatchWithLearningPath /></AdminRoute>}/>
      <Route path="/admin-dashboard/batches/all" element={<AdminRoute><BatchList /></AdminRoute>}/>
      <Route path="/admin-dashboard/batch/assign-mavericks" element={<AdminRoute><AssignMavericks /></AdminRoute>}/>

      <Route path="/maverick-dashboard" element={<MaverickRoute><MaverickDashboard /></MaverickRoute>}/>
      <Route path="/maverick-dashboard/activity" element={<ActivityScreen />}/>

    </Routes>
  );
}

export default App
