import Head from 'next/head'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import EmptyScreen from '../components/EmptyScreen';
import Image from "next/image"

const Dashboard = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')
    const router = useRouter()
    const [dbUser, setDbUser] = useState(null) 

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const fetchDbUser = async (discordId) => { 
            try { 
                console.log('Fetching user with ID:', discordId) // Change from localhost:3000 to localhost:8000 
                const response = await axios.get(`${API_URL}/api/user/balance/${discordId}`) 
                console.log('Response:', response.data) 
                if (response.data.status === 200) { 
                    console.log('Setting dbUser:', response.data.data) 
                    setDbUser(response.data.data) 
                } else { 
                    console.log('API returned error:', response.data.message) 
                } 
            } catch (err) { 
                console.error('Database fetch error:', err) 
                console.error('Error response:', err.response?.data) 
            } 
        }

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
                    await fetchDbUser(response.data.id)
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
    }, [API_URL, BACKEND_URL, router, router.isReady, router.query])

    if (loading) {
        return (
            <>
                <Head>
                    <title>Dashboard - Loading</title>
                </Head>
                <div className="min-h-screen bg-brand-discord flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
                        <p className="text-white">Loading...</p>
                    </div>
                </div>
            </>
        )
    }

    if (error) {
        return (
            router.push('/')
        )
    }

    if (dbUser) {
        return (
            <>
                <Head>
                    <title>Dashboard - {user.username}</title>
                </Head>
                <div className="min-h-screen bg-brand-discord">
                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                            {/* Welcome Section */}
                            <div className="bg-brand-discord-50 overflow-hidden shadow-sm rounded-lg mb-6">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <Image
                                            src={user.avatarURL} 
                                            alt={`${user.username}'s avatar`}
                                            className="w-16 h-16 rounded-full border-2 border-indigo-500"
                                            onError={(e) => {
                                                e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'
                                            }}
                                            width={100}
                                            height={100}
                                        />
                                        <div className="ml-6">
                                            <h2 className="text-2xl font-bold text-white">
                                                Welcome, {user.username}!
                                            </h2>
                                            <p className="text-white">
                                                Successfully authenticated with Discord
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            {/* User Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-brand-discord-50 overflow-hidden shadow-sm rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-white mb-2">User ID</h3>
                                        <p className="text-white font-mono text-sm break-all">{user.id}</p>
                                    </div>
                                </div>
    
                                <div className="bg-brand-discord-50 overflow-hidden shadow-sm rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-white mb-2">Username</h3>
                                        <p className="text-white">{user.username}</p>
                                    </div>
                                </div>
    
                                <div className="bg-brand-discord-50 overflow-hidden shadow-sm rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-white mb-2">Discriminator</h3>
                                        <p className="text-white">#{user.discriminator}</p>
                                    </div>
                                </div>
    
                                <div className="bg-brand-discord-50 overflow-hidden shadow-sm rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-white mb-2">Coin</h3>
                                        <p className="text-white font-american text-5xl">{dbUser?.coin || 0}</p>
                                    </div>
                                </div>

                                <div className="bg-brand-discord-50 overflow-hidden shadow-sm rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-white mb-2">Credit</h3>
                                        <p className="text-white font-american text-5xl">{dbUser?.credit || 0}</p>
                                    </div>
                                </div>

                                <div className="bg-brand-discord-50 overflow-hidden shadow-sm rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-white mb-2">Dice</h3>
                                        <p className="text-white font-american text-5xl">{dbUser?.dice || 0}</p>
                                    </div>
                                </div>

                                <div className="bg-brand-discord-50 overflow-hidden shadow-sm rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-white mb-2">Box</h3>
                                        <p className="text-white font-american text-5xl">{dbUser?.box || 0}</p>
                                    </div>
                                </div>
                                
                            </div>
    
                        </div>
                    </div>
                </div>
            </>
        )
    }

    
    return (
        <>
            <Head>
                <title>Home - Not Found</title>
            </Head>
            <EmptyScreen />
        </>
    )
    
}

export default Dashboard