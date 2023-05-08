import { BeansThemeType, ColorThemeType, FontThemeType } from "rn-beans-ui";

const customColors: ColorThemeType = {
	StaticColors: {
		primary: "#F05365",
		primaryLight: "#FFD1DC",
		primaryDark: "#d1384a",
		secondary: "#9EA8FF",
		secondaryLight: "#D1D6FF",
		secondaryDark: "#5965d4",
		// yellow
		tertiary: "#F2D398",
		tertiaryDark: "#e3b96b",
		//Others
		urgent: "#ed7286",
		success: "#4caf50",
	},
	DarkModeColors: {
		background: "#1F1F1F",
		foreground: "#2C2C2E",
		text: "#F2F2F7",
		textSecondary: "#8E8E93",
		border: "#3C3C43",
	},
	LightModeColors: {
		background: "#FAFAFA",
		foreground: "#EBEBEB",
		text: "#1F1F1F",
		textSecondary: "#767676",
		border: "#E5E5E5",
	},
};
const Fonts: FontThemeType = {
	Title: {
		fontFamily: "Exo_600SemiBold",
		fontSize: 24,
	},
	subTitle: { fontFamily: "Exo_400Regular", fontSize: 22 },
	body: {
		fontFamily: "Exo_400Regular",
		fontSize: 16,
	},
};
export const myCustomTheme = {
	Colors: customColors,
	Fonts: Fonts,
};
