import React, { createContext } from "react";

export const RequestLoginDialogContext=createContext()
export const RequestLoginDialogProvider=({children})=>{
    const [isVisible,setIsVisible]= React.useState(false)
    const showDialog=()=>setIsVisible(true)
    const hideDialog=()=>setIsVisible(false)
    return (
        <RequestLoginDialogContext.Provider value={{isVisible,showDialog,hideDialog}}>
            {children}
        </RequestLoginDialogContext.Provider>
    )
}
export const useRequestLoginDialog=()=>React.useContext(RequestLoginDialogContext)