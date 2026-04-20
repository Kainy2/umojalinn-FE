import { Button } from '@/components/ui/button'
import { getCurrencySymbol } from '@/lib/string'
import { commaStringToNumber, numberToCommaString } from '@/lib/utils'
import { UmojaLinnCurrency } from '@/types/project'
import { Minus, Plus } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

type AddSubtractInputProps = {
	onAmountChange: (value: number) => void;
	currency: UmojaLinnCurrency;
	amount: number;
}

export const AddSubtractInput = ({ amount, currency, onAmountChange }: AddSubtractInputProps) => {
	const [width, setWidth] = useState<number | undefined>();
	const span = useRef<HTMLSpanElement>(null);
	const [content, setContent] = useState(amount);


	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 27) return
		const value = commaStringToNumber(e.target.value)
		setContent(value);
		onAmountChange(value);
	};

	useEffect(() => {
		setWidth(span.current?.offsetWidth);
	}, [content, amount]);

	return (
		<div className='flex gap-2'>
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					onAmountChange(amount && amount > 10 ? amount - 10 : 0)
				}
			>
				<Minus />
			</Button>

			<div className="relative font-semibold w-fit flex shrink-0">
				<span className="absolute pointer-events-none inset-y-0 left-0 flex items-center">
					{getCurrencySymbol(currency)}
				</span>
				<span
					className="absolute opacity-0 shrink-0 pointer-events-none"
					ref={span}
				>
					{numberToCommaString(amount || content)}
				</span>
				<input
					value={numberToCommaString(amount || "")}
					onChange={changeHandler}
					className="pl-4 ml-2 transition shrink-0 w-fit block disabled:bg-background ring-ring placeholder:text-subtitle-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					placeholder="0"
					type="text"
					min={0}
					style={{ width: width ? `${width + 20}px` : "30px" }}
				/>
			</div>
			<Button
				variant="outline"
				size="sm"
				onClick={() => onAmountChange(amount ? amount + 10 : 10)}
			>
				<Plus />
			</Button>
		</div>
	)
}

