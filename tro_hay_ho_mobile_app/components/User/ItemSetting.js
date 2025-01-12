import { Text, TouchableOpacity, View } from "react-native"
import AccountUserStyle from "../../styles/dat/AccountUserStyle"
import { Icon } from "react-native-paper"


const ItemSetting = ({iconName, colorIcon, optionSetting }) => {

    return (
        
            <TouchableOpacity style={AccountUserStyle.item}>
                <Icon source={iconName} size={24} color={colorIcon} />
                <Text style={{ marginLeft: 20, fontSize: 17, fontWeight: 600 }}>{optionSetting}</Text>
            </TouchableOpacity>
    )

}

export default ItemSetting;