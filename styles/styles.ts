import { StyleSheet } from "react-native";
import { Colors, Fonts } from "./theme";
export const ButtonStyles = StyleSheet.create({
	button: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		paddingVertical: 10,
		paddingHorizontal: 30,
		gap: 2,
	},
	buttonLarge: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		paddingVertical: 15,
		paddingHorizontal: 30,
		gap: 10,
	},
	outlinedWhite: {
		borderWidth: 1.5,
		borderStyle: "solid",
		borderColor: "#FFFFFF",
		backgroundColor: "transparent",
	},
	outlinedBlack: {
		borderWidth: 1.5,
		borderStyle: "solid",
		borderColor: "#FFFFFF",
		backgroundColor: "transparent",
	},
	buttonText: {
		fontFamily: Fonts.button.fontFamily,
		color: Colors.background,
	},
	buttonTextLarge: {
		fontFamily: Fonts.button.fontFamily,
		fontSize: 24,
		color: Colors.background,
	},
	primary: {
		backgroundColor: Colors.primary,
	},
	secondary: {
		backgroundColor: Colors.secondary,
	},
});
export const GlobalStyles = StyleSheet.create({
	ScreenContainer: {
		width: "100%",
		padding: 20,
		flex: 1,
	},
	Container: {
		backgroundColor: Colors.foreground,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 5,
		padding: 10,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 7,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		elevation: -4,
	},
});
