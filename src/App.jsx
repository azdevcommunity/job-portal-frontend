import {Route, Routes, useLocation} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Startups from './Pages/Startups';
import Jobs from './Pages/Jobs';
import BrowseSturtups from './Pages/BrowseSturtups';
import SeekFunding from './Pages/SeekFunding';
import Footer from './Components/Footer';
import JobDetails from './Components/Find-Jobs/JobDetails';
import Investor from './Pages/Investor';
import Company from './Pages/Company';
import Blog from './Pages/Blog';
import BlogDetail from './Components/Blog/BlogDetail';
import Contact from './Pages/Contact';
import Login from '@/Pages/Login.tsx';
import './App.css';
import CompanyDashboard from "@/Pages/CompanyDashboard.tsx";
import VacanciesPage from "@/Pages/VacanciesPage.tsx";
import DashboardLayout from "@/Layouts/DashboardLayout.jsx";
import PublicRoute from "@/PublicRoute.tsx";
import ProtectedRoute from "@/ProtectedRoute.tsx";
import AddVacancy from "@/Pages/AddVacancy.tsx";
import VacancyView from "@/Pages/VacancyView.tsx";
import VacancyEdit from "@/Pages/VacancyEdit.tsx";
import ApplicantList from "@/Pages/ApplicantList.tsx";
import Register from "@/Pages/Register.tsx";
import {IndustryPage} from "@/Pages/Admin/IndustryPage.tsx";
import AdminDashboardLayout from "@/Pages/Admin/AdminDashboardLayout.tsx";
import {CategoryPage} from "@/Pages/Admin/CategoryPage.tsx";
import VacanciesPageAdmin from "@/Pages/Admin/VacancyPageAdmin.tsx";
import VacancyViewAdmin from "@/Pages/Admin/VacancyViewAdmin.tsx";
import VacancyEditAdmin from "@/Pages/Admin/VacancyEditAdmin.tsx";
import CompaniesPage from "@/Pages/Admin/CompaniesPage.tsx";
import BlogPage from "@/Pages/Admin/BlogPage.tsx";
import BlogEditPage from "@/Pages/Admin/BlogEditPage.tsx";

const App = () => {
    const location = useLocation();

    // List of paths where Navbar and Footer should NOT be displayed
    const hideNavbarAndFooter = ['/login', '/register', '/company', '/admin'];

    return (
        <div className='main'>
            {/* Conditionally render Navbar */}
            {!hideNavbarAndFooter.some((path) => location.pathname.startsWith(path)) && <Navbar/>}

            <Routes>
                <Route path="/" element={<PublicRoute><Home/></PublicRoute>}/>
                <Route path="/investor" element={<PublicRoute><Investor/></PublicRoute>}/>
                <Route path="/startups" element={<PublicRoute><Startups/></PublicRoute>}/>
                <Route path="/jobs" element={<PublicRoute><Jobs/></PublicRoute>}/>
                <Route path="/browsestartups" element={<PublicRoute><BrowseSturtups/></PublicRoute>}/>
                <Route path="/seekfunding" element={<PublicRoute><SeekFunding/></PublicRoute>}/>
                <Route path="/companies" element={<PublicRoute><Company/></PublicRoute>}/>
                <Route path="/blog" element={<PublicRoute><Blog/></PublicRoute>}/>
                <Route path="/contact" element={<PublicRoute><Contact/></PublicRoute>}/>
                <Route path="/job/:id" element={<PublicRoute><JobDetails/></PublicRoute>}/>
                <Route path="/blog/:id" element={<PublicRoute><BlogDetail/></PublicRoute>}/>

                {/* Public Routes */}
                <Route path="/login" element={
                    <PublicRoute>
                        <Login/>
                    </PublicRoute>
                }/>
                <Route path="/register" element={
                    <PublicRoute>
                        <Register/>
                    </PublicRoute>
                }/>

                {/* Protected Routes */}
                <Route path="/company/*" element={
                    <ProtectedRoute roles={['company']}>
                        <DashboardLayout/>
                    </ProtectedRoute>
                }>
                    <Route path="vacancies" element={<VacanciesPage/>}/>
                    <Route path="applications" element={<ApplicantList/>}/>
                    <Route path="dashboard" element={<CompanyDashboard/>}/>
                    <Route path="vacancies/add" element={<AddVacancy/>}/>
                    <Route path="vacancies/:vacancyId" element={<VacancyView/>}/>
                    <Route path="vacancies/edit/:vacancyId" element={<VacancyEdit/>}/>
                </Route>

                <Route path="/admin/*" element={
                    <ProtectedRoute roles={['admin']}>
                        <AdminDashboardLayout/>
                    </ProtectedRoute>
                }>
                    <Route path="industries" element={<IndustryPage/>}/>
                    <Route path="categories" element={<CategoryPage/>}/>
                    <Route path="vacancies" element={<VacanciesPageAdmin/>}/>
                    <Route path="blog" element={<BlogPage/>}/>
                    <Route path="blogs/edit/:id" element={<BlogEditPage/>}/>
                    <Route path="companies" element={<CompaniesPage/>}/>
                    <Route path="vacancies/:vacancyId" element={<VacancyViewAdmin/>}/>
                    <Route path="vacancies/:vacancyId/edit" element={<VacancyEditAdmin/>}/>
                </Route>

            </Routes>

            {/* Conditionally render Footer */}
            {!hideNavbarAndFooter.some((path) => location.pathname.startsWith(path)) && <Footer/>}
        </div>
    );
};

export default App;