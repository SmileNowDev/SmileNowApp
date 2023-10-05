import { Colors, Fonts } from "../../../styles/theme";

const textColorScheme = {
	text: Colors.text,
	textSecondary: Colors.textSecondary,
	primary: Colors.primary,
	secondary: Colors.secondary,
	success: Colors.success,
	danger: Colors.danger,
	background: Colors.background,
};

export default function generateTextStyles({ variant, colorScheme, size }) {
	return {
		fontFamily: variant ? Fonts[variant].fontFamily : Fonts["body"].fontFamily,
		color: colorScheme ? textColorScheme[colorScheme] : textColorScheme["text"],
		fontSize: size !== 16 ? size : Fonts[variant].fontSize,
	};
}
