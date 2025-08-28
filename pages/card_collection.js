
import {
    Image,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import EmptyScreen from '../components/EmptyScreen';

import Head from 'next/head'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Paginator from "../components/Paginator"
import TypographyH1 from "../components/TypographyH1";

import {
    renderDiscordEmojis,
    getValidCard,
    trimImageUrl
} from '@utils/functions';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../components/ui/drawer"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

export default function CardCollection() {
    const ITEMS_PER_PAGE = 10;
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')
    const router = useRouter()
    const [dbUser, setDbUser] = useState(null)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedCard, setSelectedCard] = useState(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const handleCardClick = (card) => {
        setSelectedCard(card);
        onOpen();
    };

    const [activePage, setActivePage] = useState(1);
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = dbUser?.slice(startIndex, endIndex) || [];

    useEffect(() => {
        const fetchDbUser = async (discordId) => {
            try {
                console.log('Fetching user with ID:', discordId)
                const response = await axios.get(`${API_URL}/api/user/card_collection/${discordId}`)
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

            <Paginator
                page={activePage}
                onChange={setActivePage}
                total={Math.ceil((dbUser?.length || 0) / ITEMS_PER_PAGE)}
            />

            <div className="m-3 gap-3 grid grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 xl:!grid-cols-5 2xl:!grid-cols-6 mobile-only:grid-cols-2 tablet-only:grid-cols-3">
                <AnimatePresence mode="wait">
                    {currentItems.map((card, index) => (
                        <motion.div
                            key={card.id} // make sure key is unique per card
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className=" w-full bg-brand-discord-50 mb-3 rounded-2xl" isPressable shadow="md" onPress={() => handleCardClick(card)}>
                                <CardBody className="overflow-visible p-0">
                                    <Image
                                        alt={card.title}
                                        className=" object-cover object-center"
                                        radius="lg"
                                        shadow="sm"
                                        src={getValidCard(trimImageUrl(card.image))}
                                        width={400}
                                        height="auto"
                                        fallbackSrc="/placeholder-card.png"
                                    />
                                </CardBody>
                                <CardFooter className="text-small text-white bg-brand justify-between">
                                    <b className='truncate w-50 ml-1'>
                                        {renderDiscordEmojis(card.emoji)} {renderDiscordEmojis(card.rarity_icon)} {card.display_name}: {card.title}
                                    </b>
                                    <p className="text-white">{card.dupe}×</p>
                                </CardFooter>
                            </Card>

                            <Modal
                                isOpen={isOpen}
                                onOpenChange={onOpenChange}
                                classNames={{
                                    backdrop: "bg-black/15" // Very low opacity (20%)
                                }}
                            >
                                <ModalContent className="bg-brand-discord-50 text-white items-center h-min m-80 rounded-2xl p-10">
                                    {(onClose) => (
                                        <>
                                            <ModalHeader>{renderDiscordEmojis(selectedCard.emoji)} {selectedCard?.display_name}{selectedCard?.title ? ": " + selectedCard?.title : ""}</ModalHeader>
                                            <ModalBody>
                                                {selectedCard && (
                                                    <div>
                                                        <Image
                                                            alt={selectedCard.title}
                                                            className="w-500 object-cover mb-4"
                                                            radius="lg"
                                                            src={getValidCard(trimImageUrl(selectedCard.image))}
                                                            fallbackSrc="/placeholder-card.png"
                                                            width={200}
                                                            height={100}
                                                        />
                                                        <p><strong>Rarity:</strong> {renderDiscordEmojis(selectedCard.rarity_icon)}</p>
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

                            {/*<Drawer>
                                <DrawerTrigger asChild>
                                    <Button variant="outline">Open Drawer</Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <div className="mx-auto w-full max-w-sm">
                                        <DrawerHeader>
                                            <DrawerTitle>Move Goal</DrawerTitle>
                                            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                                        </DrawerHeader>
                                        <div className="p-4 pb-0">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                    onClick={() => onClick(-10)}
                                                    
                                                >
                                                    
                                                    <span className="sr-only">Decrease</span>
                                                </Button>
                                                <div className="flex-1 text-center">
                                                    <div className="text-7xl font-bold tracking-tighter">
                                                        a
                                                    </div>
                                                    <div className="text-muted-foreground text-[0.70rem] uppercase">
                                                        Calories/day
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                    onClick={() => onClick(10)}
                                                   
                                                >
                                                    Plus
                                                    <span className="sr-only">Increase</span>
                                                </Button>
                                            </div>
                                            <div className="mt-3 h-[120px]">
                                                
                                            </div>
                                        </div>
                                        <DrawerFooter>
                                            <Button>Submit</Button>
                                            <DrawerClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </div>
                                </DrawerContent>
                            </Drawer>*/}

                        </motion.div>
                    ))}

                </AnimatePresence>

            </div>

        </div>
    );
}
