"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@qpub/qui";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Chip } from "@/components/ui/Chip";
import { History } from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import SwapModal from "./SwapModal";
import { toast } from "sonner";
import type { Transaction } from "@/types";
import { SwapLinearIcon, YCoinIcon } from "@/components/ui/icons";

export default function WalletDashboard() {
  const { balance, transactions, fetchBalance, fetchTransactions } = useWalletStore();
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBalance(), fetchTransactions()])
      .catch((err) => {
        toast.error(err?.response?.data?.error || "Couldn't load wallet. Please try again.");
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

  const formatAmount = (amount: number) =>
    `${amount >= 0 ? "+" : ""}${amount.toFixed(2)} Y-COIN`;

  const getTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "reward": return "success";
      case "swap": return "warning";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "success";
      case "pending": return "warning";
      case "failed": return "danger";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-default-500 text-sm">
                <YCoinIcon size={16} />
                <span>Total Balance</span>
              </div>
              <h2 className="text-5xl font-bold">
                {initialLoading ? "Loading…" : balance.toFixed(2)}
              </h2>
              <p className="text-sm text-default-500">Y-COIN</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <YCoinIcon size={40} className="text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <AnimatedButton
          color="primary"
          size="lg"
          onClick={() => setIsSwapModalOpen(true)}
          startContent={<SwapLinearIcon size={20} />}
        >
          Swap Y-COIN
        </AnimatedButton>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Transaction History</h3>
          </div>

          {initialLoading ? (
            <p className="text-center py-8 text-default-500">Loading…</p>
          ) : transactions.length === 0 ? (
            <p className="text-center py-8 text-default-500">No transactions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DATE</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead>STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <Chip color={getTypeColor(transaction.type)} variant="flat" size="sm">
                        {transaction.type.toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell className={transaction.amount >= 0 ? "text-success" : "text-danger"}>
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Chip color={getStatusColor(transaction.status)} variant="flat" size="sm">
                        {transaction.status}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        currentBalance={balance}
      />
    </div>
  );
}
