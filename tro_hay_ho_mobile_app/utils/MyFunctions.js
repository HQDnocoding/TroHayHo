import APIs, { endpointsDuc } from "../configs/APIs"

const getInfoPostFavoriteOfUser= async(userId)=>{
    let res=await APIs.get(endpointsDuc.getMeFavoritePost(userId))
    return res.data
}
export {getInfoPostFavoriteOfUser};