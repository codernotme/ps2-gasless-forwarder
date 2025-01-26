"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { QrCode } from "@/components/QrCode";
import { TokenBalance } from "@/components/TokenBalance";
import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Loader2, InfoIcon } from "lucide-react";
import { Checkbox } from "@heroui/checkbox";
import { Tooltip } from "@heroui/tooltip";
import { Card } from "@heroui/card";

/**
 * Form validation schema for transaction inputs
 * Validates Ethereum addresses, token types, and amounts
 */
const formSchema = z.object({
  recipient: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid Ethereum address",
  }),
  tokenType: z.enum(["ERC20", "ERC721"]),
  amount: z.string().min(1, {
    message: "Amount is required",
  }),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid token address",
  }),
  usePaymaster: z.boolean().default(false),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

/**
 * Transaction Form Component
 * Handles token transfers with optional gasless transactions via paymaster
 */
export default function TransactionForm() {
  // Form state management
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Wallet connection hooks
  const { address, provider } = useWallet();
  const { toast } = useToast();

  // Form initialization with zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      tokenType: "ERC20",
      amount: "",
      tokenAddress: "",
      usePaymaster: false,
      priority: "medium",
    },
  });

  /**
   * Handle form submission
   * Validates wallet connection and submits transaction
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!address || !provider) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: Implement actual transaction submission
      console.log(values);
      // Simulate transaction hash for QR code
      const mockTxHash = "0x" + Array(64).fill("0").join("");
      setQrCodeData(mockTxHash);
      toast({
        title: "Transaction Submitted",
        description: "Your transaction has been submitted successfully.",
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to submit transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Watch token address for dynamic balance display
  const watchedTokenAddress = form.watch("tokenAddress");

  return (
    <div className="space-y-6 py-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <Input
                label="Recipient Address"
                placeholder="0x..."
                value={form.watch("recipient")}
                onChange={(e) => form.setValue("recipient", e.target.value)}
                isInvalid={!!form.formState.errors.recipient}
                errorMessage={form.formState.errors.recipient?.message}
                description="Enter the Ethereum address of the recipient"
              />
            </div>

            <div>
              <Select
                label="Token Type"
                placeholder="Select token type"
                selectedKeys={[form.watch("tokenType")]}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => form.setValue("tokenType", e.target.value as "ERC20" | "ERC721")}
                isInvalid={!!form.formState.errors.tokenType}
                errorMessage={form.formState.errors.tokenType?.message}
              >
                <SelectItem key="ERC20" value="ERC20">ERC-20</SelectItem>
                <SelectItem key="ERC721" value="ERC721">ERC-721</SelectItem>
              </Select>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <Input
                label="Token Address"
                placeholder="0x..."
                value={form.watch("tokenAddress")}
                onChange={(e) => form.setValue("tokenAddress", e.target.value)}
                isInvalid={!!form.formState.errors.tokenAddress}
                errorMessage={form.formState.errors.tokenAddress?.message}
                description="Enter the contract address of the token"
              />
            </div>

            {watchedTokenAddress && address && (
              <TokenBalance tokenAddress={watchedTokenAddress} />
            )}

            <div>
              <Input
                label="Amount"
                value={form.watch("amount")}
                onChange={(e) => form.setValue("amount", e.target.value)}
                isInvalid={!!form.formState.errors.amount}
                errorMessage={form.formState.errors.amount?.message}
                description={
                  form.watch("tokenType") === "ERC20"
                    ? "Enter the amount of tokens to send"
                    : "Enter the token ID"
                }
              />
            </div>
          </div>
        </div>

        <Card className="p-4 bg-muted/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.watch("usePaymaster")}
                onChange={(e) => form.setValue("usePaymaster", e.target.checked)}
              />
              <label className="text-sm">Use Paymaster for Gas</label>
              <Tooltip content="The paymaster will cover gas fees for this transaction">
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </div>

            <div>
              <label className="text-sm mb-2 block">Transaction Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {["low", "medium", "high"].map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={form.watch("priority") === priority ? "solid" : "light"}
                    onClick={() => form.setValue("priority", priority as "low" | "medium" | "high")}
                    className="capitalize"
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Transaction"
          )}
        </Button>
      </form>

      {qrCodeData && (
        <div className="mt-8">
          <QrCode data={qrCodeData} />
        </div>
      )}
    </div>
  );
}