import React from "react";
import ScreenWrapper from "../../components/core/screenWrapper";
import { Alert, SafeAreaView, View } from "react-native";
import Header from "../../components/layout/header";
import { Button } from "../../components/SmileNowUI/button";
import Icon from "../../components/core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { Dim } from "../../styles/styles";
import Text from "../../components/SmileNowUI/text/index";

export default function ComponentLibrary(params) {
	return (
		<SafeAreaView>
			<ScreenWrapper scrollEnabled>
				<Header title="Component Library" goBack />
				<Text variant="title">SmileNow UI</Text>
				<Text variant="subTitle">(and internal docs)</Text>
				<Text variant="subTitle">Text</Text>
				<Text>variant = "..."</Text>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-start",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 10,
						marginVertical: 10,
					}}>
					<Text variant="title">title</Text>
					<Text variant="subTitle">subTitle</Text>
					<Text variant="button">button</Text>
					<Text variant="body">body</Text>
					<Text variant="small">small</Text>
				</View>
				<Text>colorScheme = "..."</Text>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-start",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 10,
						marginVertical: 10,
					}}>
					<Text>text</Text>
					<Text colorScheme="textSecondary">textSecondary</Text>
					<Text colorScheme="primary">primary</Text>
					<Text colorScheme="secondary">secondary</Text>
					<Text colorScheme="success">success</Text>
					<Text colorScheme="danger">danger</Text>
					<View style={{ backgroundColor: Colors.text }}>
						<Text colorScheme="background">background</Text>
					</View>
				</View>
				<Text variant="subTitle">Buttons</Text>
				<Text>variant = 'solid'</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 10,
						marginVertical: 10,
					}}>
					<Button
						variant={"solid"}
						colorScheme={"primary"}
						size={"sm"}
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
						marginVertical: 10,
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
					<View style={{ backgroundColor: "blue", padding: 5 }}>
						<Button
							variant={"outlined"}
							colorScheme={"white"}
							size={"sm"}
							onPress={() => Alert.alert("it worked")}>
							Hello
						</Button>
					</View>
				</View>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 10,
					}}></View>
				<Text>variant = "link" & variant = "unstyled" & variant = "ghost"</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 10,
						marginVertical: 10,
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
					<Button
						variant={"ghost"}
						colorScheme={"primary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
				</View>
				<Text>Sizes: "xs" | "sm" | "md" | "lg" | "xl"</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "flex-end",
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
				<Text style={{ fontSize: 18 }}>Special Features:</Text>
				<Text>Loading & icons</Text>
				<View
					style={{
						flexDirection: "column",
						gap: 10,
						marginVertical: 10,
					}}>
					<Text>loadingText="Loading..." loading=true, buttonText="hello"</Text>
					<Button
						variant={"solid"}
						size={"md"}
						loading={true}
						loadingText="Loading..."
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Text>No Icon, loading=true</Text>
					<Button
						variant={"solid"}
						size={"md"}
						loading={true}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Text>No Icon, loading=true, loadingLocation="right"</Text>

					<Button
						variant={"solid"}
						size={"md"}
						loading={true}
						loadingLocation="right"
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Text>Left Icon, loading=true</Text>
					<Button
						variant={"solid"}
						size={"md"}
						loading={true}
						leftIcon={
							<Icon name="person" size={20} color={Colors.background} />
						}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Text>Right Icon, loading=true, loadingLocation="right"</Text>
					<Button
						variant={"solid"}
						size={"md"}
						loading={true}
						rightIcon={
							<Icon name="chevron-right" size={20} color={Colors.background} />
						}
						loadingLocation="right"
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Text>left Icon, loading=true, loadingLocation="right"</Text>
					<Button
						variant={"solid"}
						size={"md"}
						loading={true}
						leftIcon={
							<Icon name="person" size={20} color={Colors.background} />
						}
						loadingLocation="right"
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Text>right Icon, loading=true</Text>
					<Button
						variant={"solid"}
						size={"md"}
						loading={true}
						rightIcon={
							<Icon name="chevron-right" size={20} color={Colors.background} />
						}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
				</View>
				<Text>Icons</Text>
				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 10,
						marginVertical: 10,
					}}>
					<Button
						leftIcon={
							<Icon name="person" size={20} color={Colors.background} />
						}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						rightIcon={
							<Icon name="chevron-right" size={20} color={Colors.background} />
						}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
				</View>
				<Text>Haptic</Text>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
