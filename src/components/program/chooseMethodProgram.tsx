import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import AddProgramDialog from "./addProgramDialog";
import ExportTemplateProgram from "./exportTemplateProgram";

interface ChooseMethodProgramProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onRefresh: () => void;
}

export default function ChooseMethodProgram({
  isOpen,
  setIsOpen,
  onRefresh,
}: ChooseMethodProgramProps) {
  const [isForm, setIsForm] = useState(false);
  const [isXlsx, setIsXlsx] = useState(false);

  const handleCloseAll = () => {
    setIsForm(false);
    setIsXlsx(false);
    setIsOpen(false);
    onRefresh();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          key={isOpen ? "open" : "closed"}
          className="max-w-[600px] max-h-[95vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-center">Tambah Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 flex justify-center">
                <Button
                  className="bg-[#3A786D] text-white hover:bg-[var(--blue)]"
                  onClick={() => {
                    setIsForm(true);
                    setIsOpen(false);
                  }}
                >
                  Form Tambah
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex justify-center">
                <Button
                  className="bg-[#3A786D] text-white hover:bg-[var(--blue)]"
                  onClick={() => {
                    setIsXlsx(true);
                    setIsOpen(false);
                  }}
                >
                  Export Xlsx File
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <AddProgramDialog
        isOpen={isForm}
        setIsOpen={(open) => {
          if (!open) handleCloseAll();
        }}
      />

      <ExportTemplateProgram
        isOpen={isXlsx}
        setIsOpen={(open) => {
          if (!open) handleCloseAll();
        }}
      />
    </>
  );
}
