"use client";
import { ProjectFormDetailsProps, ProjectFormRequirementsAndBugetProps } from '@/types/form';
import React, { createContext, useState, ReactNode, useMemo } from 'react';

export type StateType = ProjectFormDetailsProps & ProjectFormRequirementsAndBugetProps & {
	gallery?: {
    id: string | number;
    title: string;
    isCoverImage: boolean;
    fileName: string;
    image: string | File;
	}[]
};

type ContextType = {
  projectFormDetails: StateType;
  setProjectFormDetails: React.Dispatch<React.SetStateAction<StateType>>;
};

const initialState: StateType = {};

export const CreateProjectContext = createContext<ContextType>({
  projectFormDetails: initialState,
  setProjectFormDetails: () => {},
});

type Props = {
  children: ReactNode;
};

export const CreateProjectProvider = ({ children }: Props) => {
  const [projectFormDetails, setProjectFormDetails] = useState<StateType>(initialState);

  const value = useMemo(() => ({ projectFormDetails, setProjectFormDetails }), [projectFormDetails]);
  
  return (
    <CreateProjectContext.Provider value={value}>
      {children}
    </CreateProjectContext.Provider>
  );
};

