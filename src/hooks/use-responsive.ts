"use client"

import { useState, useEffect } from "react"

export default function useResponsive() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768)
        }

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return { isMobileView }
}
