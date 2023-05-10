import React from "react";
import {
	MaterialIcons,
	MaterialCommunityIcons,
	Ionicons,
	SimpleLineIcons,
	Feather,
	FontAwesome,
	FontAwesome5,
} from "react-native-vector-icons";
import { Colors } from "../../styles/theme";

/* 
DOCUMENTATION
Props: icon type: Material (default) | Ion | MaterialCommunity .... keep adding as you need
    size : sm | md (default)| lg | xl

    color : text (default)  | textSecondary
            primary | primaryLight | primaryDark
            accent1 | accent1Light | accent1Light
            accent2 | accent2Light | accent2Dark
	positioning: 
		
*/
export default function Icon(props) {
	let color = props.color || Colors.text;
	let size = props.size || 18;

	const iconStyle = {
		fontSize: size,
		color: color,
		paddingRight: props.paddingR,
		paddingLeft: props.paddingL,
		paddingHorizontal: props.paddingX,
		paddingVertical: props.paddingY,
		padding: props.padding,
		marginRight: props.marginR,
		marginLeft: props.marginL,
		marginTop: props.marginT,
		marginBottom: props.marginB,
		marginHorizontal: props.marginX,
		marginVertical: props.marginY,
		margin: props.margin,
	};

	if (props.type === "MaterialCommunity") {
		return (
			<MaterialCommunityIcons
				name={props.name}
				style={{ ...iconStyle, ...props.style }}
			/>
		);
	}

	if (props.type === "Ion") {
		return (
			<Ionicons name={props.name} style={{ ...iconStyle, ...props.style }} />
		);
	}
	if (props.type === "SimpleLine") {
		return (
			<SimpleLineIcons
				name={props.name}
				style={{ ...iconStyle, ...props.style }}
			/>
		);
	}
	if (props.type === "Feather") {
		return (
			<Feather name={props.name} style={{ ...iconStyle, ...props.style }} />
		);
	}
	if (props.type === "FontAwesome") {
		return (
			<FontAwesome name={props.name} style={{ ...iconStyle, ...props.style }} />
		);
	}
	if (props.type === "FontAwesome5") {
		return (
			<FontAwesome5
				name={props.name}
				style={{ ...iconStyle, ...props.style }}
			/>
		);
	} else {
		return (
			<MaterialIcons
				name={props.name}
				style={{ ...iconStyle, ...props.style }}
			/>
		);
	}
}
