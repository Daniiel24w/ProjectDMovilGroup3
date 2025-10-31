import { useFonts } from 'expo-font';

export default function useAppFonts() {
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': require('../../assets/fonts/Nunito/Nunito-Regular.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito/Nunito-SemiBold.ttf'),
    'Nunito-Italic': require('../../assets/fonts/Nunito/Nunito-Italic.ttf'),
  });

  return fontsLoaded;
}