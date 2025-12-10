import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from "sonner"
import Image from "next/image"

export default function BattlePass() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [battlepassData, setBattlepassData] = useState(null)
    const [error, setError] = useState('')
    const [claimingLevel, setClaimingLevel] = useState(null)
    const [claimingType, setClaimingType] = useState(null)
    const [cooldown, setCooldown] = useState(false)
    const scrollContainerRef = useRef(null)
    const router = useRouter()

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    console.log("API: ", API_URL);

    const formatRewards = (rewards) => {
        if (!rewards) return "No rewards"
        const parts = []
        for (const [key, value] of Object.entries(rewards)) {
            let name = key
            let image = "/"
            if (key === 'coin') {
                name = 'coins'
                image = 'https://cdn.discordapp.com/emojis/1243996451223244831.png'
            } else if (key === 'dice') {
                name = 'dice'
                image = 'https://cdn.discordapp.com/emojis/1243997581076467804.png'
            } else if (key === 'credit') {
                name = 'credits'
                image = 'https://cdn.discordapp.com/emojis/1243997460875972629.png'
            } else if (key === 'box') {
                name = 'boxes'
                image = 'https://cdn.discordapp.com/emojis/1346361951286067230.png'
            }
            parts.push(<>
                <div className='flex flex-col justify-center h-full items-center'>
                <Image src={image} width={95} height={100} alt='currency_icon' />
                <span className='text-2xl'><span className='font-american'>{value}</span>×</span>
                </div>
            </>)
        }
        return parts
    }

    const getXpRequirementForLevel = (level) => {
        if (level <= 1) return 0
        if (level <= 20) return 90 + (level * 10)
        if (level <= 50) return 290 + (level - 20) * 10
        if (level <= 80) return 590 + (level - 50) * 10
        return 890 + Math.min((level - 80) * 5, 100)
    }

    const calculateLevelProgress = (currentXp) => {
        const { currentLevelXp, nextLevelXp } = calculateLevelFromXp(currentXp)
        if (nextLevelXp === 0) return 100
        return Math.min(100, (currentLevelXp / nextLevelXp) * 100)
    }

    const claimReward = async (level, rewardType) => {
        if (claimingLevel) return // Prevent multiple claims

        setClaimingLevel(level)
        setClaimingType(rewardType)

        try {
            const response = await axios.post(`${API_URL}/api/user/battlepass/${user.id}/claim`, {
                level: level,
                reward_type: rewardType
            })

            if (response.data.status === 200) {
                // Update local data
                setBattlepassData(prev => ({
                    ...prev,
                    progress: {
                        ...prev.progress,
                        [`claimed_${rewardType}`]: [...prev.progress[`claimed_${rewardType}`], level]
                    }
                }))

                // Show success message
                alert(`Successfully claimed ${rewardType} reward for level ${level}!`)
            } else {
                alert(response.data.message || 'Failed to claim reward')
            }
        } catch (err) {
            console.error('Claim error:', err)
            alert('Failed to claim reward')
        } finally {
            setClaimingLevel(null)
            setClaimingType(null)
        }
    }

    const claimAllAvailable = async () => {
        if (cooldown) {
          toast("Slow down!", {
            description: "Please wait 10s before claiming again.",
            variant: "destructive",
          })
          return
        }
      
        setCooldown(true) // start cooldown
        setTimeout(() => setCooldown(false), 10000) // 5s cooldown, adjust as needed
      
        try {
          const response = await axios.post(`${API_URL}/api/user/battlepass/${user.id}/claim-all`
          )
      
          if (response.data.status === 200) {
            // Refresh battlepass data
            const bpResponse = await axios.get(`${API_URL}/api/user/battlepass/${user.id}`
            )
            if (bpResponse.data.status === 200) {
              setBattlepassData(bpResponse.data.data)
            }
      
            const claimed_count = response.data.claimed_count
            if (claimed_count <= 0) {
              toast("No rewards", {
                description: "Nothing to claim right now.",
              })
            } else {
              toast("Success!", {
                description: `Successfully claimed ${claimed_count} rewards! 🎉`,
              })
            }
          } else {
            toast("Notice", {
              description: response.data.message || "No rewards to claim",
            })
          }
        } catch (err) {
          console.error("Claim all error:", err)
          toast("Error", {
            description: "Failed to claim rewards",
            variant: "destructive",
          })
        }
      }
    
      const calculateLevelFromXp = (totalXp) => {
        if (totalXp <= 0) return { level: 1, currentLevelXp: 0, nextLevelXp: 100 }

        let currentLevel = 1
        let xpUsed = 0
        const maxLevel = 100

        while (currentLevel < maxLevel) {
            const xpNeeded = getXpRequirementForLevel(currentLevel + 1)
            if (xpUsed + xpNeeded > totalXp) break
            xpUsed += xpNeeded
            currentLevel++
        }

        const currentLevelXp = totalXp - xpUsed
        const nextLevelXp = getXpRequirementForLevel(currentLevel + 1)

        return { level: currentLevel, currentLevelXp, nextLevelXp }
    }

    const scrollToCurrentLevel = () => {
        if (!scrollContainerRef.current || !battlepassData) return;
      
        const { level } = calculateLevelFromXp(battlepassData.progress.current_xp);
        const container = scrollContainerRef.current;
      
        // Get the card element for that level
        const card = container.querySelector(`[data-level="${level}"]`);
        if (!card) return;
      
        // Scroll so the card is centered in the viewport
        const scrollPosition = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
      
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
    };

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const { token: urlToken } = router.query
                let token = window.localStorage.getItem("__nego-auth")
                if (urlToken) {
                    token = urlToken
                    window.localStorage.setItem("__nego-auth", token)
                    router.replace('/battlepass', undefined, { shallow: true })
                }
                if (!token) {
                    setError('No authentication token found')
                    setLoading(false)
                    return
                }
                const response = await axios.get(`/api/_auth/user?token=${token}`)
                if (response.data.status === 200) {
                    setUser(response.data)
                    const bpResponse = await axios.get(`${API_URL}/api/user/battlepass/${response.data.id}`)
                    if (bpResponse.data.status === 200) {
                        setBattlepassData(bpResponse.data.data)
                    } else {
                        setError('Failed to fetch battlepass data')
                    }
                } else {
                    setError(response.data.message || 'Authentication failed')
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
    }, [router, router.isReady, router.query])

    useEffect(() => {
        if (battlepassData) {
            setTimeout(scrollToCurrentLevel, 500)
        }
    }, [battlepassData])

    if (loading) {
        return (
            <>
                <Head>
                    <title>Battlepass - Loading</title>
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

    if (!battlepassData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-gray-500 text-xl">No battlepass data available</div>
            </div>
        )
    }

    const { season, progress, rewards_config } = battlepassData
    const { current_xp, has_premium, claimed_free, claimed_premium } = progress
    const { level: actualLevel } = calculateLevelFromXp(current_xp)

    return (
        <>
            <Head>
                <title>BattlePass - {user.username}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-min mb-2 text-white">

                {/* Header */}
                <div className="text-center py-8 px-4">
                    <h1 className="text-4xl font-discord mb-2">
                        BattlePass Season {season.season_id}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        Ends: {new Date(season.end_date).toLocaleDateString()}
                    </p>

                    {/* Progress Overview */}
                    <div className="bg-brand-discord/50 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-brand-discord-75">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-left">
                                <div className="text-3xl font-bold text-white">Level {actualLevel}</div>
                                <div className="text-sm text-gray-400">{current_xp.toLocaleString()} Total XP</div>
                            </div>
                            <div className="text-right">
                                <div className={`text-lg font-semibold ${has_premium ? 'text-yellow-400' : 'text-gray-400'}`}>
                                    {has_premium ? '👑 Premium' : 'Free Tier'}
                                </div>
                                {/*!has_premium && (
                                    <button className="mt-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs hover:from-purple-700 hover:to-pink-700 transition-all">
                                        Upgrade
                                    </button>
                                )*/}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                            <div
                                className="bg-white h-3 rounded-full transition-all duration-500"
                                style={{ width: `${calculateLevelProgress(current_xp)}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-400 text-center">
                            {calculateLevelProgress(current_xp).toFixed(1)}% to next level
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-4 justify-center mt-6">
                        <button
                            onClick={scrollToCurrentLevel}
                            className="px-4 py-2 bg-brand hover:bg-brand/70 rounded-lg text-sm transition-colors"
                        >
                            Go to Current Level
                        </button>
                        <button
                            
                            onClick={claimAllAvailable}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                            disabled={claimingLevel !== null}
                        >
                            {claimingLevel ? 'Claiming...' : 'Claim All'}
                        </button>
                    </div>
                </div>

                {/* Horizontal BattlePass - Fixed Width Issues */}
                <div className="relative px-4 overflow-visble">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto scrollbar-hide gap-4 p-4"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {Object.entries(rewards_config)
                            .sort(([a], [b]) => parseInt(a) - parseInt(b))
                            .map(([level, rewards]) => {
                                const levelNum = parseInt(level)
                                const isFreeClaimed = claimed_free.includes(levelNum)
                                const isPremiumClaimed = claimed_premium.includes(levelNum)
                                const isLevelReached = actualLevel >= levelNum
                                const isCurrentLevel = actualLevel === levelNum
                                const canClaimFree = isLevelReached && !isFreeClaimed && rewards.free
                                const canClaimPremium = isLevelReached && !isPremiumClaimed && rewards.premium && has_premium
                                
                                return (
                                    <div
                                        key={level}
                                        data-level={level}
                                        className={`shrink-0 w-55 h-full transition-all duration-300 ${isCurrentLevel ? 'scale-105' : ''
                                            }`}
                                    >
                                        <div 
                                            className={`bg-brand-discord-50/50 backdrop-blur-sm border-2 rounded-xl p-4 h-full ${isCurrentLevel
                                                ? 'border-brand-50 bg-brand!'
                                                : 'border-brand-discord-75 hover:border-brand-discord-100'
                                            } transition-all duration-300`}>

                                            {/* Level Header */}
                                            <div className="text-center mb-4">
                                                <div className={`text-2xl font-bold ${isLevelReached ? 'text-white' : 'text-white/40'
                                                    }`}>
                                                    {level}
                                                </div>
                                                {isCurrentLevel && (
                                                    <div className="mt-2">
                                                        <span className="text-xs bg-brand-50 px-3 py-1 rounded-full">
                                                            Current Level
                                                        </span>
                                                        <div className="mt-2 w-full bg-brand-discord-75 rounded-full h-2">
                                                            <div
                                                                className="bg-white h-2 rounded-full transition-all duration-500"
                                                                style={{ width: `${calculateLevelProgress(current_xp)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Free Rewards */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-gray-300">Free</span>
                                                </div>
                                                <div className={`p-3 mx-6 rounded-lg text-sm border ${isFreeClaimed && !isCurrentLevel
                                                        ? 'bg-brand-50 border-brand'
                                                        : 'bg-brand-discord-75 border-brand-discord-100 opacity-60'
                                                    }`}>
                                                    {rewards.free ? formatRewards(rewards.free) : "No rewards"}
                                                    
                                                </div>
                                                
                                                    <button
                                                        onClick={() => claimReward(levelNum, 'free')}
                                                        disabled={!canClaimFree ? true : false}
                                                        className={`w-full mt-2 px-3 py-1 disabled:bg-brand-discord-100/50 disabled:opacity-50 rounded-lg text-xs transition-colors
                                                            ${canClaimFree ? "bg-green-600 hover:bg-green-600/70" : (isCurrentLevel ? "disabled:bg-brand-50!" : "bg-brand-discord-50")}`}
                                                    >
                                                        
                                                        {isFreeClaimed && !canClaimFree && !isCurrentLevel ? "Claimed" : "Claim"}
                                                    </button>
                                                
                                            </div>

                                            {/* Premium Rewards */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-semibold text-gold">Premium</span>
                                                    {has_premium && isPremiumClaimed && !isCurrentLevel && (
                                                        <span className="text-xs bg-gold text-brand-discord px-2 py-1 rounded-full">✓</span>
                                                    )}
                                                    {!has_premium && (
                                                        <span className="text-xs bg-gold px-2 py-1 rounded-full">🔒 Premium</span>
                                                    )}
                                                </div>
                                                <div className={`p-3 mx-7 rounded-lg text-sm border text-white ${has_premium
                                                        ? isPremiumClaimed && !isCurrentLevel
                                                            ? 'bg-gold border-gold'
                                                            : 'bg-brand-discord-75 border-brand-discord-100 text-white opacity-60'
                                                        : 'bg-gray-900/50 border-gray-700 opacity-60'
                                                    }`}>
                                                    {rewards.premium ? formatRewards(rewards.premium) : "No rewards"}
                                                </div>
                                                
                                                <button
                                                    onClick={() => claimReward(levelNum, 'premium')}
                                                    disabled={has_premium && isPremiumClaimed ? true : (canClaimPremium ? false : true)}
                                                    className={`w-full mt-2 px-3 py-1 disabled:opacity-50 rounded-lg text-xs transition-all
                                                        ${canClaimPremium ? "bg-green-600 hover:bg-green-600/70" : (isCurrentLevel ? "disabled:bg-brand-50!" : "bg-brand-discord-50")}`}
                                                >
                                                    
                                                    {has_premium && isPremiumClaimed && !isCurrentLevel ? "Claimed" : "Claim"}
                                                </button>
                                                
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700 p-3 rounded-full z-10 transition-colors"
                    onClick={() => {
                        scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
                    }}
                >
                    ←
                </button>
                <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700 p-3 rounded-full z-10 transition-colors"
                    onClick={() => {
                        scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
                    }}
                >
                    →
                </button>

            </div>
        </>
    )
}