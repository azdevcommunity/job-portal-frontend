import React, { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent } from "@/Components/ui/card"
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast';
import axiosInstance from "@/lib/axiosInstance";

interface Industry {
    id: number;
    name: string;
}

const IndustryForm: React.FC<{
    industry?: Industry;
    onSubmit: (name: string, id?: number) => void;
}> = ({ industry, onSubmit }) => {
    const [name, setName] = useState(industry?.name || '');

    useEffect(() => {
        setName(industry?.name || '');
    }, [industry]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, industry?.id);
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Industry Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1"
                />
            </div>
            <Button type="submit" className="w-full">
                {industry ? 'Update Industry' : 'Add Industry'}
            </Button>
        </form>
    );
};

const IndustryList: React.FC<{
    industries: Industry[];
    onEdit: (industry: Industry) => void;
    onDelete: (id: number) => void;
}> = ({ industries, onEdit, onDelete }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
                <Card key={industry.id} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{industry.name}</h3>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={() => onEdit(industry)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                    onClick={() => onDelete(industry.id)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export const IndustryPage: React.FC = () => {
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);

    useEffect(() => {
        fetchIndustries();
    }, []);

    const fetchIndustries = async () => {
        try {
            const response = await axiosInstance.get('/industries');
            setIndustries(response.data);
        } catch (error) {
            console.error('Failed to fetch industries:', error);
            toast.error('Failed to load industries. Please try again.');
        }
    };

    const handleSubmit = async (name: string, id?: number) => {
        try {
            if (id) {
                const response = await axiosInstance.put(`/admin/industries/${id}`, { name });
                setIndustries(prevIndustries =>
                    prevIndustries.map(industry =>
                        industry.id === id ? response.data.industry : industry
                    )
                );
                toast.success('Industry updated successfully');
            } else {
                const response = await axiosInstance.post('/admin/industries', { name });
                setIndustries(prevIndustries => [...prevIndustries, response.data.industry]);
                toast.success('Industry created successfully');
            }
            setEditingIndustry(null);
        } catch (error) {
            console.error('Failed to submit industry:', error);
            toast.error('Failed to save industry. Please try again.');
        }
    };

    const handleEdit = (industry: Industry) => {
        setEditingIndustry(industry);
    };

    const handleDelete = async (id: number) => {
        try {
            await axiosInstance.delete(`/admin/industries/${id}`);
            setIndustries(prevIndustries => prevIndustries.filter(industry => industry.id !== id));
            toast.success('Industry deleted successfully');
        } catch (error) {
            console.error('Failed to delete industry:', error);
            toast.error('Failed to delete industry. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingIndustry ? 'Edit Industry' : 'Add New Industry'}
                    </h2>
                    <IndustryForm
                        industry={editingIndustry || undefined}
                        onSubmit={handleSubmit}
                    />
                    {editingIndustry && (
                        <Button
                            onClick={() => setEditingIndustry(null)}
                            variant="outline"
                            className="mt-4 w-full"
                        >
                            Cancel Edit
                        </Button>
                    )}
                </CardContent>
            </Card>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Existing Industries</h2>
                <IndustryList
                    industries={industries}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

