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
		borderColor: "#000000",
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

	outlinedTextSecondary: {
		backgroundColor: "transparent",
		borderColor: Colors.textSecondary,
		borderWidth: 1,
		borderStyle: "solid",
	},
	primaryOutlined: {
		backgroundColor: "transparent",
		borderColor: Colors.primary,
		borderWidth: 1,
		borderStyle: "solid",
	},
	secondaryOutlined: {
		backgroundColor: "transparent",
		borderColor: Colors.secondary,
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
		shadowOpacity: 0.125,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 2,
	},
	textInput: {
		fontFamily: Fonts.body.fontFamily,
		fontSize: 16,
		padding: 6,
		borderRadius: 5,
		borderBottomColor: Colors.border,
		borderBottomWidth: 2,
		borderStyle: "solid",
		backgroundColor: Colors.foreground,
	},
	header: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: Colors.background,
		borderBottomColor: Colors.border,
		borderBottomWidth: 1,
	},
	shadow: {
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		shadowColor: "black",
		elevation: 3,
		shadowOpacity: 0.125,
	},
	footerButtonContainer: {
		position: "absolute",
		zIndex: 50,
		bottom: 80,
		left: 0,
		right: 0,
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 2.5,
		paddingVertical: 12,
		paddingHorizontal: 10,
		backgroundColor: "transparent",
		shadowColor: Colors.text,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 5,
		flex: 0,
		borderColor: "transparent",
	},
	modalShadow: {
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 4,
		shadowColor: "rgba(0,0,0,1)",
		elevation: 1,
		shadowOpacity: 0.5,
	},
	tabScreenContainer: {
		padding: 0,
	},
	tabScreenTitle: {
		paddingLeft: 10,
		paddingTop: 10,
		fontFamily: Fonts.subTitle.fontFamily,
		fontSize: Fonts.subTitle.fontSize,
		color: Colors.textSecondary,
		marginLeft: 5,
	},
	hr: {
		width: "100%",
		borderBottomColor: Colors.border,
		borderBottomWidth: 1,
		borderStyle: "solid",
		marginVertical: 5,
	},
});
