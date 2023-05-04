import {
	BeansThemeType,
	BeansColorsType,
	BeansFontType,
	BeansComponentType,
} from "rn-beans-ui";

const customColors: BeansColorsType = {
	StaticColors: {
		primary: "#000000",
	},
	DarkModeColors: {
		primary: "#FFFFFF",
	},
	LightModeColors: {
		primary: "#000000",
	},
};
const Fonts: BeansFontType = {
	title: "Exo_600SemiBold",
	subtitle: "Exo_400Regular",
	body: {
		default: "Exo_400Regular",
		bold: "Exo_600SemiBold",
	},
};
export const myCustomTheme = {
	Colors: customColors,
	Fonts: Fonts,
};
