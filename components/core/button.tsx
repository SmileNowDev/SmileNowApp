import React from "react";
import { useHover } from "@react-native-aria/interactions";
import { useButton } from "@react-native-aria/button";
import { useFocusRing } from "@react-native-aria/focus";
import { useToggleState } from "@react-stately/toggle";
import { Pressable, StyleProp, Text, View } from "react-native";
import { useRef } from "react";
import { Colors, Fonts } from "../../styles/theme";
import { ButtonStyles } from "../../styles/styles";
export interface IButton {
	children: string;
	variant?: "solid" | "outlined" | "ghost" | "link" | "unstyled";
	colorScheme?: "primary" | "secondary" | "tertiary";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	styles?: StyleProp<any>;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
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
	...props
}: IButton) {
	const ref = useRef(null);
	let { buttonProps, isPressed } = useButton(props);
	const ButtonColorScheme = {
		primary: {
			backgroundColor: Colors.primary,
			borderColor: Colors.primary,
			color: Colors.background,
		},
		secondary: {
			backgroundColor: Colors.secondary,
			borderColor: Colors.secondary,
			color: Colors.background,
		},
		tertiary: {
			backgroundColor: Colors.tertiary,
			color: Colors.text,
		},
		link: {
			backgroundColor: "transparent",
			color: Colors.link,
		},
	};
	const ButtonVariants = {
		solid: {
			borderColor: "transparent",
			backgroundColor: ButtonColorScheme[colorScheme].backgroundColor,
			color: ButtonColorScheme[colorScheme].color,
		},
		outlined: {
			backgroundColor: Colors.foreground,
			borderColor: ButtonColorScheme[colorScheme].backgroundColor,
			color: ButtonColorScheme[colorScheme].backgroundColor,
		},
		tertiary: {
			backgroundColor: Colors.tertiary,
			color: Colors.text,
		},
		ghost: {
			backgroundColor: Colors.foreground,
			borderColor: Colors.border,
			color: Colors.text,
		},
	};
	const ButtonSizes = {
		xs: {
			paddingHorizontal: 10,
			paddingVertical: 5,
			fontSize: 10,
		},

		sm: {
			padding: 12,
		},
		md: {
			padding: 16,
		},
		lg: {
			padding: 20,
		},
		xl: {
			padding: 24,
		},
	};

	function generateTextStyle() {
		let styles: StyleProp<any> = {
			...ButtonStyles.buttonText,
			color: ButtonVariants[variant].color,
		};
		return styles;
	}

	function generateStyle() {
		let styles: StyleProp<any> = {
			...ButtonStyles.button,
			borderWidth: 2,
			...ButtonVariants[variant],
			...ButtonSizes[size],
			opacity: isPressed ? 0.5 : 1,
			shadowColor: "#000",
			shadowOpacity: 0.25,
			shadowRadius: isPressed ? 5 : 10,
			elevation: isPressed ? 3 : 10,
		};

		return styles;
	}
	return (
		<Pressable
			ref={ref}
			{...buttonProps}
			{...props}
			style={[generateStyle(), styles]}
			onPress={onPress}>
			{!!leftIcon ? leftIcon : <></>}
			<Text style={generateTextStyle()}>{children}</Text>
			{!!rightIcon ? rightIcon : <></>}
		</Pressable>
	);
}
