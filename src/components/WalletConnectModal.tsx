"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";

interface WalletConnectModalProps {
  open: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

export default function WalletConnectModal({
  open,
  onClose,
  onConnect,
}: WalletConnectModalProps) {
  const handleConnect = () => {
    // Mock wallet connection
    const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0";
    onConnect(mockAddress);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        data-testid="dialog-wallet-connect"
      >
        <div className="flex flex-col items-center text-center space-y-6 py-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-md" />
            <span className="text-2xl font-bold text-primary">based</span>
          </div>

          <h2 className="text-xl font-semibold">Login to Based</h2>

          <div className="w-full space-y-3">
            <Button
              className="w-full bg-white text-black hover:bg-white/90"
              size="lg"
              data-testid="button-login-email"
            >
              Login with Email
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                className="gap-2"
                size="lg"
                data-testid="button-login-google"
              >
                <SiGoogle className="h-4 w-4" />
                Google
              </Button>
              <Button
                variant="secondary"
                className="gap-2"
                size="lg"
                data-testid="button-login-apple"
              >
                <SiApple className="h-4 w-4" />
                Apple
              </Button>
            </div>

            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              Protected by <span className="font-semibold">privy</span>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleConnect}
              data-testid="button-connect-wallet"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Download our mobile app
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="hover-elevate rounded-md"
                  data-testid="button-google-play"
                >
                  <div className="h-10 px-4 bg-muted rounded-md flex items-center gap-2">
                    <div className="text-xs">
                      GET IT ON
                      <br />
                      <span className="font-semibold">Google Play</span>
                    </div>
                  </div>
                </button>
                <button
                  className="hover-elevate rounded-md"
                  data-testid="button-app-store"
                >
                  <div className="h-10 px-4 bg-muted rounded-md flex items-center gap-2">
                    <div className="text-xs">
                      Download on the
                      <br />
                      <span className="font-semibold">App Store</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
