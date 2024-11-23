import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Search, Eye, Edit, Trash, Plus, Filter} from 'lucide-react';
import {Link} from "react-router-dom";
import axios from 'axios';
import {debounce} from 'lodash';
import Cookies from 'js-cookie';

import {Button} from "@/Components/ui/button";
import {Skeleton} from "@/Components/ui/skeleton";
import {Input} from "@/Components/ui/input";
import {Checkbox} from "@/Components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"

type Vacancy = {
    id: number;
    title: string;
    jobType: string;
    seniorityLevel: string;
    city: string;
    country: string;
    state: string;
}

type ApiResponse = {
    data: Vacancy[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export default function VacanciesPage() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const searchTermRef = useRef(searchTerm); // Added useRef for searchTerm
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedVacancies, setSelectedVacancies] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        jobType: [] as string[],
        seniorityLevel: [] as string[],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState(''); // Added state for input value

    const jobTypeOptions = [
        {label: 'Full-time', value: 'full-time'},
        {label: 'Part-time', value: 'part-time'},
        {label: 'Contract', value: 'contract'},
    ];

    const seniorityLevelOptions = [
        {label: 'Junior', value: 'junior'},
        {label: 'Middle', value: 'middle'},
        {label: 'Senior', value: 'senior'},
        {label: 'Intern', value: 'intern'},
    ];

    const jobTypeLabels: Record<string, string> = {
        'full-time': 'Full-time',
        'part-time': 'Part-time',
        'contract': 'Contract',
    };

    const seniorityLevelLabels: Record<string, string> = {
        'junior': 'Junior',
        'middle': 'Middle',
        'senior': 'Senior',
        'intern': 'Intern',
    };

    const getJobTypeLabel = (key: string) => jobTypeLabels[key] || key;
    const getSeniorityLevelLabel = (key: string) => seniorityLevelLabels[key] || key;

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchTerm(value);
            searchTermRef.current = value; // Update useRef value
            setCurrentPage(1);
        }, 300),
        []
    );

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedSearch(value);

        // If the input is cleared, trigger an immediate fetch
        if (value === '') {
            searchTermRef.current = '';
            fetchVacancies();
        }
    };

    const fetchVacancies = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const companyId = Cookies.get('company_id');
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/companies/${companyId}/vacancies`, {
                params: {
                    size: 10,
                    page: currentPage,
                    title: searchTermRef.current,
                    jobType: filters.jobType.join('+'),
                    seniorityLevel: filters.seniorityLevel.join('+'),
                },
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                    "Content-Type": 'application/json',
                }
            });
            setVacancies(response.data.data);
            setTotalPages(response.data.meta.last_page);
        } catch (err) {
            setError('Failed to fetch vacancies. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTermRef, filters]);

    const stableFetchVacancies = useCallback(fetchVacancies, [currentPage, searchTermRef.current, filters]);

    useEffect(() => {
        stableFetchVacancies();
    }, [stableFetchVacancies]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]); // Updated cleanup effect for debouncedSearch

    useEffect(() => {
        if (searchTerm !== '') {
            fetchVacancies();
        }
    }, [searchTerm, fetchVacancies]);


    const toggleFilter = (type: 'jobType' | 'seniorityLevel', value: string) => {
        setFilters(prev => {
            const newFilters = {
                ...prev,
                [type]: prev[type].includes(value)
                    ? prev[type].filter(item => item !== value)
                    : [...prev[type], value],
            };
            setCurrentPage(1);
            return newFilters; // Do not call fetchVacancies() here
        });
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (selectedVacancies.length === 0) return;

            const ids = [...selectedVacancies];

            // Send delete request with selected IDs
            await axios.delete(`http://127.0.0.1:8000/api/vacancies`, {
                data: { ids },
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                },
            });

            // Remove deleted vacancies from the state
            setVacancies(prevVacancies => prevVacancies.filter(vacancy => !ids.includes(vacancy.id)));

            // Clear selected vacancies and close the delete dialog
            setSelectedVacancies([]);
            setDeleteDialogOpen(false);

        } catch (err) {
            setError('Failed to delete vacancies. Please try again.');
            console.error(err);
        }
    };

    const toggleSelectAll = () => {
        if (vacancies.length === 0) return;
        if (selectedVacancies.length === vacancies.length) {
            setSelectedVacancies([]);
        } else {
            setSelectedVacancies(vacancies.map(v => v.id));
        }
    };

    const toggleSelectVacancy = (id: number) => {
        setSelectedVacancies(prev =>
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
        );
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const FilterPopover = ({type, options}: {
        type: 'jobType' | 'seniorityLevel',
        options: { label: string, value: string }[]
    }) => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-0.5">
                    <Filter className="h-2 w-2"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
                <div className="space-y-2">
                    {options.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${type}-${option.value}`}
                                checked={filters[type].includes(option.value)}
                                onCheckedChange={() => toggleFilter(type, option.value)}
                            />
                            <label htmlFor={`${type}-${option.value}`}
                                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );


    return (
        <div className="p-8 w-full max-w-full overflow-x-auto">
            <div className="flex flex-col space-y-4 mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Vacancies</h1>
                    <div className="flex space-x-2 items-center">
                        {selectedVacancies.length > 0 && (
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash className="h-4 w-4 mr-2"/>
                                Delete Selected
                            </Button>
                        )}
                        <Link to="/company/vacancies/add">
                            <Button className="bg-black text-white hover:bg-black/90">
                                <Plus className="h-4 w-4 mr-2"/>
                                Add Vacancy
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="relative max-w-md">
                    <Input
                        type="text"
                        placeholder="Search by vacancy title"
                        value={inputValue} // Use inputValue for the Input component
                        onChange={handleSearch}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={vacancies?.length > 0 && selectedVacancies?.length === vacancies?.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>
                                Job Type
                                <FilterPopover type="jobType" options={jobTypeOptions}/>
                            </TableHead>
                            <TableHead>
                                Seniority
                                <FilterPopover type="seniorityLevel" options={seniorityLevelOptions}/>
                            </TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Skeleton rows while loading
                            Array.from({length: 5}).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-4"/></TableCell>
                                    <TableCell><Skeleton className="h-4 w-8"/></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            vacancies.map((vacancy) => (
                                <TableRow key={vacancy.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedVacancies.includes(vacancy.id)}
                                            onCheckedChange={() => toggleSelectVacancy(vacancy.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{vacancy.id}</TableCell>
                                    <TableCell>{vacancy.title}</TableCell>
                                    <TableCell>{getJobTypeLabel(vacancy.jobType)}</TableCell>
                                    <TableCell>{getSeniorityLevelLabel(vacancy.seniorityLevel)}</TableCell>
                                    <TableCell>{`${vacancy.city}, ${vacancy.state}, ${vacancy.country}`}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Link to={`/company/vacancies/${vacancy.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4 mr-1"/>
                                                    View
                                                </Button>
                                            </Link>
                                            <Link to={`/company/vacancies/edit/${vacancy.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4 mr-1"/>
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => goToPage(Math.max(1, currentPage - 1))}
                            isActive={currentPage !== 1}
                        />
                    </PaginationItem>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                onClick={() => goToPage(page)}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                            isActive={currentPage !== totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the selected vacancies? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}