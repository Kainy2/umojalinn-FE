import { CreateProjectContext } from "@/layout/create-project/CreateProjectProvider";
import { useContext } from "react";



export const useCreateProjectContext = () => {
		const { projectFormDetails, setProjectFormDetails } = useContext(CreateProjectContext);

		if (!projectFormDetails || !setProjectFormDetails) {
			throw new Error("useCreateProjectContext must be used within a CreateProjectProvider");
		}

		return {
			projectFormDetails,
			setProjectFormDetails,
		};
	}