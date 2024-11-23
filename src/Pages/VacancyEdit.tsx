'use client'

import {useEffect, useState} from 'react'
import {ArrowLeft, MinusCircle, PlusCircle} from 'lucide-react'
import {Button} from "@/Components/ui/button"
import {Input} from "@/Components/ui/input"
import {Textarea} from "@/Components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/Components/ui/select"
import {Switch} from "@/Components/ui/switch"
import {Label} from "@/Components/ui/label"
import {Card, CardContent, CardHeader, CardTitle} from "@/Components/ui/card"
import {Link, useNavigate, useParams} from 'react-router-dom'
import {useToast} from "@/hooks/use-toast";
import {Toaster} from "@/Components/ui/toaster"
import axiosInstance from "@/lib/axiosInstance";


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

type Vacancy = {
    id: number;
    title: string;
    categoryId: string;
    isRemote: boolean;
    isActive: boolean;
    jobType: string;
    seniorityLevel: string;
    city: string;
    state: string;
    country: string;
    description: string;
    countryCode: string;
    salary: number;
    jobOverview: string;
    jobRole: string;
    jobResponsibilities: string[];
    youHaveText: string[];
};

export default function VacancyEdit() {
    const {vacancyId} = useParams();
    const navigate = useNavigate();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const {toast} = useToast()


    useEffect(() => {
        if (!vacancyId) {
            console.warn('vacancyId is missing.');
            return;
        }

        const fetchVacancy = async () => {
            try {
                const response = await axiosInstance.get<Vacancy>(`http://127.0.0.1:8000/api/companies/vacancies/${vacancyId}`);
                setVacancy(response.data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch vacancy details. Please try again.",
                    variant: "destructive",
                });
            }
        };

        fetchVacancy();
    }, [vacancyId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVacancy((prev) => prev ? { ...prev, [name]: value } : prev);
    };

    const handleSelectChange = (name: string, value: string) => {
        setVacancy((prev) => {
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
        setVacancy((prev) => {
            if (!prev) return prev;
            return {...prev, [name]: checked};
        });
    };

    const handleArrayChange = (index: number, value: string, field: 'jobResponsibilities' | 'youHaveText') => {
        setVacancy((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: prev[field].map((item, i) => (i === index ? value : item)),
            };
        });
    };

    const addArrayItem = (field: 'jobResponsibilities' | 'youHaveText') => {
        setVacancy((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: [...prev[field], ''],
            };
        });
    };

    const removeArrayItem = (index: number, field: 'jobResponsibilities' | 'youHaveText') => {
        setVacancy((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index),
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!vacancy || !vacancyId) {
            toast({
                title: "Error",
                description: "Invalid vacancy data. Please try again.",
                variant: "destructive",

            })
            return
        }

        try {
            const updatedData = {
                title: vacancy.title,
                categoryId: vacancy.categoryId,
                isRemote: vacancy.isRemote,
                isActive: vacancy.isActive,
                jobType: vacancy.jobType,
                seniorityLevel: vacancy.seniorityLevel,
                city: vacancy.city,
                description: vacancy.description,
                state: vacancy.state,
                country: vacancy.country,
                countryCode: vacancy.countryCode,
                salary: vacancy.salary,
                jobOverview: vacancy.jobOverview,
                jobRole: vacancy.jobRole,
                jobResponsibilities: vacancy.jobResponsibilities,
                youHaveText: vacancy.youHaveText,
            };

            const response = await axiosInstance.put(
                `http://127.0.0.1:8000/api/vacancies/${vacancyId}`, JSON.stringify(updatedData)
            );

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Vacancy updated successfully.",
                })
                navigate(`/company/vacancies/${vacancyId}`)
            }
        } catch (error) {
            console.error('Failed to update vacancy:', error);
            toast({
                title: "Error",
                description: "Failed to update vacancy. Please try again.",
                variant: "destructive",
            })
        }
    };

    const [categories, setCategories] = useState([]);

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

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <Link to={`/company/vacancies`}>
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <ArrowLeft className="h-6 w-6 mr-2"/>
                        <span>Back to Vacancy</span>
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Vacancy</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vacancy Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={vacancy?.title} onChange={handleInputChange}
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="categoryId">Category</Label>
                                <Select name="categoryId" value={vacancy?.categoryId}
                                        onValueChange={(value) => handleSelectChange('categoryId', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => {
                                            return (<SelectItem  key={category.id} value={category.id.toString()}>{category.name}</SelectItem>)
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobType">Job Type</Label>
                                <Select name="jobType" value={vacancy?.jobType}
                                        onValueChange={(value) => handleSelectChange('jobType', value)}>
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
                                <Select name="seniorityLevel" value={vacancy?.seniorityLevel}
                                        onValueChange={(value) => handleSelectChange('seniorityLevel', value)}>
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
                                <Label htmlFor="salary">Salary</Label>
                                <Input id="salary" name="salary" type="number" value={vacancy?.salary}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Select
                                    name="country"
                                    value={vacancy?.countryCode}
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
                                <Input id="state" name="state" value={vacancy?.state} onChange={handleInputChange}
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" value={vacancy?.city} onChange={handleInputChange}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" value={vacancy?.description}
                                          onChange={handleInputChange}/>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jobOverview">Job Overview</Label>
                            <Textarea id="jobOverview" name="jobOverview" value={vacancy?.jobOverview}
                                      onChange={handleInputChange} required/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jobRole">Job Role</Label>
                            <Textarea id="jobRole" name="jobRole" value={vacancy?.jobRole} onChange={handleInputChange}
                                      required/>
                        </div>

                        <div className="space-y-2">
                            <Label>Job Responsibilities</Label>
                            {vacancy?.jobResponsibilities.map((responsibility, index) => (
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
                            {vacancy?.youHaveText.map((item, index) => (
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
                                checked={vacancy?.isRemote}
                                onCheckedChange={(checked) => handleSwitchChange('isRemote', checked)}
                            />
                            <Label htmlFor="isRemote">Remote Position</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isActive"
                                checked={vacancy?.isActive}
                                onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                            />
                            <Label htmlFor="isActive">Active Vacancy</Label>
                        </div>


                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline"
                                    onClick={() => navigate("/company/vacancies")}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
                <Toaster/>
            </Card>
        </div>
    )
}