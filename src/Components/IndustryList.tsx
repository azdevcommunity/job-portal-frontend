import React from 'react';
import { Button } from "@/Components/ui/button"

interface Industry {
    id: string;
    name: string;
}

interface IndustryListProps {
    industries: Industry[];
    onEdit: (industry: Industry) => void;
    onDelete: (id: string) => void;
}

export const IndustryList: React.FC<IndustryListProps> = ({ industries, onEdit, onDelete }) => {
    return (
        <ul className="space-y-4">
            {industries.map((industry) => (
                <li key={industry.id} className="flex items-center justify-between">
                    <span>{industry.name}</span>
                    <div>
                        <Button
                            onClick={() => onEdit(industry)}
                            variant="outline"
                            size="sm"
                            className="mr-2"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => onDelete(industry.id)}
                            variant="destructive"
                            size="sm"
                        >
                            Delete
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

