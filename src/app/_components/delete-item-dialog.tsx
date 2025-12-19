"use client";

import * as React from "react";
import { Loader, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,

  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,

  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,

} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DeleteItemsDialogProps<T> extends React.ComponentPropsWithoutRef<typeof Dialog> {
  items: T[];
  deleteAction: (items: T[]) => Promise<{ error?: string } | void>;
  showTrigger?: boolean;
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  getItemLabel?: (item: T) => string;
}

export function DeleteItemsDialog<T>({
  items,
  deleteAction,
  showTrigger = true,
  onSuccess,
  onOpenChange,
  open,
  getItemLabel = (item) => JSON.stringify(item),
  ...props
}: DeleteItemsDialogProps<T>) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function onDelete() {
    startDeleteTransition(async () => {
      try {
        const result = await deleteAction(items);
        if (result && "error" in result && result.error) {
          toast.error(result.error);
          return;
        }
        onOpenChange?.(false);
        toast.success(`Suppression effectuée avec succès`);
        onSuccess?.();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
        console.error(error);
      }
    });
  }

  const description = (
    <div className="space-y-3">
      <p>
        Cette action est irréversible. Ceci supprimera définitivement l&apos;acte{" "}
        {items.length === 1 ? (
          <span className="font-bold text-red-600">&quot;{getItemLabel(items[0])}&quot;</span>
        ) : (
          <span className="font-medium">{items.length} éléments</span>
        )}
        {" "}de votre catalogue.
      </p>
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
        <p className="text-[12px] text-amber-800 leading-relaxed italic">
          <strong>Note pragmatique :</strong> Le service (département) restera intact. Seul cet acte spécifique et son tarif associé seront retirés.
        </p>
      </div>
    </div>
  );

  const footerButtons = (
    <>
      <Button
        variant="outline"
        onClick={() => onOpenChange?.(false)}
        className="bg-slate-100 hover:bg-slate-200 border-none text-slate-900"
      >
        Annuler
      </Button>
      <Button
        className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
        onClick={onDelete}
        disabled={isDeletePending}
      >
        {isDeletePending ? (
          <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="mr-2 size-4" aria-hidden="true" />
        )}
        Confirmer la suppression
      </Button>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog {...props} open={open} onOpenChange={onOpenChange}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={items.length === 0} className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="mr-2 size-4" /> Supprimer ({items.length})
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="border-none bg-white shadow-2xl sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Supprimer l&apos;acte médical ?</DialogTitle>
            <DialogDescription asChild>
              <div className="pt-4 text-slate-600">{description}</div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            {footerButtons}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props} open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-lg font-bold">Supprimer l&apos;acte médical ?</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 text-slate-600">
          {description}
        </div>
        <DrawerFooter className="gap-2 pb-8">
          {footerButtons}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}