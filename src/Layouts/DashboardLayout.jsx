import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/Components/ui/sidebar";
import {DynamicSidebar} from "@/Components/DynamicSidebar.tsx";
import {Briefcase, FileText, User} from "lucide-react";

const DashboardLayout = () => {

    const sidebarItems = [
        {name: 'Profile', icon: User, path: '/company/dashboard'},
        {name: 'Vacancies', icon: Briefcase, path: '/company/vacancies'},
        {name: 'Applications', icon: FileText, path: '/company/applications'},
    ]

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <DynamicSidebar sidebarItems={sidebarItems}/>
                <main className="flex-1 w-0">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;