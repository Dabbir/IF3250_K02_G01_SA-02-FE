import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "../ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import AddPublicationDialog from "./addpublicationdialog";
import ExportTemplatePublication from "./exporttemplatepublication";

interface ChooseMethodProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onRefreshData: () => void;
}

const ChooseMethodPublication = ({ isOpen, setIsOpen, onRefreshData }: ChooseMethodProps) => {
    const [isForm, setIsForm] = useState(false);
    const [isXlsx, setIsXlsx] = useState(false);

    const handleFormClose = () => {
        setIsForm(false);
        onRefreshData();
    };

    const handleXlsxClose = () => {
        setIsXlsx(false);
        onRefreshData();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                key={isOpen ? "open" : "closed"}
                className="max-w-[600px] max-h-[95vh] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle className="text-center">Tambah Publikasi</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-4 flex justify-center">
                            <Button 
                                onClick={() => { setIsForm(true); setIsOpen(false); }} 
                                className="bg-[#3A786D] hover:bg-[var(--blue)] hover:scale-95 text-white"
                            >
                                Form Tambah
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex justify-center">
                            <Button 
                                onClick={() => { setIsXlsx(true); setIsOpen(false); }} 
                                className="bg-[#3A786D] hover:bg-[var(--blue)] hover:scale-95 text-white"
                            >
                                Export Xlsx File
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
            <AddPublicationDialog
                isOpen={isForm}
                setIsOpen={handleFormClose}
                onSuccess={onRefreshData}
            />
            <ExportTemplatePublication
                isOpen={isXlsx}
                setIsOpen={handleXlsxClose}
                onSuccess={onRefreshData}
            />
        </Dialog>
    );
};

export default ChooseMethodPublication;