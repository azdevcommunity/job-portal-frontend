'use client'

import {useState, useEffect} from 'react'
import {Switch} from "@/Components/ui/switch"
import {Label} from "@/Components/ui/label"
import {Card, CardContent} from "@/Components/ui/card"
import axiosInstance from "@/lib/axiosInstance";

interface Company {
    id: number
    user_id: number
    name: string
    email: string
    startup_stage: string | null
    startup_size: string | null
    open_to_remote: string
    funding: string
    industry_id: number
    logo: string
    is_blocked: number
    description: string
    created_at: string
    updated_at: string
}

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([])

    useEffect(() => {
        fetchCompanies()
    }, [])

    const fetchCompanies = async () => {
        const res = await axiosInstance.get('http://127.0.0.1:8000/api/admin/companies')
        if (!res.status) {
            throw new Error('Failed to fetch companies')
        }
        const data = await res.data
        setCompanies(data)
    }

    const handleStatusChange = async (company: Company, checked: boolean) => {
        const action = checked ? 'unblock' : 'block'
        const response = await axiosInstance.post(`http://127.0.0.1:8000/api/admin/companies/${company.id}/${action}`)
        if (!response.status) {
            throw new Error('Failed to update company status')
        }
        setCompanies(companies.map(c =>
            c.id === company.id ? {...c, is_blocked: checked ? 0 : 1} : c
        ))
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Company List</h1>
            <div className="space-y-4">
                {companies.map(company => (
                    <Card key={company.id}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <h2 className="text-lg font-semibold">{company.name}</h2>
                                <p className="text-sm text-gray-500">{company.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`company-status-${company.id}`}
                                    checked={company.is_blocked === 0}
                                    onCheckedChange={(checked) => handleStatusChange(company, checked)}
                                />
                                <Label htmlFor={`company-status-${company.id}`}>
                                    {company.is_blocked === 0 ? 'Active' : 'Blocked'}
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}