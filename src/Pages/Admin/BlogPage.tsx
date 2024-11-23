import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Edit } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { Skeleton } from "@/Components/ui/skeleton"
import {useNavigate} from "react-router-dom";

interface Blog {
    id: number
    title: string
    content: string
    isActive: number
    imageUrl: string
    categoryId: number
    categories_name: string
    createdAt: string
    updatedAt: string
}

function BlogTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function BlogTable({ blogs }: { blogs: Blog[] }) {
    const navigate = useNavigate()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                        <TableCell>
                            <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                width={50}
                                height={50}
                                className="rounded-md"
                            />
                        </TableCell>
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>{blog.categories_name}</TableCell>
                        <TableCell>{blog.isActive ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{format(new Date(blog.createdAt), 'PPP')}</TableCell>
                        <TableCell>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    // Implement edit functionality here
                                    navigate(`/admin/blogs/edit/${blog.id}`)
                                }}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/blogs')
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs')
                }
                const data = await response.json()
                setBlogs(data)
                setIsLoading(false)
            } catch (err) {
                setError('An error occurred while fetching blogs')
                setIsLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Blogs</h1>
            {isLoading ? (
                <BlogTableSkeleton />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <BlogTable blogs={blogs} />
            )}
        </div>
    )
}

