import { Dimensions, StyleSheet } from "react-native";
import { Colors, Fonts } from "./theme";

export const Dim = {
	width: Dimensions.get("window").width,
	height: Dimensions.get("window").height,
	sm: 5,
	md: 10,
	lg: 15,
	xl: 20,
	xxl: 40,
};
export const ButtonStyles = StyleSheet.create({
	button: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		paddingVertical: 10,
		paddingHorizontal: 30,
		gap: 5,
	},
	buttonSmall: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 15,
		gap: 5,
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
	buttonTextSmall: {
		fontFamily: Fonts.button.fontFamily,
		fontSize: 12,
		color: Colors.background,
	},
	buttonText: {
		fontFamily: Fonts.button.fontFamily,
		color: Colors.background,
	},
	buttonTextLarge: {
		fontFamily: Fonts.button.fontFamily,
		fontSize: 20,
		color: Colors.background,
	},
	primary: {
		backgroundColor: Colors.primary,
	},
	secondary: {
		backgroundColor: Colors.secondary,
	},
	success: {
		backgroundColor: Colors.success,
	},
	gray: {
		backgroundColor: "#CCCCCC",
	},
	outlined: {
		backgroundColor: "transparent",
		borderColor: Colors.border,
		borderWidth: 1,
		borderStyle: "solid",
	},
	primaryOutlined: {
		backgroundColor: "transparent",
		borderColor: Colors.primary,
		borderWidth: 1,
		borderStyle: "solid",
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
	textInput: {
		fontFamily: Fonts.body.fontFamily,
		fontSize: 16,
		padding: 6,
		borderBottomColor: Colors.border,
		borderBottomWidth: 2,
		borderStyle: "solid",
		backgroundColor: Colors.foreground,
	},
	header: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 10,
		paddingHorizontal: 10,
		backgroundColor: Colors.background,

		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		elevation: -2,
	},
});
