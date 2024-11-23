'use client'

import { useEffect, useState } from 'react'
import { Calendar, ChevronRight, Download, FileText, Filter, Linkedin, Mail, Phone, Send, X } from 'lucide-react'
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Badge } from "@/Components/ui/badge"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Link } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Progress } from "@/Components/ui/progress"
import Cookies from "js-cookie"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/Components/ui/toaster"
import axiosInstance from "@/lib/axiosInstance";

type Application = {
    id: number
    vacancy_id: number
    first_name: string
    email: string
    phone: string
    status: string
    job_title: string
    linkedin: string
    cv_link: string | null
    created_at: string
    updated_at: string
}

type ApiResponse = {
    current_page: number
    data: Application[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: { url: string | null; label: string; active: boolean }[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
}

const status: Record<string, string> = {
    'submitted': 'Submitted',
    'reviewed': 'Reviewed',
    'interview': 'Interview',
    'offer': 'Offer',
}

type FilterOption = 'Newest' | 'Oldest' | 'Submitted' | 'Reviewed' | 'Interview' | 'Offer'

export default function ApplicationList() {
    const [applications, setApplications] = useState<Application[]>([])
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterOption, setFilterOption] = useState<FilterOption>('Newest')
    const [isMobileDetailView, setIsMobileDetailView] = useState(false)

    useEffect(() => {
        fetchApplications()
    }, [filterOption, searchTerm])

    const fetchApplications = async () => {
        try {
            let url = '/applications?'
            const params = new URLSearchParams()

            if (filterOption === 'Newest' || filterOption === 'Oldest') {
                params.append('sort_order', filterOption === 'Newest' ? 'desc' : 'asc')
            } else {
                params.append('status', filterOption.toLowerCase())
            }

            if (searchTerm) {
                params.append('search', searchTerm)
            }

            url += params.toString()

            const response = await axiosInstance.get(url)

            const data: ApiResponse = await response.data
            setApplications(data.data)
            if (data.data.length > 0) {
                setSelectedApplication(data.data[0])
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleFilterChange = (option: FilterOption) => {
        setFilterOption(option)
    }

    const handleApplicationSelect = (application: Application) => {
        setSelectedApplication(application)
        setIsMobileDetailView(true)
    }

    const handleStatusChange = async (newStatus: string) => {
        if (selectedApplication) {
            try {
                const response = await axiosInstance.put(`applications/${selectedApplication.id}`, {
                    body: JSON.stringify({ status: newStatus })
                })

                if (!response.status) {
                    throw new Error('Failed to update application status')
                }

                setSelectedApplication({ ...selectedApplication, status: newStatus })
                setApplications(prevApplications =>
                    prevApplications.map(app =>
                        app.id === selectedApplication.id ? { ...app, status: newStatus } : app
                    )
                )

                toast({
                    title: "Status Updated",
                    description: `Application status changed to ${status[newStatus]}`,
                })
            } catch (error) {
                console.error('Error updating application status:', error)
                toast({
                    title: "Error",
                    description: "Failed to update application status. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    const getStageProgress = (status: string) => {
        const stages = ['submitted', 'reviewed', 'interview', 'offer']
        const index = stages.indexOf(status)
        return ((index + 1) / stages.length) * 100
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className={`w-full md:w-1/3 p-6 overflow-hidden flex flex-col ${isMobileDetailView ? 'hidden md:flex' : 'flex'}`}>
                <div className="mb-6 flex items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full rounded-full"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleFilterChange('Newest')}>Newest</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFilterChange('Oldest')}>Oldest</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFilterChange('Submitted')}>Submitted</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFilterChange('Reviewed')}>Reviewed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFilterChange('Interview')}>Interview</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFilterChange('Offer')}>Offer</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <ScrollArea className="flex-grow">
                    <div className="space-y-4 pr-4">
                        {applications.map(application => (
                            <Card
                                key={application.id}
                                className={`cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md ${selectedApplication?.id === application.id ? 'border-primary shadow-md' : ''}`}
                                onClick={() => handleApplicationSelect(application)}
                            >
                                <CardContent className="p-4 flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage src={`/placeholder.svg?height=128&width=128`} alt={application.first_name} />
                                        <AvatarFallback>{application.first_name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{application.first_name}</h3>
                                        <p className="text-sm text-gray-600">{application.email}</p>
                                        <p className="text-sm text-gray-600">{application.job_title}</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className={`w-full md:w-2/3 p-6 bg-white md:rounded-l-3xl shadow-xl overflow-hidden ${isMobileDetailView ? 'flex' : 'hidden md:block'}`}>
                {selectedApplication && (
                    <div className="h-full flex flex-col w-full">
                        <div className="sticky top-0 bg-white z-10 pb-4 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={`/placeholder.svg?height=128&width=128`} alt={selectedApplication.first_name} />
                                    <AvatarFallback>{selectedApplication.first_name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedApplication.first_name}</h2>
                                    <Badge variant="outline" className="mb-2">{status[selectedApplication.status]}</Badge>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMobileDetailView(false)}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-grow">
                            <div className="space-y-6">
                                <Card className="bg-gray-50">
                                    <CardHeader>
                                        <CardTitle>Application Timeline</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Progress value={getStageProgress(selectedApplication.status)} className="w-full" />
                                        <div className="flex justify-between mt-2 text-sm">
                                            <span>Submitted</span>
                                            <span>Reviewed</span>
                                            <span>Interview</span>
                                            <span>Offer</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Personal Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-5 w-5 text-gray-500" />
                                                <span>{selectedApplication.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-5 w-5 text-gray-500" />
                                                <span>{selectedApplication.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Linkedin className="h-5 w-5 text-gray-500" />
                                                <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    LinkedIn Profile
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Application Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p><strong>Job Title:</strong> {selectedApplication.job_title}</p>
                                            <p>
                                                <strong>Vacancy ID:</strong>{' '}
                                                <Link to={`/company/vacancies/${selectedApplication.vacancy_id}`} className="text-blue-600 hover:underline">
                                                    {selectedApplication.vacancy_id}
                                                </Link>
                                            </p>
                                            <p><strong>Applied on:</strong> {new Date(selectedApplication.created_at).toLocaleDateString()}</p>
                                            {selectedApplication.cv_link && (
                                                <div className="flex flex-wrap gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={`http://127.0.0.1:8000/storage/${selectedApplication.cv_link}`} target="_blank" rel="noopener noreferrer">
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            View CV
                                                        </a>
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={`http://127.0.0.1:8000/storage/${selectedApplication.cv_link}`} download>
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Download CV
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Select onValueChange={handleStatusChange}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Update Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="submitted">Submitted</SelectItem>
                                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                                    <SelectItem value="interview">Interview</SelectItem>
                                                    <SelectItem value="offer">Offer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button variant="outline">
                                                <Send className="h-4 w-4 mr-2" />
                                                Email Applicant
                                            </Button>
                                            <Button variant="outline">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Schedule Interview
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </div>
            <Toaster />
        </div>
    )
}