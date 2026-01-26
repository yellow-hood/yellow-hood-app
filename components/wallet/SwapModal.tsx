"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Coins, ArrowRightLeft } from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import { toast } from "sonner";

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

export default function SwapModal({
  isOpen,
  onClose,
  currentBalance,
}: SwapModalProps) {
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
      toast.error(
        error?.response?.data?.error || "Swap failed. Please try again."
      );
    }
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      classNames={{
        base: "bg-content1 border border-primary/20",
        header: "border-b border-divider",
        footer: "border-t border-divider",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">Swap Y-COIN</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-default-500 mb-2">
                Available Balance: <span className="font-semibold text-foreground">{currentBalance} Y-COIN</span>
              </p>
            </div>
            
            <Input
              type="number"
              label="Amount"
              placeholder="Amount in Y-COIN"
              value={amount}
              onValueChange={setAmount}
              startContent={<Coins className="w-4 h-4 text-default-400" />}
              variant="bordered"
              classNames={{
                input: "text-foreground",
                label: "text-foreground",
                inputWrapper: "border-default-200 hover:border-primary/50 focus-within:border-primary",
              }}
              min="0"
              max={currentBalance.toString()}
            />

            <div className="p-3 rounded-lg bg-default-100 border border-default-200">
              <p className="text-xs text-default-500">
                Processed via Vit-Rin. May take a few moments.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSwap}
            isLoading={isLoading}
            className="font-semibold shadow-lg shadow-primary/30"
            startContent={!isLoading && <ArrowRightLeft className="w-4 h-4" />}
          >
            {isLoading ? "Processing..." : "Confirm Swap"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

