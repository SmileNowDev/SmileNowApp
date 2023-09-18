import React, { CSSProperties } from "react";
import { Text as RN_Text, TextStyle } from "react-native";
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
	style?: TextStyle;
	ellipsize?: "head" | "middle" | "tail" | "clip" | null;
	numberOfLines?: number;
}
export default function Text({
	children,
	variant = "body",
	colorScheme = "text",
	size = 16,
	style,
	ellipsize = null,
	numberOfLines = null,
}: IText) {
	const textStyles = generateTextStyles({
		variant,
		colorScheme,
		size,
	});
	return (
		<RN_Text
			style={{ ...textStyles, ...style }}
			ellipsizeMode={ellipsize}
			numberOfLines={numberOfLines}>
			{children}
		</RN_Text>
	);
}
