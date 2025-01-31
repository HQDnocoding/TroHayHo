import APIs, { endpointsDuc } from "../configs/APIs"

const getInfoPostFavoriteOfUser= async(userId)=>{
    let res=await APIs.get(endpointsDuc.getMeFavoritePost(userId))
    return res.data
}
const parseStringToFloat=(text)=>{
    const newNum=parseFloat(text.replace(/\./g, '').replace(',', '.'));
    return newNum
}
export {getInfoPostFavoriteOfUser,parseStringToFloat};