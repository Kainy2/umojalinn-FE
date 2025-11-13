import { capitalizeFirstLetter } from "@/lib/string";
import { cn, normaliseLink } from "@/lib/utils";
import { UmojaLinnDeliveryMethod, UmojaLinnMilestone, UmojaLinnMilestoneSubmission } from "@/types/project";
import { Clock } from "lucide-react";


type DeliveryDetailsProps = {
	deliveryMethod: UmojaLinnMilestone["deliveryMethod"];
	submission?: UmojaLinnMilestoneSubmission
};

export const DeliveryDetails = ({ deliveryMethod, submission }: DeliveryDetailsProps) => {
	const {
		street,
		state,
		city,
		country,
		courierService,
		courierServiceLink,
		trackingId,
		zipCode,
		description
	} = submission ?? {};

	return (
		<div className="flex flex-col gap-5">
			{[
				{
					title: "Delivery Method",
					value: capitalizeFirstLetter(deliveryMethod ?? "IN_PERSON_PICKUP").replaceAll("_", " "),
					allowedDeliveryMethods: [
						"TRACKED",
						"NON_TRACKED",
						"IN_PERSON_PICKUP",
					],
				},
				{
					title: "Country",
					value: country,
					allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
				},
				{
					title: "State and Province",
					value: `${state}, ${city}`,
					allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
				},
				{
					title: "Zip Code / Postal Code",
					value: zipCode,
					allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
				},
				{
					title: "Street/Apartment/suits",
					value: street,
					allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
				},
				{
					title: "Courier Service",
					value: courierService,
					allowedDeliveryMethods: ["TRACKED", "NON_TRACKED"],
				},
				{
					title: "Tracking Link",
					value: courierServiceLink,
					link: true,
					allowedDeliveryMethods: ["TRACKED"],
				},
				{
					title: "Tracking ID",
					value: trackingId,
					allowedDeliveryMethods: ["TRACKED"],
				},
				{
					title: "Other Information",
					value: description,
					allowedDeliveryMethods: description ? ["TRACKED", "NON_TRACKED"] : [],
				},
			]
				.filter(
					({ allowedDeliveryMethods }) =>
						deliveryMethod &&
						allowedDeliveryMethods.includes(deliveryMethod)
				)
				.map(({ value, title, link }) => {
					const Comp: React.ElementType = link ? "a" : "span";
					return (
						<div
							key={value}
							className="flex text-sm flex-col gap-2 justify-between"
						>
							<p>{title}</p>

							{value ? (
								<Comp
									href={normaliseLink(value)}
									target="_blank"
									className={cn(
										"flex gap-2 text-sm font-semibold leading-none text-foreground-body",
										link && "underline hover:no-underline"
									)}
								>
									{value}
								</Comp>
							) : (
								<div className="flex gap-2 text-gray-300 items-center">
									<Clock size={16} />
									<span>
										Awaiting response
									</span>
								</div>
							)}
						</div>
					);
				})}
		</div>
	);
};


export const EmptyDeliveryDetails = ({
	currentDeliveryMethod,
}: {
	currentDeliveryMethod: UmojaLinnDeliveryMethod;
}) => {
	return (
		<div className='flex flex-col gap-5'>
						{[
							{
								title: "Country",
								value: "-",
								allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
							},
							{
								title: "State and Province",
								value: "-",
								allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
							},
							{
								title: "Zip Code / Postal Code",
								value: "-",
								allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
							},
							{
								title: "Street/Apartment/suits",
								value: "-",
								allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
							},
							{
								title: "Courier Service",
								value: "-",
								allowedDeliveryMethods: [
									"TRACKED",
									"NON_TRACKED",
								],
							},
							{
								title: "Tracking Link",
								value: "-",
								allowedDeliveryMethods: ["TRACKED"],
							},
							{
								title: "Tracking ID",
								value: "-",
								allowedDeliveryMethods: ["TRACKED"],
							},
							{
								title: "Other Information",
								value: "-",
								allowedDeliveryMethods: [
									"TRACKED",
									"NON_TRACKED",
								],
							},
						]
							.filter(({ allowedDeliveryMethods }) => allowedDeliveryMethods.includes(currentDeliveryMethod))
							.map(({ value, title }) => (
								<div key={title} className='flex flex-col gap2 justify-between'>
									<p className="">{title}</p>
									<p className="text-foreground-body">{value}</p>
								</div>
							))}
					</div>
	);
};