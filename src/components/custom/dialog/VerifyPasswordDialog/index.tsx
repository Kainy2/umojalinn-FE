"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { IVerifyPasswordDialogProps } from "./@types";
import { useVerifyWalletPassword } from "@/tanstack/hooks/useUser";
import { toast } from "@/hooks/use-toast";

export default function VerifyPasswordDialog({
    open,
    onCancel,
    onSuccess,
}: IVerifyPasswordDialogProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { mutate: verifyPassword, isPending } = useVerifyWalletPassword();

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen && onCancel) {
            onCancel();
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || !email) return;

        verifyPassword(
            { email, password },
            {
                onSuccess: () => {
                    onSuccess();
                    setPassword("");
                },
                onError: () => {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Verification failed. Please check your password."
                    });
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange} >
            <DialogContent className="sm:max-w-[400px] md:max-w-[500px] rounded-none">
                <DialogHeader className="flex flex-col items-center sm:text-center text-center space-y-3 pt-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100/50">
                        <ShieldCheck className="h-6 w-6 text-yellow-500" />
                    </div>
                    <DialogTitle className="text-[18px] font-semibold">Enter your password</DialogTitle>
                    <DialogDescription className="text-xs text-foreground-body">
                        Enter your password to view your Wallet
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleVerify} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email or username</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <DialogFooter className="flex w-full gap-2 sm:space-x-0 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full flex-1"
                            onClick={() => {
                                if (onCancel) onCancel();
                            }}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                            loading={isPending}

                        >
                            Verify
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
