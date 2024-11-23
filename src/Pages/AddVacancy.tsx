'use client'

import {useEffect, useState} from 'react'
import {Button} from "@/Components/ui/button"
import {Input} from "@/Components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/Components/ui/select"
import {Switch} from "@/Components/ui/switch"
import {Label} from "@/Components/ui/label"
import {ArrowLeft, MinusCircle, PlusCircle} from 'lucide-react'
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {Textarea} from "@/Components/ui/textarea";
import axiosInstance from "@/lib/axiosInstance";

export default function AddVacancy() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        isRemote: false,
        isActive: true,
        jobType: '',
        seniorityLevel: '',
        salary: '',
        jobOverview: [''],
        city: '',
        country: '',
        description: '',
        countryCode: '',
        state: '',
        jobRole: [''],
        jobResponsibilities: [''],
        youHaveText: [''],
        requirements: ['']
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => {
            if (!prev) return prev;

            // Check if the field being changed is "country" or "countryCode"
            if (name === 'country' || name === 'countryCode') {
                // Update both "country" and "countryCode" together
                return {
                    ...prev,
                    country: countryMapping[value],
                    countryCode: value,
                };
            }

            // For other fields, update normally
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({...prev, [name]: checked}))
    }

    const handleArrayChange = (index: number, value: string, field: 'jobResponsibilities' | 'youHaveText' | 'requirements' | 'jobRole' | 'jobOverview') => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }))
    }

    const addArrayItem = (field: 'jobResponsibilities' | 'youHaveText' | 'requirements' | 'jobRole' | 'jobOverview') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }))
    }

    const removeArrayItem = (index: number, field: 'jobResponsibilities' | 'youHaveText' | 'requirements' | 'jobRole' | 'jobOverview') => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                categoryId: formData.categoryId,
                title: formData.title,
                isRemote: formData.isRemote,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                countryCode: formData.country,
                jobType: formData.jobType,
                description: formData.description,
                seniorityLevel: formData.seniorityLevel,
                salary: formData.salary ? parseFloat(formData.salary) : null,
                jobOverview: formData.jobOverview,
                jobRole: formData.jobRole,
                jobResponsibilities: formData.jobResponsibilities.filter((item) => item.trim() !== ''),
                youHaveText: formData.youHaveText.filter((item) => item.trim() !== ''),
                requirements: formData.requirements.filter((item) => item.trim() !== ''),
                isActive: formData.isActive,
            };

            // Make the POST request to the API
            const response = await axiosInstance.post('http://127.0.0.1:8000/api/vacancies', payload);

            // Check the response status
            if (response.status === 201) {
                console.log('Vacancy created successfully:', response.data);
                // Redirect to the vacancies list after successful submission
                navigate('/company/vacancies');
            } else {
                console.error('Failed to create vacancy:', response.data);
            }
        } catch (error) {
            console.error('Error while creating vacancy:', error);
        }
    };

    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/categories');
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const countryMapping: Record<string, string> = {
        US: 'United States',
        AZ: 'Azerbaijan',
        UK: 'United Kingdom',
        CA: 'Canada',
        AU: 'Australia',
        DE: 'Germany',
        FR: 'France',
        ES: 'Spain',
        IT: 'Italy',
        BR: 'Brazil',
        IN: 'India',
        JP: 'Japan',
        CN: 'China',
        RU: 'Russia',
        MX: 'Mexico',
        ZA: 'South Africa',
        AR: 'Argentina',
        NG: 'Nigeria',
        AE: 'United Arab Emirates',
        TR: 'Turkey',
        SA: 'Saudi Arabia',
        NL: 'Netherlands',
        SE: 'Sweden',
        CH: 'Switzerland',
        BE: 'Belgium',
        AT: 'Austria',
        DK: 'Denmark',
        FI: 'Finland',
        NO: 'Norway',
        PL: 'Poland',
        PT: 'Portugal',
        GR: 'Greece',
        IE: 'Ireland',
        SG: 'Singapore',
        MY: 'Malaysia',
        TH: 'Thailand',
        PH: 'Philippines',
        ID: 'Indonesia',
        NZ: 'New Zealand',
        KR: 'South Korea',
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center space-x-5">
                <Link to="/company/vacancies">
                    <Button variant="outline" className="px-3">
                        <ArrowLeft className="h-6 w-6"/>
                        <span className="sr-only">Back to Vacancies</span>
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Add New Vacancy</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <Select name="categoryId" onValueChange={(value) => handleSelectChange('categoryId', value)}
                                required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category"/>
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jobType">Job Type</Label>
                        <Select name="jobType" onValueChange={(value) => handleSelectChange('jobType', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select job type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="seniorityLevel">Seniority Level</Label>
                        <Select name="seniorityLevel"
                                onValueChange={(value) => handleSelectChange('seniorityLevel', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select seniority level"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="intern">Intern</SelectItem>
                                <SelectItem value="junior">Junior</SelectItem>
                                <SelectItem value="middle">Middle</SelectItem>
                                <SelectItem value="senior">Senior</SelectItem>
                                <SelectItem value="lead">Lead</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="salary">Salary (Optional)</Label>
                        <Input id="salary" name="salary" type="number" value={formData.salary}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select
                            name="country"
                            onValueChange={(value) => handleSelectChange('countryCode', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select country"/>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(countryMapping).map(([code, name]) => (
                                    <SelectItem key={code} value={code}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City (Optional)</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2 w-full">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required/>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Job Overview</Label>
                    {formData.jobOverview.map((overview, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Input
                                value={overview}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'jobOverview')}
                                required
                            />
                            <Button type="button" variant="ghost" size="icon"
                                    onClick={() => removeArrayItem(index, 'jobOverview')}>
                                <MinusCircle className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => addArrayItem('jobOverview')}>
                        <PlusCircle className="h-4 w-4 mr-2"/> Add Role
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>Job Role</Label>
                    {formData.jobRole.map((role, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Input
                                value={role}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'jobRole')}
                                required
                            />
                            <Button type="button" variant="ghost" size="icon"
                                    onClick={() => removeArrayItem(index, 'jobRole')}>
                                <MinusCircle className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => addArrayItem('jobRole')}>
                        <PlusCircle className="h-4 w-4 mr-2"/> Add Role
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>Job Responsibilities</Label>
                    {formData.jobResponsibilities.map((responsibility, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Input
                                value={responsibility}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'jobResponsibilities')}
                                required
                            />
                            <Button type="button" variant="ghost" size="icon"
                                    onClick={() => removeArrayItem(index, 'jobResponsibilities')}>
                                <MinusCircle className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => addArrayItem('jobResponsibilities')}>
                        <PlusCircle className="h-4 w-4 mr-2"/> Add Responsibility
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>You Have</Label>
                    {formData.youHaveText.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Input
                                value={item}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'youHaveText')}
                                required
                            />
                            <Button type="button" variant="ghost" size="icon"
                                    onClick={() => removeArrayItem(index, 'youHaveText')}>
                                <MinusCircle className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => addArrayItem('youHaveText')}>
                        <PlusCircle className="h-4 w-4 mr-2"/> Add "You Have" Item
                    </Button>
                </div>


                <div className="flex items-center space-x-2">
                    <Switch
                        id="isRemote"
                        checked={formData.isRemote}
                        onCheckedChange={(checked) => handleSwitchChange('isRemote', checked)}
                    />
                    <Label htmlFor="isRemote">Remote Position</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Active Vacancy</Label>
                </div>

                <Button type="submit" className="w-full">Create Vacancy</Button>
            </form>
        </div>
    )
}