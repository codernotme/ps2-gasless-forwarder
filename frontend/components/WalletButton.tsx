"use client";

import { Button } from "@heroui/button";
import { useWallet } from "@/hooks/useWallet";
import { Loader2, Wallet2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@heroui/dropdown";

export function WalletButton() {
  const { address, isConnecting, connect, disconnect } = useWallet();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  if (isConnecting) {
    return (
      <Button variant="bordered" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (address) {
    return (
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant="bordered">
            <Wallet2 className="mr-2 h-4 w-4" />
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownSection>
            <DropdownItem key="disconnect" onClick={handleDisconnect}>
              Disconnect
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Button variant="bordered" onClick={handleConnect}>
      <Wallet2 className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}