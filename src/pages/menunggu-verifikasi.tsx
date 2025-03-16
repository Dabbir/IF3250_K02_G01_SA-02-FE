import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const WaitVerification = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#E7DECD] gap-8">
        <img className="w-50" src="/logo-green.svg" alt="logo-salman"/>
        <Card className='w-65 h-auto md:w-120 md:h-80'>
            <CardHeader className="flex flex-col justify-center items-center text-center">
                <Clock className="text-[#3A786D] w-16 h-16 md:w-25 md:h-25"/>
                <CardTitle className=" text-xl md:text-3xl">Menunggu Verifikasi</CardTitle>
                <CardDescription className='text-sm md:text-base'>Dokumen anda telah berhasil di unggah. Menunggu verifikasi oleh pihak SSR.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full mt-4 bg-[#3A786D] hover:bg-black text-[#FBFAF8]" onClick={() => navigate('/login')}>
                KEMBALI
              </Button>
            </CardFooter>
        </Card>
    </div>
  )
}

export default WaitVerification;