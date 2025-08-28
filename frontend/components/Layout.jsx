// @ts-nocheck

import { SidebarProvider, SidebarInset } from './ui/sidebar'
import { Toaster } from "./ui/sonner"

import {AppSidebar} from './SideBar'
import { SiteHeader } from "./SideHeader"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')
    const router = useRouter()

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                // Check for token in URL first (from Discord redirect)
                const { token: urlToken } = router.query
                
                // Check for token in localStorage
                let token = window.localStorage.getItem("__nego-auth")
                
                // If we have a token from URL, use it and store it
                if (urlToken) {
                    token = urlToken
                    window.localStorage.setItem("__nego-auth", token)
                    // Clean up URL
                    router.replace('/dashboard', undefined, { shallow: true })
                }
                
                if (!token) {
                    setError('No authentication token found')
                    setLoading(false)
                    return
                }
                
                // Verify token with backend
                const response = await axios.get(`${BACKEND_URL}/api/_auth/user?token=${token}`)
                
                if (response.data.status === 200) {
                    setUser(response.data)
                } else {
                    setError(response.data.message || 'Authentication failed')
                    // Remove invalid token
                    window.localStorage.removeItem("__nego-auth")
                }
            } catch (err) {
                setError('Failed to authenticate user')
                console.error('Auth error:', err)
            } finally {
                setLoading(false)
            }
        }

        if (router.isReady) {
            authenticateUser()
        }
    }, [BACKEND_URL, router, router.isReady, router.query])

    const handleLogout = async () => {
        try {
            setUser(null)
            await axios.post(`/api/_auth/logout`)
            window.localStorage.removeItem("__nego-auth")
            router.push('/')
        } catch (err) {
            console.error('Logout error:', err)
            setUser(null)
            // Still remove token and redirect even if request fails
            window.localStorage.removeItem("__nego-auth")
            router.push('/')
        }
    }

    return (<>
        <SidebarProvider
            style={
                {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
                }
            }
            className='bg-brand'
        >
            <AppSidebar variant="inset" user={user} onLogout={handleLogout}/>
            <SidebarInset className='bg-brand-discord !rounded-2xl w-100'>
                <SiteHeader/>
                <Toaster />
                <main>{children}</main>  
            </SidebarInset>
        </SidebarProvider>
    </>)
}