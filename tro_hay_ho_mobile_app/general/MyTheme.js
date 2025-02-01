import { MD3LightTheme, PaperProvider } from 'react-native-paper';

const myTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'rgb(219, 169, 52)', // Màu chính
    secondary: 'rgb(241, 197, 23)', // Màu phụ
    background: 'rgb(255, 255, 255)', // Màu nền
  },
};

export default myTheme