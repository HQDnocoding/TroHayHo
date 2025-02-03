import React, { createContext, useRef } from "react";
import BottomSheetSendToFollowed from "../components/Home/User/BottomSheetSendToFollowed";

export const BottomSendToFollowedContext=createContext()
export const BottomSendToFollowedContextProvider=({children})=>{
    const bottomSheetRef = useRef(null);
    const [post,setPost]=React.useState(null)
    const openBottomSheet = () => {
        bottomSheetRef.current?.open();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
    };
    const assignPost=(newPost)=>{
        setPost(newPost)
    }

    return (
        <BottomSendToFollowedContext.Provider 
            value={{
                bottomSheetRef,
                openBottomSheet,
                closeBottomSheet,
                assignPost,
            }}
        >
            {children}
            <BottomSheetSendToFollowed ref={bottomSheetRef} post={post}/>
        </BottomSendToFollowedContext.Provider>
    );
}
export const useBottomSendToFollowedContext=()=>
    {
        const context=React.useContext(BottomSendToFollowedContext)
        if (!context) {
            throw new Error('useBottomSheet must be used within a BottomSheetProvider');
        }
        return context;

    }