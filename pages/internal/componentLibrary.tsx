import React from "react";
import ScreenWrapper from "../../components/core/screenWrapper";
import { Alert, SafeAreaView, Text, View } from "react-native";
import Header from "../../components/layout/header";
import { Button } from "../../components/SmileNowUI/button";
import Icon from "../../components/core/icons";
import { Colors, Fonts } from "../../styles/theme";

export default function ComponentLibrary(params) {
	return (
		<SafeAreaView>
			<ScreenWrapper>
				<Header title="Component Library" goBack />
				<Text>SmileNow Component Library (and docs)</Text>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
					}}>
					Text
				</Text>
				<Text>Coming soon</Text>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
					}}>
					Buttons
				</Text>
				<Text>variant = "solid"</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 10,
					}}>
					<Button
						variant={"solid"}
						colorScheme={"primary"}
						size={"sm"}
						leftIcon={<Icon name="book" size={20} color={Colors.background} />}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant="solid"
						colorScheme={"secondary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						colorScheme={"tertiary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						colorScheme={"gray"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						colorScheme={"success"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						colorScheme={"danger"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
				</View>
				<Text>variant = "outlined"</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 10,
						flexWrap: "wrap",
					}}>
					<Button
						variant={"outlined"}
						colorScheme={"primary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button variant="outlined" colorScheme={"secondary"} size={"sm"}>
						Hello
					</Button>
					<Button
						variant={"outlined"}
						colorScheme={"tertiary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"outlined"}
						colorScheme={"gray"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"outlined"}
						colorScheme={"success"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"outlined"}
						colorScheme={"danger"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
				</View>
				<Text>variant = "ghost"</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 10,
					}}>
					<Button
						variant={"ghost"}
						colorScheme={"primary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
				</View>
				<Text>variant = "link" & variant = "unstyled"</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 10,
					}}>
					<Button
						variant={"link"}
						size={"md"}
						haptic={"heavy"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"unstyled"}
						size={"md"}
						haptic={"heavy"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
				</View>
				<Text>Sizes: "xs" | "sm" | "md" | "lg" | "xl"</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 10,
						marginVertical: 10,
					}}>
					<Button
						variant={"solid"}
						size={"xs"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						size={"md"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						size={"lg"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>

					<Button
						variant={"solid"}
						size={"xl"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
				</View>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
