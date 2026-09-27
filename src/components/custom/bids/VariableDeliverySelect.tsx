import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { EDeliveryMileStoneType } from '@/types/enum';
import { PopoverClose } from '@radix-ui/react-popover';
import { ChevronDown } from 'lucide-react';
import React, { useMemo } from 'react'



const deliveryMethodsTypes = [
	{
		label: "Fixed Delivery",
		value: EDeliveryMileStoneType.FIXED,
		listDescription: "Delivery method cannot be changed",
		description: "Selecting Fixed Delivery means you can't change the delivery price or method once the pricing has been set. This delivery type works best if you know the delivery cost and method you will use upfront.",
		savedDescription: "Fixed Delivery means the set delivery price and method cannot be changed once the bid has been accepted and the project is live.",
		icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.6666 4.85221L7.99998 8.00036M7.99998 8.00036L2.33331 4.85221M7.99998 8.00036L8 14.3337M9.33333 13.9263L8.51802 14.3793C8.32895 14.4843 8.23442 14.5368 8.1343 14.5574C8.0457 14.5756 7.95431 14.5756 7.8657 14.5574C7.76559 14.5368 7.67105 14.4843 7.48198 14.3793L2.54865 11.6385C2.34897 11.5276 2.24912 11.4721 2.17642 11.3932C2.11211 11.3234 2.06343 11.2407 2.03366 11.1506C2 11.0487 2 10.9345 2 10.7061V5.29468C2 5.06625 2 4.95204 2.03366 4.85017C2.06343 4.76005 2.11211 4.67733 2.17642 4.60754C2.24912 4.52865 2.34897 4.47318 2.54865 4.36225L7.48198 1.6215C7.67105 1.51647 7.76559 1.46395 7.8657 1.44336C7.95431 1.42513 8.0457 1.42513 8.1343 1.44336C8.23442 1.46395 8.32895 1.51646 8.51802 1.6215L13.4514 4.36224C13.651 4.47318 13.7509 4.52865 13.8236 4.60754C13.8879 4.67733 13.9366 4.76005 13.9663 4.85017C14 4.95204 14 5.06625 14 5.29468L14 8.33372M5 3.00038L11 6.33371M10.6667 12.0004L12 13.3337L14.6667 10.667" stroke="#475467" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
	},
	{
		label: "Variable Delivery",
		value: EDeliveryMileStoneType.VARIABLE,
		listDescription: "Delivery method can be changed",
		description: "Selecting Variable Delivery means you can make adjustments in the delivery price and method at a later stage. This delivery type works when you are uncertain about delivery charges upfront.",
		savedDescription: "Variable Delivery means adjustments can be made to the delivery price and method at a later stage. Please note, your designer may not have a fixed delivery price upfront and this method may be preferable.",
		icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.6666 4.85221L7.99998 8.00036M7.99998 8.00036L2.33331 4.85221M7.99998 8.00036L8 14.3337M9.33333 13.9263L8.51802 14.3793C8.32895 14.4843 8.23442 14.5368 8.1343 14.5574C8.0457 14.5756 7.95431 14.5756 7.8657 14.5574C7.76559 14.5368 7.67105 14.4843 7.48198 14.3793L2.54865 11.6385C2.34897 11.5276 2.24912 11.4721 2.17642 11.3932C2.11211 11.3234 2.06343 11.2407 2.03366 11.1506C2 11.0487 2 10.9345 2 10.7061V5.29468C2 5.06625 2 4.95204 2.03366 4.85017C2.06343 4.76005 2.11211 4.67733 2.17642 4.60754C2.24912 4.52865 2.34897 4.47318 2.54865 4.36225L7.48198 1.6215C7.67105 1.51647 7.76559 1.46395 7.8657 1.44336C7.95431 1.42513 8.0457 1.42513 8.1343 1.44336C8.23442 1.46395 8.32895 1.51646 8.51802 1.6215L13.4514 4.36224C13.651 4.47318 13.7509 4.52865 13.8236 4.60754C13.8879 4.67733 13.9366 4.76005 13.9663 4.85017C14 4.95204 14 5.06625 14 5.29468L14 8.33372M5 3.00038L11 6.33371M12.6667 14.0004V10.0004M10.6667 12.0004H14.6667" stroke="#475467" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

	},
]

type VariableDeliverySelectProps = {
	selectedDeliveryType: EDeliveryMileStoneType;
	onChangeDeliveryType?: (value: EDeliveryMileStoneType) => void;
}

export const VariableDeliverySelect = ({
	selectedDeliveryType,
	onChangeDeliveryType,
}: VariableDeliverySelectProps) => {
	const selectedTypeObject = useMemo(() =>
		deliveryMethodsTypes.find((method) => method.value === selectedDeliveryType), [selectedDeliveryType]);

	return (
		<div className='flex flex-col border rounded-md gap-2 text-xs py-2.5 px-4'>
			{onChangeDeliveryType ? (
				<Popover>
					<PopoverTrigger tabIndex={-1}>
						<div className="flex gap-2 text-sm py- rounded-sm justify-between items-center cursor-pointer">
							<h5 className='font-semibold text-gray-600'>
								{selectedTypeObject?.label}
							</h5>
							<button className='border bg-gray-50 active:opacity-50 transition p-0.5 rounded-md'><ChevronDown size={20} className='text-primary' /></button>
						</div>
					</PopoverTrigger>
					<PopoverContent className="w-[60vw] md:w-[50vw] border flex flex-col rounded-lg p-0">
							{deliveryMethodsTypes.map((method) => (
								<PopoverClose key={method.value} className='focus:!outline-none focus-visible:!outline-none'>
									<button
										className={cn("relative flex gap-2 w-full select-none items-center rounded-sm p-4 text-sm capitalize text-left outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
										selectedDeliveryType === method.value && "bg-gray-100"
										)}
										onClick={() => onChangeDeliveryType(method.value)}
									>
										<div className='flex items-center gap-2'>
											<div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-100'>
												{method.icon}
											</div>
											<div className='flex-1 text-gray-700 space-y-1'>
												<h6 className='font-medium text-sm'>{method.label}</h6>
												<p className=' text-xs'>{method.listDescription}</p>
											</div>
										</div>
									</button>
								</PopoverClose>
							))}
					</PopoverContent>
				</Popover>
			):(
				<h5 className='font-semibold text-gray-600'>
					{selectedTypeObject?.label}
				</h5>
			)}

			<p>
				{onChangeDeliveryType ? selectedTypeObject?.description : selectedTypeObject?.savedDescription}
			</p>
		</div>
	)
};
