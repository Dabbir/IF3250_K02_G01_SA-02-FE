"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Leaf } from "lucide-react"

interface LoadingStateProps {
    title?: string
    onGoBack?: () => void
}

export default function LoadingState({ title = "Loading", onGoBack }: LoadingStateProps) {
    return (
        <div className="m-5">
            <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        {onGoBack && (
                            <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={onGoBack}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <Leaf className="h-6 w-6 text-slate-700" />
                        <CardTitle>{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                </CardContent>
            </Card>
        </div>
    )
}
