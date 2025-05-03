import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoadingState() {
    return (
        <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
            <CardContent className="flex justify-center items-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
            </CardContent>
        </Card>
    )
}
