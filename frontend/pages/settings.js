import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Switch, cn } from "@heroui/react"

export default function Settings() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')
    const router = useRouter()
    const [dbUser, setDbUser] = useState(null)

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const fetchDbUser = async (discordId) => {
        try {
            console.log('Fetching user with ID:', discordId)
            const response = await axios.get(`${API_URL}/api/user/settings/${discordId}`)
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
                    router.replace('/settings', undefined, { shallow: true })
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
    }, [router.isReady, router.query])

    {/* const handleSwitchChange = async (key, isSelected) => {
        try {
            // Send update to backend
            const response = await axios.put(`http://localhost:8000/api/user/settings/${user.id}`, {
                [key]: isSelected
            })

            if (response.data.status !== 200) {
                // Revert on error
                setDbUser(prev => ({
                    ...prev,
                    [key]: [prev[key][0], (!isSelected).toString()]
                }))
                console.error('Failed to update setting:', response.data.message)
            }
        } catch (err) {
            // Revert on error
            setDbUser(prev => ({
                ...prev,
                [key]: [prev[key][0], (!isSelected).toString()]
            }))
            console.error('Error updating setting:', err)
        }
    } */
    }

    if (loading) {
        return (
            <>
                
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Re-Authenticating...</p>
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

    if (!dbUser) {
        return (
            <>
                
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading settings...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="min-h-screen bg-brand-discord py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-brand-discord rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
                        <div className="space-y-4">
                            {Object.entries(dbUser).map(([key, value], index) => (
                                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                    <Switch
                                        color='default'
                                        defaultSelected={value[1] || "true"}
                                        classNames={{
                                            base: cn(
                                                "inline-flex flex-row-reverse w-full max-w-md border-2 bg-content1 hover:bg-brand-accent-100 items-center",
                                                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                                                "data-[selected=true]:border-[#a0312d] bg-brand-accent-50",
                                            ),
                                            wrapper: cn(
                                                "p-0 h-4 overflow-visible",
                                                "group-data-[selected=true]:bg-brand"
                                            ),
                                            thumb: cn(
                                                "w-6 h-6 shadow-lg bg-[#ffffff]",
                                                // selected
                                                "group-data-[selected=true]:ms-6 bg-brand",
                                                // pressed
                                                "group-data-[pressed=true]:w-7",
                                                "group-data-pressed:group-data-selected:ms-4",
                                            ),
                                        }}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <p className="text-medium text-white">{value[0]}</p>
                                            <p className="text-tiny text-gray-500">
                                                Get access to new features before they are released.
                                            </p>
                                        </div>
                                    </Switch>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}