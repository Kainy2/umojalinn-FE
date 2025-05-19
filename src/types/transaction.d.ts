import {
	UmojaLinnCurrency,
	UmojalinnPaymentChannels,
	UmojaLinnProject,
	UmojaLinnWithdrawalMethod
} from "./project";

export type UmojaLinnTransaction = {
	id: string;
	amount: number;
	transactionId: string;
	currency: UmojaLinnCurrency;
	status: "PENDING" | "FAILED" | "SUCCESS";
	transactionType:
	| "FUND_ESCROW"
	| "WITHDRAWAL_REQUEST"
	| "WALLET_TO_UP"
	| "MILESTONE_COMPLETED";
	paymentChannel: UmojalinnPaymentChannels;
	receiptUrl: string | null;
	projectId: string;
	walletId: string;
	withdrawalMethodId: string | null;
	successorId: string | null;
	createdAt: string; // ISO date string
	updatedAt: string;
	project: UmojaLinnProject;
	withdrawalMethod: UmojaLinnWithdrawalMethod | null; // Replace `unknown` with actual type if available
};
