import {
	UmojaLinnCurrency,
	UmojalinnPaymentChannels,
	UmojaLinnProject,
	TPspProvider,
	UmojaLinnWithdrawalMethod
} from "./project";

export type TTransactionMetadata = {
	amount?: number;
	currency?: UmojaLinnCurrency;
	designerId?: string;
	transferId?: string;
	transferStatus?: string;
	withdrawalAmount?: number;
};

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
	projectId: string | null;
	milestoneId: string | null;
	walletId: string;
	withdrawalMethodId: string | null;
	successorId: string | null;
	pspProvider?: TPspProvider | null;
	pspReference?: string | null;
	pspFee?: number | null;
	pspPayoutId?: string | null;
	metadata?: TTransactionMetadata | null;
	createdAt: string;
	updatedAt: string;
	project: UmojaLinnProject | null;
	withdrawalMethod: UmojaLinnWithdrawalMethod | null;
};
