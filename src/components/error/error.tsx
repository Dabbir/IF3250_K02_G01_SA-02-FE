"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
    error: string
}

export default function ErrorState({ error }: ErrorStateProps) {
    return (
        <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
            <CardContent className="flex justify-center items-center h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} className="bg-[#3A786D] text-white">
                        Coba Lagi
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
