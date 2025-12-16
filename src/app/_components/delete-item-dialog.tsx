"use client";

import * as React from "react";
import { Loader, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
        toast.success(`${items.length} item${items.length > 1 ? "s" : ""} deleted`);
        onSuccess?.();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
        console.error(error);
      }
    });
  }

  /** ESCAPED VERSION FIXING react/no-unescaped-entities */
  const description = (
    <>
      This action cannot be undone. This will permanently delete{" "}
      {items.length === 1 ? (
        <span className="font-medium">&quot;{getItemLabel(items[0])}&quot;</span>
      ) : (
        <span className="font-medium">{items.length} items</span>
      )}
      {" "}from our servers.
    </>
  );

  if (isDesktop) {
    return (
      <Dialog {...props} open={open} onOpenChange={onOpenChange}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={items.length === 0}>
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Delete ({items.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className="border-none bg-white shadow-sm">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              aria-label="Delete selected items"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props} open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" disabled={items.length === 0}>
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({items.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-4">{description}</p>
        </div>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">
              Cancel
            </Button>
          </DrawerClose>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            aria-label="Delete selected items"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
