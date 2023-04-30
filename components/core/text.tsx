import React from "react";
import { Text as RN_Text } from "react-native";
import { Colors, Fonts } from "../../styles/theme";

/*
  -- DOCUMENTATION --
  children (string): Text to be rendered.
  title | titleBold | subTitle | subTitleBold | bodyLarge | body (default) | small | smallBold
  Italic: ^^ + _Italic 
  Positioning: left (default) | right | center 
  style (JS Object): All style props.

  Colors: (defaults to text. only apply one.)
  These should be updated periodically to reflect styles.js
  colors.text
  secondary =  colors.textSecondary //dynamic
  primary = Colors.COLOR_PRIMARY_DEFAULT 
  accent1 = Colors.COLOR_ACCENT_DEFAULT
  accent2 = Colors.COLOR_ACCENT2_DEFAULT



  RN Text props (see RN docs):
    numberOfLines (number)
    ellipsisMode (string)
    onPress (function)
    textBreakStrategy (string)
*/

export default function Text(props) {
	let color = props.color || Colors.text;
	let textAlign = props.textAlign || "left";
	let fontFamily = props.font.fontFamily || Fonts.body.fontFamily;
	let size = props.font.fontSize || props.size || Fonts.body.fontSize;

	return (
		<RN_Text
			numberOfLines={props.numberOfLines}
			onPress={props.onPress}
			textBreakStrategy={props.textBreakStrategy}
			style={{
				color,
				fontSize: size,
				fontFamily: fontFamily,
				textAlign: textAlign,
				paddingVertical: props.paddingY,
				paddingHorizontal: props.paddingX,
				paddingLeft: props.paddingL,
				paddingRight: props.paddingR,
				paddingTop: props.paddingT,
				paddingBottom: props.paddingB,
				padding: props.padding,
				marginVertical: props.marginY,
				marginHorizontal: props.marginX,
				marginLeft: props.marginL,
				marginRight: props.marginR,
				marginTop: props.marginT,
				marginBottom: props.marginB,
				margin: props.margin,

				...props.style,
			}}>
			{props.children}
		</RN_Text>
	);
}
