import React from "react";
import { Text as RN_Text } from "react-native";
import generateTextStyles from "./theme";
type TextVariant =
	| "title"
	| "subTitle"
	| "body"
	| "caption"
	| "small"
	| "button"
	| "link";
type TextColorScheme =
	| "text"
	| "textSecondary"
	| "primary"
	| "secondary"
	| "success"
	| "danger"
	| "background";
export interface IText {
	children?: React.ReactNode;
	variant?: TextVariant;
	colorScheme?: TextColorScheme;
	size?: number;
	style?: any;
}
export default function Text({
	children,
	variant = "body",
	colorScheme = "text",
	size = 16,
	style,
}: IText) {
	const textStyles = generateTextStyles(variant, colorScheme, size);
	return <RN_Text style={[textStyles, style]}>{children}</RN_Text>;
}
