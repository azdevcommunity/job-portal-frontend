'use client'

import {useEffect, useState} from 'react'
import {ArrowLeft} from 'lucide-react'
import {Button} from "@/Components/ui/button"
import {Switch} from "@/Components/ui/switch"
import {Label} from "@/Components/ui/label"
import {Card, CardContent, CardHeader, CardTitle} from "@/Components/ui/card"
import {Link, useNavigate, useParams} from 'react-router-dom'
import {useToast} from "@/hooks/use-toast";
import {Toaster} from "@/Components/ui/toaster"
import axiosInstance from "@/lib/axiosInstance";


type Vacancy = {
    isBlocked: boolean;
    title: string;
};

export default function VacancyEditAdmin() {
    const {vacancyId} = useParams();
    const navigate = useNavigate();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const {toast} = useToast()

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const response = await axiosInstance.get<Vacancy>(`http://127.0.0.1:8000/api/admin/vacancies/${vacancyId}`);
                setVacancy(response.data);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch vacancy details. Please try again.",
                    variant: "destructive",
                })
            }
        };

        if (vacancyId) {
            fetchVacancy();
        }
    }, [vacancyId]);


    const handleSwitchChange = (name: string, checked: boolean) => {
        setVacancy((prev) => {
            if (!prev) return prev;
            return {...prev, [name]: checked};
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
                isBlocked: vacancy.isBlocked,
            };

            let response;

            if (updatedData.isBlocked){
                response = await axiosInstance.post(
                    `http://127.0.0.1:8000/api/vacancies/${vacancyId}/block`);
            }else{
                response = await axiosInstance.post(
                    `http://127.0.0.1:8000/api/vacancies/${vacancyId}/unblock`);
            }

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Vacancy updated successfully.",
                })
                navigate(`/admin/vacancies/${vacancyId}`)
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

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <Link to={`/admin/vacancies`}>
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
                                <Label htmlFor="title" className={" text-4xl font-bold"}>{vacancy?.title}</Label>
                            </div>
                            <div className={"flex flex-col space-y-5"}>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isActive"
                                        checked={vacancy?.isBlocked}
                                        onCheckedChange={(checked) => handleSwitchChange('isBlocked', checked)}
                                    />
                                    <Label htmlFor="isActive">Block Vacancy</Label>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button type="button" variant="outline"
                                        onClick={() => navigate("/admin/vacancies")}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <Toaster/>
            </Card>
        </div>
    )

}