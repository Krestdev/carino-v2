import { Categories } from '@/types/types'
import React, { useEffect, useRef, useState } from 'react'
import CategoryComp from './CategoryComp'

interface Props {
    categories: Categories[]
}

const CategoryCarousel = ({ categories }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [visibleItems, setVisibleItems] = useState(5)
    const carouselRef = useRef<HTMLDivElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const updateVisibleItems = () => {
            if (typeof window !== 'undefined') {
                const width = window.innerWidth
                if (width < 640) setVisibleItems(1)
                else if (width < 768) setVisibleItems(2)
                else if (width < 1024) setVisibleItems(3)
                else if (width < 1280) setVisibleItems(4)
                else setVisibleItems(5)
            }
        }

        updateVisibleItems()
        window.addEventListener('resize', updateVisibleItems)
        
        return () => {
            window.removeEventListener('resize', updateVisibleItems)
        }
    }, [])

    // Configuration du défilement automatique
    useEffect(() => {
        if (categories.length <= visibleItems) return
        
        const startAutoScroll = () => {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prevIndex => 
                    prevIndex >= categories.length - visibleItems ? 0 : prevIndex + 1
                )
            }, 3000) 
        }

        startAutoScroll()
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [categories.length, visibleItems])

    // Calculer les catégories visibles
    const visibleCategories = categories.slice(currentIndex, currentIndex + visibleItems)
    if (currentIndex > categories.length - visibleItems) {
        visibleCategories.push(...categories.slice(0, visibleItems - (categories.length - currentIndex)))
    }

    return (
        <div className="max-w-[1440px] w-full mx-auto px-5 py-7 relative">        
            <div 
                ref={carouselRef}
                className="relative overflow-hidden"
            >
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
                >
                    {categories.map((cat, i) => (
                        <div 
                            key={i} 
                            className="flex-shrink-0"
                            style={{ width: `${100 / visibleItems}%` }}
                        >
                            <div className="px-2">
                                <CategoryComp 
                                    nom={cat.name} 
                                    nbProduit="" 
                                    image={cat.image ? cat.image : "/images/imagePlaceholder.svg"} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryCarousel