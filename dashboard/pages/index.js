import Head from 'next/head'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = () => {
        window.location.href = "/api/_auth/login";
    };

    useEffect(() => {
        const checkAuth = async () => {
            const { token: urlToken, error: urlError } = router.query;

            if (urlError) {
                setError("Authentication failed.");
                setLoading(false);
                return;
            }

            const token = urlToken || window.localStorage.getItem("__nego-auth");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                if (urlToken) window.localStorage.setItem("__nego-auth", urlToken);

                const response = await axios.get(`/api/_auth/user?token=${token}`);

                if (response.data.status === 200) {
                    router.push("/dashboard");
                } else {
                    window.localStorage.removeItem("__nego-auth");
                }
            } catch (err) {
                console.error("Auth verification error:", err);
                window.localStorage.removeItem("__nego-auth");
            } finally {
                setLoading(false);
                if (urlToken) router.replace("/", undefined, { shallow: true });
            }
        };

        if (router.isReady) checkAuth();
    }, [router, router.isReady]);

    if (loading) {
        return (
            <>
                <Head>
                    <title>Loading...</title>
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

    return (
        <>
            <Head>
                <title>Discord OAuth App</title>
                <meta name="description" content="Authenticate with Discord" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="max-w-md w-full">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-discord text-white mb-2">POMPOKI-bot</h1>
                        <h1 className="text-3xl font-discord text-white mb-2">Dashboard</h1>
                        <p className="text-white">Sign in with your Discord account to continue</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-700 text-sm">{error}</span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            className="w-full bg-brand hover:bg-brand/70 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                            </svg>
                            <span>Continue with Discord</span>
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                By continuing, you agree to authenticate with Discord
                            </p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-8 grid grid-cols-1 gap-4">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-brand rounded-full mb-2">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm text-white">Secure Discord authentication</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home