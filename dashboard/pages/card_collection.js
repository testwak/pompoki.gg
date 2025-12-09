
import {
    Image,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input
} from "@heroui/react";

import { Select, SelectSection, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import EmptyScreen from '../components/EmptyScreen';

import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Paginator from "../components/Paginator"
import TypographyH1 from "../components/TypographyH1";

import {
    renderDiscordEmojis,
    getValidCard,
    trimImageUrl
} from '@utils/functions';

export default function CardCollection() {
    const ITEMS_PER_PAGE = 10;
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')
    const router = useRouter()
    const [dbUser, setDbUser] = useState(null)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedCard, setSelectedCard] = useState(null);
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const renderedEmoji = useMemo(
        () => renderDiscordEmojis(selectedCard?.emoji),
        [selectedCard?.emoji]
    );

    const renderedRarityIcon = useMemo(
        () => renderDiscordEmojis(selectedCard?.rarity_icon),
        [selectedCard?.rarity_icon]
    );

    const handleCardClick = (card) => {
        setSelectedCard(card);
        onOpen();
    };

    const [activePage, setActivePage] = useState(1);
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRarity, setSelectedRarity] = useState('all');

    // Add this filtered data logic before currentItems
    const filteredData = useMemo(() => {
        if (!dbUser) return [];

        return dbUser.filter(card => {
            const term = searchTerm.toLowerCase().trim();
            const displayName = card.display_name?.toLowerCase().trim() || '';
            const rawName = card.raw_name?.toLowerCase().trim() || '';
          
            const matchesSearch = displayName.includes(term) || rawName.includes(term);
            const matchesRarity = selectedRarity === 'all' || String(card.rarity) === selectedRarity;
          
            return matchesSearch && matchesRarity;
          });          
    }, [dbUser, searchTerm, selectedRarity]);

    const currentItems = filteredData?.slice(startIndex, endIndex) || [];

    const rarities = [
        { key: "all", label: "All Rarity" },
        { key: "1", label: "One" },
        { key: "2", label: "Two" },
        { key: "3", label: "Three" },
        { key: "4", label: "Four" },
        { key: "5", label: "Five" },
    ];

    useEffect(() => {
        const fetchDbUser = async (discordId) => {
            try {
                console.log('Fetching user with ID:', discordId)
                const response = await axios.get(`${API_URL}/api/user/card_collection/${discordId}`)
                // console.log('Response:', response.data)
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
                const response = await axios.get(`/api/_auth/user?token=${token}`)

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
    }, [API_URL, router, router.isReady, router.query])

    if (loading) {
        return (
            <>
                <Head>
                    <title>Card Collection - Loading</title>
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

    if (!dbUser) {
        return (
            <>
                <Head>
                    <title>Card Collection - Not Found</title>
                </Head>
                < EmptyScreen />
            </>
        )
    }

    return (
        <div className="bg-brand-discord">
            <Head>
                <title>Card Collection - {user.username}</title>
            </Head>

            <br />
            <TypographyH1 text={"Card Collection"} />
            <Divider className="my-3 bg-brand-discord-50" />
            <div className="mx-3 mb-4 flex gap-3 flex-wrap ">
                <Input
                    placeholder="Search cards..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    className="max-w-xs"
                    label="Card Name"
                />

                <Select
                    className="max-w-xs"
                    items={rarities}
                    label="Rarity"
                    placeholder="Select rarity of card."
                    onChange={(e) => setSelectedRarity(e.target.value)}
                >
                    {(items) => <SelectItem key={items.key}>{items.label}</SelectItem>}
                </Select>
            </div>
            <Divider className="my-3 bg-brand-discord-50" />
            <Paginator
                page={activePage}
                onChange={setActivePage}
                total={Math.ceil((filteredData?.length || 0) / ITEMS_PER_PAGE)}
            />
            
            <div className="min-h-min m-3 gap-3 grid grid-cols-2 md:grid-cols-3! lg:grid-cols-4! xl:grid-cols-5! 2xl:grid-cols-6! mobile-only:grid-cols-2 tablet-only:grid-cols-3">
                <AnimatePresence mode="wait">
                    {currentItems.map((card, index) => (
                        <motion.div
                            key={card.id} // make sure key is unique per card
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >

                            <Card className=" w-full bg-brand-discord-50 mb-3 rounded-2xl transition-transform duration-400 hover:-translate-y-3" isPressable shadow="md" onPress={() => handleCardClick(card)}>
                                <CardBody className="overflow-visible p-0 h-[400px] relative bg-brand-discord-50 flex items-center justify-center">
                                    <Image
                                        alt={card.title}
                                        className="object-cover w-full h-full"
                                        radius="lg"
                                        shadow="sm"
                                        src={getValidCard(trimImageUrl(card.image))}
                                        width={400}
                                        height={400}
                                        fallbackSrc="/placeholder-card.png"
                                        loading="lazy"
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center bg-brand-discord-50/90 animate-pulse pointer-events-none">
                                        <span className="text-white text-sm">Loading...</span>
                                    </div>
                                </CardBody>
                                <CardFooter className="text-small text-white bg-brand justify-between">
                                    <b className='truncate w-50 ml-1'>
                                        {renderDiscordEmojis(card.emoji)} {renderDiscordEmojis(card.rarity_icon)} {card.display_name}: {card.title}
                                    </b>
                                    <p className="text-white">{card.dupe}×</p>
                                </CardFooter>
                            </Card>

                        </motion.div>

                    ))}

                    <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        backdrop="opaque"
                        motionProps={{
                            variants: {
                                enter: {
                                    opacity: 1,
                                    transition: { duration: 0.15 }
                                },
                                exit: {
                                    opacity: 0,
                                    transition: { duration: 0.1 }
                                }
                            }
                        }}
                        classNames={{
                            backdrop: "bg-black/80",
                            wrapper: "z-[999]"
                        }}
                    >
                        <ModalContent className="bg-brand-discord-50 text-white items-center h-min">
                            {(onClose) => (
                                <>

                                    <ModalHeader>{renderedEmoji} {selectedCard?.display_name}{selectedCard?.title ? ": " + selectedCard?.title : ""}</ModalHeader>
                                    <ModalBody>
                                        {isOpen && selectedCard && (
                                            <div>
                                                <Image
                                                    alt={selectedCard.title}
                                                    className="object-cover mb-4"
                                                    radius="lg"
                                                    src={getValidCard(trimImageUrl(selectedCard.image))}
                                                    fallbackSrc="/placeholder-card.png"
                                                    height={350}

                                                />
                                                <p><strong>Rarity:</strong> {renderedRarityIcon}</p>
                                                <p><strong>Dupe:</strong> {selectedCard.dupe}×</p>
                                            </div>
                                        )}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button className="text-white" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>

                </AnimatePresence>

            </div>

        </div>
    );
}
