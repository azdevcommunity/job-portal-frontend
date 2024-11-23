'use client'

import React, {useContext} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {Briefcase, FileText, LogOut, Menu, User} from 'lucide-react'

import {Button} from "@/Components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/Components/ui/sidebar"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/Components/ui/tooltip"
import {Sheet, SheetContent, SheetTrigger} from "@/Components/ui/sheet"
import {AuthContext} from "@/AuthContext";

function SidebarContents({sidebarItems}: {
    sidebarItems: Array<{ name: string; icon: React.ElementType; path: string; count?: number }>
}) {
    const location = useLocation()
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();


    return (
        <>
            <SidebarHeader className="flex items-center justify-between p-4">
                <h2 className="text-lg font-semibold transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">Dashboard</h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {sidebarItems.map((item) => (
                        <SidebarMenuItem key={item.name} className="px-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.path}
                                        className="group relative flex items-center gap-x-3 rounded-md py-2 text-sm font-medium transition-colors hover:bg-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                                    >
                                        <Link to={item.path} className="flex items-center w-full">
                                            <item.icon className="h-5 w-5 flex-shrink-0"/>
                                            <span className="group-data-[collapsible=icon]:hidden ml-2 flex-grow">
                                                {item.name}
                                            </span>
                                            {item.count && (
                                                <SidebarMenuBadge
                                                    className="ml-auto bg-primary/10 text-primary group-data-[collapsible=icon]:hidden">
                                                    {item.count}
                                                </SidebarMenuBadge>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="flex items-center gap-2"
                                >
                                    {item.name}
                                    {item.count && (
                                        <span
                                            className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1 text-xs font-medium text-primary">
                                            {item.count}
                                        </span>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SidebarMenuButton
                            onClick={() => {
                                logout()
                                navigate("/")
                            }}
                            className="w-full group relative flex items-center gap-x-3 rounded-md py-2 text-sm font-medium transition-colors hover:bg-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0"/>
                            <span className="group-data-[collapsible=icon]:hidden ml-2 flex-grow">
                                Logout
                            </span>
                        </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Logout
                    </TooltipContent>
                </Tooltip>
            </SidebarFooter>
        </>
    )
}

const sidebarItems = [
    {name: 'Profile', icon: User, path: '/company/dashboard'},
    {name: 'Vacancies', icon: Briefcase, path: '/company/vacancies'},
    {name: 'Applications', icon: FileText, path: '/company/applications'},
]

type SidebarMenu = {
    name:string;
    icon: React.ElementType;
    path: string;
}

interface DynamicSidebarProps {
    sidebarItems:SidebarMenu[]
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({sidebarItems})  => {
    const {open, setOpen, isMobile} = useSidebar()

    return (
        <TooltipProvider delayDuration={0}>
            <div className="relative h-screen">
                {isMobile ? (
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="fixed left-1 top-3 z-50 rounded-full hover:bg-accent"
                            >
                                <Menu className="h-5 w-5"/>
                                <span className="sr-only">Toggle sidebar</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[300px]">
                            <SidebarContents sidebarItems={sidebarItems}/>
                        </SheetContent>
                    </Sheet>
                ) : (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="fixed left-1 top-3 z-50 rounded-full hover:bg-accent"
                            onClick={() => setOpen(!open)}
                        >
                            <Menu className="h-5 w-5"/>
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>
                        <Sidebar
                            collapsible="icon"
                            className="border-r bg-background/60 backdrop-blur-xl transition-all duration-300"
                        >
                            <SidebarContents sidebarItems={sidebarItems}/>
                        </Sidebar>
                    </>
                )}
            </div>
        </TooltipProvider>
    )
}