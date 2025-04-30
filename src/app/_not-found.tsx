import { Button } from "@/components/ui/button"
import { CircleX } from "lucide-react"
import Link from "next/link"
import React from "react"

const NotFoundPage = () => {
	return (
		<div className="bg-auth">
			<div className="text-center flex flex-col items-center container max-w-[550px] text-md">
				<span className="icon-wrapper error mb-4">
					<CircleX />
				</span>
				<h1 className="text-lg font-bold text-foreground mb-2">
					Page Not Found
				</h1>
				<p className="mb-6">
					The page you are looking for does not exist.
				</p>

				<Button asChild fullWidth>
					<Link href="/">Return to Dashboard</Link>
				</Button>
			</div>
		</div>
	)
}

export default NotFoundPage
