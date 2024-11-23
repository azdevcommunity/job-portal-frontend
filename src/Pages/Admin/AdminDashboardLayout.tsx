import React from 'react';
import {Outlet} from 'react-router-dom';
import {SidebarProvider} from "@/Components/ui/sidebar";
import {DynamicSidebar} from "@/Components/DynamicSidebar";
import {Briefcase, ChartColumnStacked, Factory, FileText, Rss} from "lucide-react";

const AdminDashboardLayout = () => {

    const sidebarItems = [
        {name: 'Industries', icon: Factory, path: '/admin/industries'},
        {name: 'Vacancies', icon: Briefcase, path: '/admin/vacancies'},
        {name: 'Categories', icon: ChartColumnStacked, path: '/admin/categories'},
        {name: 'Companies', icon: FileText, path: '/admin/companies'},
        {name: 'Blogs', icon: Rss, path: '/admin/blogs'},
    ]

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <DynamicSidebar sidebarItems={sidebarItems}/>
                <main className="flex-1 w-0">
                    <Outlet/>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default AdminDashboardLayout;