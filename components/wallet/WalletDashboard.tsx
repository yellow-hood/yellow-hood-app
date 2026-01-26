"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import { Coins, ArrowRightLeft, History } from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import SwapModal from "./SwapModal";
import { toast } from "sonner";
import type { Transaction } from "@/types";

export default function WalletDashboard() {
  const { balance, transactions, fetchBalance, fetchTransactions } =
    useWalletStore();
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBalance(), fetchTransactions()])
      .catch((err) => {
        toast.error(
          err?.response?.data?.error || "Couldn't load wallet. Please try again."
        );
      })
      .finally(() => setInitialLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const formatAmount = (amount: number) => {
    return `${amount >= 0 ? "+" : ""}${amount.toFixed(2)} Y-COIN`;
  };

  const getTransactionTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "reward":
        return "success";
      case "swap":
        return "warning";
      case "system":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 shadow-xl shadow-primary/20">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-default-500 text-sm">
                <Coins className="w-4 h-4" />
                <span>Total Balance</span>
              </div>
              <h2 className="text-5xl font-bold text-foreground">
                {initialLoading ? "Loading…" : balance.toFixed(2)}
              </h2>
              <p className="text-sm text-default-500">Y-COIN</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shadow-lg shadow-primary/30">
              <Coins className="w-10 h-10 text-primary" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Swap Button */}
      <div className="flex justify-center">
        <Button
          color="primary"
          size="lg"
          onPress={() => setIsSwapModalOpen(true)}
          className="font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all min-w-[200px]"
          startContent={<ArrowRightLeft className="w-5 h-5" />}
        >
          Swap Y-COIN
        </Button>
      </div>

      {/* Transaction History */}
      <Card className="bg-content1 border border-default-200">
        <CardBody className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Transaction History</h3>
          </div>

          {initialLoading ? (
            <div className="text-center py-8 text-default-500">
              Loading…
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-default-500">
              No transactions yet.
            </div>
          ) : (
            <Table aria-label="Transaction history" removeWrapper>
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
                <TableColumn>STATUS</TableColumn>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <Chip
                        color={getTransactionTypeColor(transaction.type)}
                        variant="flat"
                        size="sm"
                      >
                        {transaction.type.toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell
                      className={
                        transaction.amount >= 0
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(transaction.status)}
                        variant="flat"
                        size="sm"
                      >
                        {transaction.status}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Swap Modal */}
      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        currentBalance={balance}
      />
    </div>
  );
}

