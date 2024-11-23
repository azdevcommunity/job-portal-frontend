import React, { useState } from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"

interface IndustryFormProps {
    industry?: { id: string; name: string };
    onSubmit: (name: string, id?: string) => void;
}

export const IndustryForm: React.FC<IndustryFormProps> = ({ industry, onSubmit }) => {
    const [name, setName] = useState(industry?.name || '');

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
                />
            </div>
            <Button type="submit">
                {industry ? 'Update Industry' : 'Add Industry'}
            </Button>
        </form>
    );
};

