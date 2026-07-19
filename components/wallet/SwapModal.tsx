"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@qpub/qui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowRightLeft } from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import { toast } from "sonner";

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

export default function SwapModal({ isOpen, onClose, currentBalance }: SwapModalProps) {
  const [amount, setAmount] = useState("");
  const { swap, isLoading } = useWalletStore();

  const handleSwap = async () => {
    const swapAmount = parseFloat(amount);
    if (!swapAmount || swapAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (swapAmount > currentBalance) {
      toast.error("Insufficient balance");
      return;
    }
    try {
      await swap(swapAmount);
      toast.success(`Successfully swapped ${swapAmount} Y-COIN!`);
      setAmount("");
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Swap failed. Please try again.");
    }
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              <span>Swap Y-COIN</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-default-500">
            Available Balance: <span className="font-semibold text-foreground">{currentBalance} Y-COIN</span>
          </p>
          <Input
            type="number"
            label="Amount"
            placeholder="Amount in Y-COIN"
            value={amount}
            onValueChange={setAmount}
            variant="bordered"
            min="0"
            max={currentBalance.toString()}
          />
          <p className="text-xs text-default-400">
            Processed via Vit-Rin. May take a few moments.
          </p>
        </div>

        <DialogFooter>
          <Button variant="flat" color="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSwap}
            isLoading={isLoading}
            className="font-semibold"
          >
            <span className="flex items-center gap-2"><ArrowRightLeft className="w-4 h-4" />Confirm Swap</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
