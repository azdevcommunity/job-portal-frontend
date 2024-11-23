'use client'

import React, { useState, useContext, useEffect } from 'react'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '@/AuthContext'
import axiosInstance from '@/lib/axiosInstance'

export default function Register() {
    const { user, login } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({
        name: '',
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    useEffect(() => {
        if (user) {
            const intendedPath = location.state?.from?.pathname
            if (user.role === 'company' && intendedPath?.startsWith('/company')) {
                navigate(intendedPath)
            } else if (user.role === 'admin' && intendedPath?.startsWith('/admin')) {
                navigate(intendedPath)
            } else {
                navigate(user.role === 'company' ? '/company/dashboard' : '/admin/vacancies')
            }
        }
    }, [user, navigate, location.state])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validateForm = () => {
        const newErrors = { ...errors }
        let isValid = true

        if (!formData.name) {
            newErrors.name = 'Name is required'
            isValid = false
        }
        if (!formData.companyName) {
            newErrors.companyName = 'Company name is required'
            isValid = false
        }
        if (!formData.email) {
            newErrors.email = 'Email is required'
            isValid = false
        }
        if (!formData.password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)

        try {
            const response = await axiosInstance.post('/register/company', {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                company_name: formData.companyName,
                password_confirmation: formData.confirmPassword,
            })

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Registration failed')
            }

            login(response.data)
            toast.success('Registration successful!')
            navigate('/login')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An error occurred during registration')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen  from-blue-100 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        src="/Logo.png?height=80&width=80"
                        alt="Logo"
                        width={80}
                        height={80}
                        className="mx-auto rounded-full shadow-lg"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                </div>

                <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md overflow-hidden">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Sign up</CardTitle>
                        <CardDescription className="text-center">Enter your information to create an account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    placeholder="Acme Inc."
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-center text-sm text-gray-600 mt-2">
                            Already have an account?{' '}
                            <Button variant="link" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800" onClick={() => navigate('/login')}>
                                Sign in
                            </Button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}