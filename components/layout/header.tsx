import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "../core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { Dim, GlobalStyles } from "../../styles/styles";
import { Text } from "../SmileNowUI";
interface HeaderProps {
	goBack?: boolean;
	title?: string;
	rightContent?: React.ReactNode;
	leftContent?: React.ReactNode;
}
export default function Header({
	goBack = false,
	title,
	rightContent,
	leftContent,
}: HeaderProps) {
	const navigation = useNavigation();
	return (
		<View
			style={{
				...GlobalStyles.header,
			}}>
			{leftContent ? (
				<View>{leftContent}</View>
			) : (
				<>
					{goBack && (
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Icon name={"chevron-left"} size={30} />
						</TouchableOpacity>
					)}
				</>
			)}
			<Text
				variant="title"
				style={{
					flex: 1,
					textAlign: "center",
					fontSize: 20,
					width: Dim.width - 60,
				}}>
				{title ? title : "Smile Now"}
			</Text>
			{rightContent ? <View>{rightContent}</View> : <></>}
			{!rightContent && goBack && <View style={{ width: 30 }} />}
		</View>
	);
}
