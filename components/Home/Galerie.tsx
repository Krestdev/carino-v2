"use client"
import { useRef, useEffect, useState } from "react"

const Galerie = () => {
    const images: string[] = [
        "/galerie/1.webp",
        "/galerie/2.webp",
        "/galerie/3.webp",
        "/galerie/4.webp",
        "/galerie/1.webp",
    ]

    const containerRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let animationId: number
        let scrollAmount = 0
        let lastTimestamp = 0
        const speed = 50 // pixels par seconde

        const animate = (timestamp: number) => {
            if (!container) return

            if (lastTimestamp === 0) {
                lastTimestamp = timestamp
                animationId = requestAnimationFrame(animate)
                return
            }

            const delta = Math.min(timestamp - lastTimestamp, 100)
            lastTimestamp = timestamp

            if (!isHovered) {
                scrollAmount += (speed * delta) / 1000

                if (scrollAmount >= container.scrollWidth - container.clientWidth) {
                    scrollAmount = 0
                }

                container.scrollLeft = scrollAmount
            }

            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)

        return () => {
            if (animationId) cancelAnimationFrame(animationId)
        }
    }, [isHovered])

    return (
        <div className="py-12 md:py-24 w-full">
            <div
                ref={containerRef}
                className="flex gap-5 overflow-x-auto w-full cursor-grab"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                <div className="flex gap-5 w-max">
                    {[...images, ...images].map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Galerie ${index + 1}`}
                            className={`
                                shrink-0 select-none object-cover
                                ${index % 2 === 0
                                    ? "w-[300px] md:w-[450px] aspect-3/2"
                                    : "w-[140px] md:w-[210px] aspect-2/3"
                                }
                            `}
                            draggable={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Galerie