import { Colors } from "../../../styles/theme";

export const ButtonColorScheme = {
	primary: {
		backgroundColor: Colors.primary,
		activeColor: Colors.primaryDark,
		borderColor: Colors.primary,
		color: Colors.background,
	},
	secondary: {
		backgroundColor: Colors.secondary,
		activeColor: Colors.secondaryDark,
		borderColor: Colors.secondary,
		color: Colors.background,
	},
	tertiary: {
		backgroundColor: Colors.tertiary,
		activeColor: Colors.tertiaryDark,
		color: Colors.text,
	},
	link: {
		backgroundColor: "transparent",
		color: Colors.link,
	},
	ghost: {
		backgroundColor: Colors.foreground,
		activeColor: Colors.textSecondary,
		borderColor: Colors.border,
		color: Colors.text,
	},
	gray: {
		backgroundColor: Colors.border,
		activeColor: "#888888",
		borderColor: Colors.border,
		color: Colors.text,
	},
	success: {
		backgroundColor: Colors.success,
		activeColor: Colors.successDark,
		borderColor: Colors.success,
		color: Colors.background,
	},
	danger: {
		backgroundColor: Colors.danger,
		activeColor: Colors.dangerDark,
		borderColor: Colors.danger,
		color: Colors.background,
	},
};
export const getButtonVariant = ({ variant, isPressed, colorScheme }) => {
	type Variant = {
		[key: string]: any;
	};
	// type TextVariant = {
	// 	[key: string]: any;
	// };
	let styles: Variant = undefined;
	// let textStyles: TextVariant = undefined;
	switch (variant) {
		case "solid":
			styles = {
				borderColor: isPressed
					? ButtonColorScheme[colorScheme].backgroundColor
					: "transparent",
				backgroundColor: isPressed
					? ButtonColorScheme[colorScheme].activeColor
					: ButtonColorScheme[colorScheme].backgroundColor,
				color: ButtonColorScheme[colorScheme].color,
				shadowColor: "#000",
				shadowOpacity: 0.1,
				shadowRadius: isPressed ? 3 : 6,
				elevation: isPressed ? 3 : 6,
			};
			// textStyles = {
			// 	color: ButtonColorScheme[colorScheme].color,
			// };

			break;
		case "outlined":
			styles = {
				backgroundColor: isPressed
					? ButtonColorScheme[colorScheme].backgroundColor + "30"
					: Colors.foreground,
				borderColor: isPressed
					? ButtonColorScheme[colorScheme].activeColor + "30"
					: ButtonColorScheme[colorScheme].backgroundColor,
				color: Colors.text,
			};
			// textStyles = {
			// 	color: ButtonColorScheme[colorScheme].color,
			// };
			break;
		case "ghost":
			styles = {
				backgroundColor: isPressed
					? ButtonColorScheme["ghost"].borderColor
					: ButtonColorScheme["ghost"].backgroundColor,
				borderColor: isPressed
					? ButtonColorScheme["ghost"].activeColor + "30"
					: ButtonColorScheme["ghost"].borderColor,
				color: ButtonColorScheme["ghost"].color,
				shadowColor: "#000",
				shadowOpacity: 0.1,
				shadowRadius: isPressed ? 3 : 6,
				elevation: isPressed ? 3 : 6,
			};
			break;
		case "link":
			styles = {
				borderWidth: 0,
				paddingHorizontal: 0,
				paddingVertical: 0,
				color: isPressed
					? ButtonColorScheme["link"].color + "30"
					: ButtonColorScheme["link"].color,
				width: "auto",
				flex: 0,
			};
			break;
		case "unstyled":
			styles = {
				borderColor: "transparent",
				backgroundColor: "transparent",
				color: Colors.text,
			};
			break;
		default:
			styles = {
				borderColor: "transparent",
				backgroundColor: "transparent",
				color: Colors.text,
			};
			break;
	}
	return styles;
};

export const ButtonSizes = {
	xs: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		fontSize: 12,
	},

	sm: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		fontSize: 14,
	},
	md: {
		paddingHorizontal: 14,
		paddingVertical: 6,
		fontSize: 16,
	},
	lg: {
		paddingHorizontal: 16,
		paddingVertical: 6,
		fontSize: 18,
	},
	xl: {
		paddingVertical: 6,
		paddingHorizontal: 18,
		fontSize: 24,
	},
};