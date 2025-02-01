export const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
};
//tron aray ngau nhien hoho
export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const formatPhoneNumber = (number) => {
    if (number.startsWith('0')) {
        return '+84' + number.slice(1);
    }
    return number; 
};
