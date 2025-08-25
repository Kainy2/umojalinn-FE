import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import {
	DialogDescription,
	DialogProps,
	DialogTitle,
	DialogTrigger,
} from "@radix-ui/react-dialog";
import Image from "next/image";
import React from "react";

type ButtonOnClickProp = React.ComponentProps<"button">["onClick"];
type FundMilestoneDialogProps =  DialogProps & {
		onConfirm?: ButtonOnClickProp;
		pendingConfirm?: boolean;
		open: boolean, 
		setOpen:(open: boolean)=>void
	}
	
const FundMilestoneDialog = (
	{
		open, 
		setOpen,
		...props
	}: FundMilestoneDialogProps
) => {

	return (
		<Dialog open={open} onOpenChange={setOpen} {...props}>
			<DialogTrigger asChild onClick={() => setOpen(true)}>
				{props.children}
			</DialogTrigger>
			<DialogContent className="flex flex-col text-center [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[40vw]">
				<DialogHeader className="flex gap-2 flex-col items-center mb-4">
					<div className="text-green-500  w-24 h-24 md:w-32 md:h-32 relative">
						<Image
							src="/img/svg/lightening.svg"
							alt="success"
							fill
							className=" absolute"
						/>
					</div>
					<div className="space-y-1">
						<DialogTitle className="font-semibold text-center text-green-500 text-[24px] ">
							Milestone approved
						</DialogTitle>
						<DialogDescription className="text-sm text-gray-600 text-center">
							Fund Escrow to Proceed to The Next Milestone
						</DialogDescription>
					</div>
				</DialogHeader>
				<DialogFooter>
					<Button onClick={props?.onConfirm} fullWidth>
						Fund escrow
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default FundMilestoneDialog;
