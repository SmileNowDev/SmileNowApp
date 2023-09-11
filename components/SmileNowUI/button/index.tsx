import React from "react";
import { useHover } from "@react-native-aria/interactions";
import { useButton } from "@react-native-aria/button";
import { useFocusRing } from "@react-native-aria/focus";
import { useToggleState } from "@react-stately/toggle";
import { Pressable, StyleProp, Text, View, StyleSheet } from "react-native";
import { useRef } from "react";
import { Colors, Fonts } from "../../../styles/theme";
import * as Haptics from "expo-haptics";
import { ButtonSizes, getButtonVariant } from "./theme";

export interface IButton {
	children: string;
	variant?: "solid" | "outlined" | "ghost" | "link" | "unstyled";
	colorScheme?:
		| "primary"
		| "secondary"
		| "tertiary"
		| "gray"
		| "success"
		| "danger";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	styles?: StyleProp<any>;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	haptic?: boolean | "light" | "medium" | "heavy" | "selection";
	onPress?: () => void;
}
//todo: loading state

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
	// the button's local variant combines the variant and colorScheme
	const buttonVariantStyles = getButtonVariant({
		variant,
		isPressed,
		colorScheme,
	});
	// styles specific to the variant
	// sizes are handled handled by the constant buttonSizes, which doesn't require a hook
	function hapticStyle() {
		if (haptic === "light") return Haptics.ImpactFeedbackStyle.Light;
		if (haptic === "heavy") return Haptics.ImpactFeedbackStyle.Heavy;
		if (haptic === "medium") return Haptics.ImpactFeedbackStyle.Medium;
		if (haptic === true) return Haptics.ImpactFeedbackStyle.Medium;
		if (haptic === false) return Haptics.ImpactFeedbackStyle.Medium;
	}
	function generateTextStyle() {
		let styles: StyleProp<any> = {
			fontFamily: Fonts.button.fontFamily,
			color: buttonVariantStyles.color,
			fontSize: ButtonSizes[size].fontSize,
			textDecorationLine: variant === "link" ? "underline" : "none",
		};
		return styles;
	}

	function generateStyle() {
		let styles: StyleProp<any> = {
			...ButtonStyles.button,
			...buttonVariantStyles,
			...ButtonSizes[size],
			borderWidth: variant === "link" || variant === "unstyled" ? 0 : 2,
		};
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
				alignItems: "center",
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
});
