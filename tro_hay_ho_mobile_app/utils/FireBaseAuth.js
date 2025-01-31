
import auth from "@react-native-firebase/auth";


export const sendOTP = async (phoneNumber) => {

  try {
    console.log("click2");
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    console.log("send", confirmation);
    return confirmation;
  } catch (error) {
    console.error("Lỗi khi gửi OTP:", error);
    return null;
  }
};

export const verifyOTP = async (confirmation, otpCode) => {
  try {
    console.log("click");
    const userCredential = await confirmation.confirm(otpCode);
    console.log("popo", userCredential)
    return userCredential.user; 
  } catch (error) {
    console.error("OTP không hợp lệ:", error);
    return null;
  }
};