import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  interface TrainingDeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    trainingName: string;
  }
  
  const TrainingDeleteDialog: React.FC<TrainingDeleteDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    trainingName
  }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Pelatihan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pelatihan "{trainingName}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default TrainingDeleteDialog;