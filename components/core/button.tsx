import React from "react";
import { useHover } from "@react-native-aria/interactions";
import { useButton } from "@react-native-aria/button";
import { useFocusRing } from "@react-native-aria/focus";
import { useToggleState } from "@react-stately/toggle";
import { Pressable, StyleProp, Text, View, StyleSheet } from "react-native";
import { useRef } from "react";
import { Colors, Fonts } from "../../styles/theme";
import * as Haptics from "expo-haptics";

export interface IButton {
	children: string;
	variant?: "solid" | "outlined" | "ghost" | "link" | "unstyled";
	colorScheme?: "primary" | "secondary" | "tertiary";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	styles?: StyleProp<any>;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	haptic?: boolean | "light" | "medium" | "heavy" | "selection";
	onPress?: () => void;
}
export function Button({
	children,
	variant = "solid",
	colorScheme = "primary",
	size = "md",
	styles,
	onPress,
	leftIcon,
	rightIcon,
	haptic = false,
	...props
}: IButton) {
	const ref = useRef(null);
	let { buttonProps, isPressed } = useButton(props);

	const ButtonColorScheme = {
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
	};
	const ButtonVariants = {
		solid: {
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
		},
		outlined: {
			backgroundColor: isPressed
				? ButtonColorScheme[colorScheme].backgroundColor + "30"
				: Colors.foreground,
			borderColor: isPressed
				? ButtonColorScheme[colorScheme].activeColor + "30"
				: ButtonColorScheme[colorScheme].backgroundColor,
			color: ButtonColorScheme[colorScheme].backgroundColor,
		},

		ghost: {
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
		},
		link: {
			borderWidth: 0,
			paddingHorizontal: 0,
			paddingVertical: 0,
			color: ButtonColorScheme["link"].color,
			width: "auto",
			flex: 0,
		},
		unstyled: {
			borderColor: "transparent",
			backgroundColor: "transparent",
			color: Colors.text,
		},
	};

	const ButtonSizes = {
		xs: {
			paddingHorizontal: 10,
			paddingVertical: 4,
			fontSize: 8,
		},

		sm: {
			paddingHorizontal: 10,
			paddingVertical: 5,
			fontSize: 10,
		},
		md: {
			paddingHorizontal: 10,
			paddingVertical: 5,
			fontSize: 10,
		},
		lg: {
			padding: 20,
		},
		xl: {
			padding: 24,
		},
	};
	function hapticStyle() {
		if (haptic === "light") return Haptics.ImpactFeedbackStyle.Light;
		if (haptic === "heavy") return Haptics.ImpactFeedbackStyle.Heavy;
		if (haptic === "medium") return Haptics.ImpactFeedbackStyle.Medium;
		if (haptic === true) return Haptics.ImpactFeedbackStyle.Medium;
		if (haptic === false) return Haptics.ImpactFeedbackStyle.Medium;
	}
	function generateTextStyle() {
		let styles: StyleProp<any> = {
			...ButtonStyles.buttonText,
			color: ButtonVariants[variant].color,
			backgroundColor: "blue",
		};
		return styles;
	}

	function generateStyle() {
		let styles: StyleProp<any> = {
			...ButtonStyles.button,
			borderWidth: 2,
			...ButtonVariants[variant],
			...ButtonSizes[size],
		};
		if (variant === "link" || variant === "unstyled") {
			styles = {
				...styles,
				...ButtonVariants[variant],
				...ButtonSizes[size],
				width: "auto",
			};
		}
		return styles;
	}
	return (
		<Pressable
			ref={ref}
			{...buttonProps}
			{...props}
			style={{
				flex: 0,
				justifyContent: "center",
				alignItems: "center", // Centering the child container for demonstration
			}}
			onPress={() => {
				if (haptic && haptic !== "selection") {
					Haptics.impactAsync(hapticStyle());
				}
				if (haptic && haptic === "selection") {
					Haptics.selectionAsync();
				}
				onPress?.();
			}}>
			<View style={[generateStyle(), styles, { alignSelf: "flex-start" }]}>
				{!!leftIcon ? leftIcon : <></>}
				<Text style={generateTextStyle()}>{children}</Text>
				{!!rightIcon ? rightIcon : <></>}
			</View>
		</Pressable>
	);
}
export const ButtonStyles = StyleSheet.create({
	button: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		paddingVertical: 10,
		paddingHorizontal: 30,
		flex: 0,
		flexShrink: 1,
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
