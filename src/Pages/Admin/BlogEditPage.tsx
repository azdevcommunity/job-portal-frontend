import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Switch } from "@/Components/ui/switch"
import { Button } from "@/Components/ui/button"
import { Skeleton } from "@/Components/ui/skeleton"
import {toast} from "@/hooks/use-toast";

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

export default function BlogEditPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [blog, setBlog] = useState<Blog | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        async function fetchBlog() {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch blog')
                }
                const data = await response.json()
                setBlog(data)
                setIsLoading(false)
            } catch (err) {
                console.error('Error fetching blog:', err)
                toast({
                    title: "Error",
                    description: "Failed to load blog post. Please try again.",
                    variant: "destructive",
                })
                setIsLoading(false)
            }
        }

        fetchBlog()
    }, [id])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSaving(true)
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blog),
            })
            if (!response.ok) {
                throw new Error('Failed to update blog')
            }
            toast({
                title: "Success",
                description: "Blog post updated successfully.",
            })
            navigate('/blogs')
        } catch (err) {
            console.error('Error updating blog:', err)
            toast({
                title: "Error",
                description: "Failed to update blog post. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setBlog(prevBlog => prevBlog ? { ...prevBlog, [name]: value } : null)
    }

    const handleSwitchChange = (checked: boolean) => {
        setBlog(prevBlog => prevBlog ? { ...prevBlog, isActive: checked ? 1 : 0 } : null)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-[200px]" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Failed to load blog post. Please try again.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Edit Blog Post</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={blog.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={blog.content}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isActive"
                                checked={blog.isActive === 1}
                                onCheckedChange={handleSwitchChange}
                            />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                value={blog.imageUrl}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Category ID</Label>
                            <Input
                                id="categoryId"
                                name="categoryId"
                                type="number"
                                value={blog.categoryId}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Created At</Label>
                            <p>{format(new Date(blog.createdAt), 'PPP')}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Updated At</Label>
                            <p>{format(new Date(blog.updatedAt), 'PPP')}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

