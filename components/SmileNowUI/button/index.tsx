import React from "react";
import { useButton } from "@react-native-aria/button";
import { Pressable, StyleProp, Text, View, StyleSheet } from "react-native";
import { useRef } from "react";
import { Colors, Fonts } from "../../../styles/theme";
import * as Haptics from "expo-haptics";
import { MaterialIndicator } from "react-native-indicators";
import { ButtonSizes, getButtonVariant } from "./theme";
export type ButtonColorSchemeType =
	| "primary"
	| "secondary"
	| "tertiary"
	| "gray"
	| "success"
	| "danger"
	| "black"
	| "white";
export interface IButton {
	children: string;
	variant?: "solid" | "outlined" | "ghost" | "link" | "unstyled";
	colorScheme?: ButtonColorSchemeType;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	style?: StyleProp<any>;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	haptic?: boolean | "light" | "medium" | "heavy" | "selection";
	loading?: boolean;
	loadingLocation?: "left" | "right";
	loadingText?: string;
	disabled?: boolean;
	onPress?: () => void;
}
function ButtonLoader({ size = 16, color = Colors.background }) {
	return (
		<View>
			<MaterialIndicator
				size={size}
				color={color}
				style={{ marginHorizontal: 5 }}
			/>
		</View>
	);
}
export default function Button({
	children,
	variant = "solid",
	colorScheme = "primary",
	size = "md",
	style,
	onPress,
	leftIcon,
	rightIcon,
	haptic = false,
	loading = false,
	disabled = false,
	loadingLocation = "left",
	loadingText,
	...props
}: IButton) {
	const ref = useRef(null);
	let { buttonProps, isPressed } = useButton(props);
	// the button's local variant combines the variant and colorScheme
	const buttonVariantStyles = getButtonVariant({
		variant,
		isPressed,
		colorScheme,
	});
	const textStyle: StyleProp<any> = {
		fontFamily: Fonts.button.fontFamily,
		color: buttonVariantStyles.color,
		fontSize: ButtonSizes[size].fontSize,
		textDecorationLine: variant === "link" ? "underline" : "none",
	};
	const buttonStyles: StyleProp<any> = {
		...ButtonStyles.button,
		...buttonVariantStyles,
		...ButtonSizes[size],
		borderWidth: variant === "link" || variant === "unstyled" ? 0 : 2,
		opacity: disabled ? 0.5 : 1,
	};
	// styles specific to the variant
	// sizes are handled handled by the constant buttonSizes, which doesn't require a hook
	function hapticStyle() {
		if (haptic === "light") return Haptics.ImpactFeedbackStyle.Light;
		if (haptic === "heavy") return Haptics.ImpactFeedbackStyle.Heavy;
		if (haptic === "medium") return Haptics.ImpactFeedbackStyle.Medium;
		if (haptic === true) return Haptics.ImpactFeedbackStyle.Medium;
		if (haptic === false) return Haptics.ImpactFeedbackStyle.Medium;
	}

	function filterStyles(styles) {
		const marginStyles = {};
		const otherStyles = {};
		if (!style) {
			return [marginStyles, otherStyles, textStyle];
		}
		for (const [key, value] of Object.entries(styles)) {
			if (key.startsWith("margin")) {
				marginStyles[key] = value;
			} else {
				otherStyles[key] = value;
			}
		}

		return [marginStyles, otherStyles];
	}
	const [marginStyles, otherStyles] = filterStyles(style);
	return (
		<Pressable
			ref={ref}
			{...buttonProps}
			{...props}
			style={{
				display: "flex",
				flexDirection: "row",
				flex: 0,
				justifyContent: "flex-start",
				...marginStyles,
			}}
			disabled={disabled || loading}
			onPress={() => {
				if (haptic && haptic !== "selection") {
					Haptics.impactAsync(hapticStyle());
				}
				if (haptic && haptic === "selection") {
					Haptics.selectionAsync();
				}
				onPress?.();
			}}>
			<View style={[buttonStyles, otherStyles]}>
				{(!!leftIcon && !loading) || loadingLocation === "right" ? (
					leftIcon
				) : (
					<></>
				)}
				{loading && loadingLocation === "left" ? (
					<ButtonLoader size={textStyle.fontSize - 4} color={textStyle.color} />
				) : (
					<></>
				)}
				<Text style={textStyle}>
					{loading && loadingText ? loadingText : children}
				</Text>
				{(!!rightIcon && !loading) || loadingLocation === "left" ? (
					rightIcon
				) : (
					<></>
				)}
				{loading && loadingLocation === "right" ? (
					<ButtonLoader size={textStyle.fontSize - 4} color={textStyle.color} />
				) : (
					<></>
				)}
			</View>
		</Pressable>
	);
}
const ButtonStyles = StyleSheet.create({
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
		gap: 10,
	},
});
