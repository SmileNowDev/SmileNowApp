import React from "react";
import ScreenWrapper from "../../components/core/screenWrapper";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
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
				<Text variant="title" style={{ paddingTop: 30, paddingBottom: 0 }}>
					SmileNow UI
				</Text>
				<Text variant="subTitle">(and internal docs)</Text>
				<View style={styles.header}>
					<Text variant="subTitle">Text</Text>
				</View>
				<Text variant="button">variant = "..."</Text>
				<View
					style={{
						...styles.render,
						flexDirection: "row",
						justifyContent: "flex-start",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 10,
						marginBottom: 20,
					}}>
					<Text variant="title">title</Text>
					<Text variant="subTitle">subTitle</Text>
					<Text variant="button">button</Text>
					<Text variant="body">body</Text>
					<Text variant="small">small</Text>
				</View>
				<Text variant="button">colorScheme = "..."</Text>
				<View
					style={{
						...styles.render,
						flexDirection: "row",
						justifyContent: "flex-start",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 10,
						marginBottom: 20,
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

				<Text variant={"button"}>numberOfLines = {"null"} (default)</Text>
				<View style={{ ...styles.render, marginBottom: 20 }}>
					<Text variant={"body"} style={{ marginVertical: 10 }}>
						Eiusmod voluptate fugiat velit elit ad. Reprehenderit aliqua nulla
						Lorem aliqua veniam. Nisi et id sit consectetur Lorem. Culpa tempor
						laborum consectetur aliquip ex et.
					</Text>
				</View>
				<Text variant="button">numberOfLines = {1} or greater and ...</Text>
				<Text variant={"button"}>ellipsize = "clip" </Text>
				<View style={{ ...styles.render, marginBottom: 20 }}>
					<Text
						variant={"body"}
						ellipsize="clip"
						numberOfLines={1}
						style={{ marginVertical: 10 }}>
						Eiusmod voluptate fugiat velit elit ad. Reprehenderit aliqua nulla
						Lorem aliqua veniam. Nisi et id sit consectetur Lorem. Culpa tempor
						laborum consectetur aliquip ex et.
					</Text>
				</View>
				<Text variant={"button"}>ellipsize = "head" </Text>
				<View style={{ ...styles.render, marginBottom: 20 }}>
					<Text
						variant={"body"}
						ellipsize="head"
						numberOfLines={1}
						style={{ marginVertical: 10 }}>
						Eiusmod voluptate fugiat velit elit ad. Reprehenderit aliqua nulla
						Lorem aliqua veniam. Nisi et id sit consectetur Lorem. Culpa tempor
						laborum consectetur aliquip ex et.
					</Text>
				</View>

				<Text variant={"button"}>ellipsize = "tail" </Text>
				<View style={{ ...styles.render, marginBottom: 20 }}>
					<Text
						variant={"body"}
						ellipsize="tail"
						numberOfLines={1}
						style={{ marginVertical: 10 }}>
						Eiusmod voluptate fugiat velit elit ad. Reprehenderit aliqua nulla
						Lorem aliqua veniam. Nisi et id sit consectetur Lorem. Culpa tempor
						laborum consectetur aliquip ex et.
					</Text>
				</View>
				<Text variant={"button"}>ellipsize = "middle"</Text>
				<View style={{ ...styles.render, marginBottom: 20 }}>
					<Text
						variant={"body"}
						ellipsize="middle"
						numberOfLines={1}
						style={{ marginVertical: 10 }}>
						Eiusmod voluptate fugiat velit elit ad. Reprehenderit aliqua nulla
						Lorem aliqua veniam. Nisi et id sit consectetur Lorem. Culpa tempor
						laborum consectetur aliquip ex et.
					</Text>
				</View>
				<View style={styles.header}>
					<Text variant="subTitle">Buttons</Text>
				</View>
				<Text>variant = 'solid' colorScheme="...</Text>
				<View
					style={{
						...styles.render,
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 10,
						marginBottom: 20,
					}}>
					<Button
						variant={"solid"}
						colorScheme={"primary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						primary
					</Button>
					<Button
						variant="solid"
						colorScheme={"secondary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						secondary
					</Button>
					<Button
						variant={"solid"}
						colorScheme={"tertiary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						tertiary
					</Button>
					<Button
						variant={"solid"}
						colorScheme={"gray"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						gray
					</Button>
					<Button
						variant={"solid"}
						colorScheme={"success"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						success
					</Button>
					<Button
						variant={"solid"}
						colorScheme={"danger"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						danger
					</Button>
					<View style={{ backgroundColor: "blue", padding: 5 }}>
						<Button
							colorScheme={"white"}
							size={"sm"}
							onPress={() => Alert.alert("it worked")}>
							white
						</Button>
					</View>
					<Button
						colorScheme={"black"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						black
					</Button>
				</View>
				<Text>variant = "outlined" colorScheme="..."</Text>
				<View
					style={{
						...styles.render,
						display: "flex",
						flexDirection: "row",
						gap: 10,
						flexWrap: "wrap",
						marginBottom: 20,
					}}>
					<Button
						variant={"outlined"}
						colorScheme={"primary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						primary
					</Button>
					<Button variant="outlined" colorScheme={"secondary"} size={"sm"}>
						secondary
					</Button>
					<Button
						variant={"outlined"}
						colorScheme={"tertiary"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						tertiary
					</Button>
					<Button
						variant={"outlined"}
						colorScheme={"gray"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						gray
					</Button>
					<Button
						variant={"outlined"}
						colorScheme={"success"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						success
					</Button>
					<Button
						variant={"outlined"}
						colorScheme={"danger"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						danger
					</Button>
					<View style={{ backgroundColor: "blue", padding: 5 }}>
						<Button
							variant={"outlined"}
							colorScheme={"white"}
							size={"sm"}
							onPress={() => Alert.alert("it worked")}>
							white
						</Button>
					</View>
					<Button
						variant={"outlined"}
						colorScheme={"black"}
						size={"sm"}
						onPress={() => Alert.alert("it worked")}>
						black
					</Button>
				</View>

				<Text>variant = "link" & variant = "unstyled" & variant = "ghost"</Text>
				<View
					style={{
						...styles.render,
						display: "flex",
						flexDirection: "row",
						gap: 10,
						marginBottom: 20,
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
						...styles.render,
						display: "flex",
						flexDirection: "row",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 10,
						marginBottom: 20,
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
				<Text variant="subTitle">Loading & icons</Text>
				<View
					style={{
						flexDirection: "column",
						gap: 10,
						marginVertical: 10,
					}}>
					<Text>
						loadingText="any text" loading=boolean
						loadingLocation="left"|"right" loadingIcon={"any icon"}
					</Text>
					<View
						style={{
							...styles.render,
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							gap: 10,
						}}>
						<Button
							variant={"solid"}
							size={"md"}
							loading={true}
							loadingText="Loading..."
							onPress={() => Alert.alert("it worked")}>
							Hello
						</Button>
						<Button
							variant={"solid"}
							size={"md"}
							loading={true}
							onPress={() => Alert.alert("it worked")}>
							Hello
						</Button>
						<Button
							variant={"solid"}
							size={"md"}
							loading={true}
							loadingLocation="right"
							onPress={() => Alert.alert("it worked")}>
							Hello
						</Button>
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
						<Button
							variant={"solid"}
							size={"md"}
							loading={true}
							rightIcon={
								<Icon
									name="chevron-right"
									size={20}
									color={Colors.background}
								/>
							}
							loadingLocation="right"
							onPress={() => Alert.alert("it worked")}>
							Hello
						</Button>
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
						<Button
							variant={"solid"}
							size={"md"}
							loading={true}
							rightIcon={
								<Icon
									name="chevron-right"
									size={20}
									color={Colors.background}
								/>
							}
							onPress={() => Alert.alert("it worked")}>
							Hello
						</Button>
					</View>
				</View>
				<Text>
					iconLeft = {"any icon"} iconRight={"any icon"}
				</Text>
				<View
					style={{
						...styles.render,
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 10,
						marginBottom: 20,
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
				<Text>Haptic = "light" | "medium" | "heavy" | "selection";</Text>
				<View
					style={{
						...styles.render,
						marginBottom: 20,
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 10,
					}}>
					<Button
						variant={"solid"}
						size={"md"}
						haptic={"light"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						size={"md"}
						haptic={"medium"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						size={"md"}
						haptic={"heavy"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
					<Button
						variant={"solid"}
						size={"md"}
						haptic={"selection"}
						onPress={() => Alert.alert("it worked")}>
						Hello
					</Button>
				</View>
				<View style={styles.header}>
					<Text variant="subTitle">Icons</Text>
				</View>
				<Text>name="name-of-icon" size=number color="string"</Text>
				<View style={styles.render}>
					<Icon name="person" size={20} color={Colors.text} />
				</View>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	header: {
		width: "100%",
		borderBottomColor: Colors.textSecondary,
		borderStyle: "solid",
		borderBottomWidth: 3,
		paddingTop: 40,
		marginBottom: 20,
	},
	render: {
		borderWidth: 2,
		borderColor: Colors.textSecondary,
		borderStyle: "dashed",
		padding: 6,
		backgroundColor: Colors.foreground,
	},
});
