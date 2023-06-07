import React, { useContext, useEffect } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import Icon from "../core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../../styles/styles";
import { RootStackParamList } from "../../navigation/rootNavigator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Context } from "../../providers/provider";
import { Picture } from "../avatar";
import userApi from "../../api/user/user";
import friendApi from "../../api/user/friend";

import { UserType } from "../../pages/profile";
type UserDataType = {
	pic: string;
};
export default function HomeHeader() {
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const { userId } = useContext(Context);
	const userData: UserDataType = queryClient.getQueryData(["user", userId]);
	const { isLoading, data } = useQuery({
		queryKey: ["user", userId],
		queryFn: getUser,
		staleTime: Infinity,
	});
	async function getUser() {
		const result = await userApi.get({ userId });
		if (result.ok) {
			let user: UserType = {
				//@ts-expect-error
				name: result.data.name,
				//@ts-expect-error
				pic: result.data.pic,
				//@ts-expect-error
				username: result.data.username,
			};
			return user;
		} else {
			// todo- add chrome dinosaur game if user is not found
			return {
				name: "User Not Found",
				pic: "",
				username: "please_try_again_later",
			};
		}
	}
	const { data: requests, isLoading: isRequestsLoading } = useQuery({
		queryKey: ["requests"],
		queryFn: countRequests,
	});
	async function countRequests() {
		const result = await friendApi.countRequests();
		if (result.ok) {
			// @ts-expect-error
			let count = result.data.requests as number;
			return count;
		} else {
			return 0;
		}
	}

	return (
		<View
			style={{
				...GlobalStyles.header,
			}}>
			<TouchableOpacity
				onPress={() =>
					navigation.navigate("Friends" as keyof RootStackParamList["Friends"])
				}>
				<Icon name={"people"} size={30} />
				{!isRequestsLoading && requests > 0 ? (
					<View
						style={{
							position: "absolute",
							backgroundColor: Colors.danger,
							justifyContent: "center",
							height: 18,
							width: 18,
							borderRadius: 9,
							right: 0,
							marginRight: -7,
							marginTop: -7,
						}}>
						<Text
							style={{
								color: Colors.background,
								fontSize: 12,
								textAlign: "center",
								fontFamily: Fonts.subTitle.fontFamily,
							}}>
							{requests}
						</Text>
					</View>
				) : (
					<></>
				)}
			</TouchableOpacity>
			<View
				style={{
					flex: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
					gap: 5,
				}}>
				<Image
					source={require("../../assets/logo_color.png")}
					style={{ width: 25, height: 25 }}
				/>
				<Text
					style={{
						textAlign: "center",
						fontFamily: "Exo_700Bold",
						fontSize: 20,
						color: Colors.primary,
					}}>
					Smile Now
				</Text>
			</View>
			{!isLoading ? (
				<TouchableOpacity
					onPress={() =>
						navigation.navigate(
							"Profile" as keyof RootStackParamList["Profile"]
						)
					}>
					<Picture pic={userData?.pic || data?.pic} size={30} />
				</TouchableOpacity>
			) : (
				<></>
			)}
			{/* profile button */}
		</View>
	);
}
