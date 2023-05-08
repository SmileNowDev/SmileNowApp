import {
	useFonts as expoUseFonts,
	LibreFranklin_300Light,
	LibreFranklin_400Regular,
	LibreFranklin_500Medium,
	LibreFranklin_600SemiBold,
	LibreFranklin_700Bold,
	LibreFranklin_800ExtraBold,
} from "@expo-google-fonts/libre-franklin";
import {
	Exo_300Light,
	Exo_400Regular,
	Exo_500Medium,
	Exo_600SemiBold,
	Exo_700Bold,
} from "@expo-google-fonts/exo";
import {
	FuzzyBubbles_400Regular,
	FuzzyBubbles_700Bold,
} from "@expo-google-fonts/fuzzy-bubbles";
// load all fonts and return it as a hook

export const loadFonts = () => {
	let [fontsLoaded] = expoUseFonts({
		LibreFranklin_300Light,
		LibreFranklin_400Regular,
		LibreFranklin_500Medium,
		LibreFranklin_600SemiBold,
		LibreFranklin_700Bold,
		LibreFranklin_800ExtraBold,
		Exo_300Light,
		Exo_400Regular,
		Exo_500Medium,
		Exo_600SemiBold,
		Exo_700Bold,
		FuzzyBubbles_400Regular,
		FuzzyBubbles_700Bold,
	});

	return fontsLoaded;
};
