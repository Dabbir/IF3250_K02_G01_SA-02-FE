import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "../ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import AddActivityDialog from "./addactivity";
import ExportButton from "./exporttemplate";
import ExportTemplate from "./exporttemplate";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface ChooseMethod {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const ChooseMethod = ({ isOpen, setIsOpen }: ChooseMethod) => {
    const [isForm, setIsForm] = useState(false);
    const [isXlsx, setIsXlsx] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                key={isOpen ? "open" : "closed"}
                className="max-w-[600px] max-h-[95vh] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle className="text-center">Tambah Kegiatan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-4 flex justify-center">
                            <Button 
                                onClick={() => { setIsForm(true); setIsOpen(false); }} 
                                className="bg-[var(--green)] hover:bg-[var(--blue)] hover:scale-0.95 text-white"
                            >
                                Form Tambah
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex justify-center">
                            <Button 
                                onClick={() => { setIsXlsx(true); setIsOpen(false); }} 
                                className="bg-[var(--green)] hover:bg-[var(--blue)] hover:scale-0.95 text-white"
                            >
                                Export Xlsx File
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
            <AddActivityDialog
            isOpen={isForm}
            setIsOpen={setIsForm}
            />
            <ExportTemplate
            isOpen={isXlsx}
            setIsOpen={setIsXlsx}
            />
        </Dialog>

    );
};

export default ChooseMethod;
