'use client'

import React, { useState, useContext, useEffect } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '@/AuthContext'

export default function Login() {
    const { user, login } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    useEffect(() => {
        if (user && user.role === 'company') {
            const intendedPath = location.state?.from?.pathname
            if (intendedPath && intendedPath.startsWith('/company')) {
                navigate(intendedPath)
            } else {
                navigate('/company/dashboard')
            }
        } else if (user && user.role === 'admin') {
            const intendedPath = location.state?.from?.pathname
            if (intendedPath && intendedPath.startsWith('/admin')) {
                navigate(intendedPath)
            } else {
                navigate('/admin/vacancies')
            }
        }
    }, [user, navigate, location.state])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setEmailError('')
        setPasswordError('')

        if (!email) {
            setEmailError('Email is required')
            return
        }
        if (!password) {
            setPasswordError('Password is required')
            return
        }
        if (password.length < 4) {
            setPasswordError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            login(data)
            toast.success('Login successful!')

            if (user && user.role === 'company') {
                if (!location.pathname.startsWith('/company')) {
                    navigate('/company/dashboard')
                }
            } else if (user && user.role === 'admin') {
                if (!location.pathname.startsWith('/admin')) {
                    navigate('/admin/dashboard')
                }
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An error occurred during login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gradient-to-br-from-blue-100 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        src="/Logo.png?height=80&width=80"
                        alt="Logo"
                        width={80}
                        height={80}
                        className="mx-auto rounded-full shadow-lg"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Back!</h2>
                </div>

                <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md overflow-hidden">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
                        <CardDescription className="text-center">Enter your email and password to login</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full"
                                />
                                {emailError && <p className="text-sm text-red-600">{emailError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pr-10"
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
                                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
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
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button variant="link" className="w-full text-sm text-gray-600 hover:text-gray-800">
                            Forgot your password?
                        </Button>
                        <div className="text-sm text-center text-gray-600">
                            Don't have an account?{' '}
                            <Button variant="link" className="text-blue-600 hover:text-blue-800" onClick={() => navigate("/register")}>
                                Sign up
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}