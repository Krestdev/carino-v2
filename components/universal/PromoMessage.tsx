import { isPromotion } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { motion } from "framer-motion";

interface Props {
    message: string
    start: Date
    end: Date
 }

const PromoMessage = ({ message, start, end}: Props) => {
    return (
        <div>
            {isPromotion(start, end) && (
                <Link
                    href="/catalogue/253199"
                    className="relative w-screen overflow-hidden bg-[#29235C] h-[80px] flex items-center border-t border-white"
                >
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: ['0%', '-100%'] }}
                        transition={{
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 200,
                            ease: 'linear',
                        }}
                    >
                        {/* Répétition du message avec marge droite pour éviter l'entrelacement */}
                        {Array.from({ length: 10 }).map((_, index) => (
                            <span
                                key={index}
                                className="font-normal text-[28px] text-[#FFC336] mr-28"
                            >
                                {message}
                            </span>
                        ))}
                    </motion.div>
                </Link>
            )}
        </div>
    )
}

export default PromoMessage
