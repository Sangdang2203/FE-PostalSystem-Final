import { createContext } from "react";

/*
'use client';
import * as React from "react";
import {toast} from "sonner";
import {useContext} from "react";

//@ts-ignore
const PackageCreateContext = React.createContext();

//@ts-ignore
export const PackageCreateProvider = ({ children }) => {

    const [nameSender, setNameSender] = React.useState('');
    const [phoneSender, setPhoneSender] = React.useState('');
    const [addressSender, setAddressSender] = React.useState('');




    return (
        <PackageCreateContext.Provider value={{}}>
            {children}
        </PackageCreateContext.Provider>
    );
};

export const usePackageCreate = () => useContext(PackageCreateContext);*/
export const PackageCreateContext = createContext({});
