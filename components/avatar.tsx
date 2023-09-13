import React, { useContext, useEffect, useState } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import { Context } from "../providers/provider";
import { useNavigation } from "@react-navigation/native";
import ModalWrapper from "./core/modalWrapper";
import { Fonts, Colors } from "../styles/theme";
import OtherProfile from "./otherProfile";
import DefaultOptions from "./core/defaultOptions";
import Icon from "./core/icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "./SmileNowUI/button";
interface AvatarProps {
	pic: string;
	size: number;
	id: string;
}

export function Picture({ size, pic }) {
	const [photoLoading, setPhotoLoading] = useState(false);
	function getLoaderSize(): "small" | "large" | number {
		if (size > 70) {
			return "large";
		} else if (size < 25) {
			return "small";
		} else {
			return 20;
		}
	}

	function LoadingAnimation({ loading }: { loading: boolean }) {
		const loaderOpacity = new Animated.Value(0);
		const loaderOffsetX = new Animated.Value(-2 * size);
		Animated.loop(
			Animated.timing(loaderOffsetX, {
				toValue: size,
				duration: 1000,
				useNativeDriver: true,
			})
		).start();
		useEffect(() => {
			if (!loading) {
				Animated.timing(loaderOpacity, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}).start();
			}
		}, [loading]);
		const backgroundColor = loaderOpacity.interpolate({
			inputRange: [0, 1],
			outputRange: ["rgba(20, 20, 20, 0.8)", "rgba(20, 20, 20, 0)"], // Light gray to transparent
		});
		if (loading) {
			return (
				<>
					<Animated.View
						style={{
							height: size,
							width: size,
							backgroundColor,
							position: "absolute",
							borderRadius: size / 2,
							zIndex: 100,
							overflow: "hidden",
						}}>
						<Animated.View
							style={{
								height: size * 3,
								width: size - 15,
								// backgroundColor: Colors.textSecondary + "50",
								transform: [{ rotate: "45deg" }, { translateX: loaderOffsetX }],
							}}>
							<LinearGradient
								colors={[
									Colors.textSecondary + "00",
									Colors.textSecondary + "80",
									Colors.textSecondary + "00",
								]}
								style={{ height: "100%", width: "100%" }}></LinearGradient>
						</Animated.View>
					</Animated.View>
				</>
			);
		}
		return <></>;
	}

	return (
		<View
			style={{
				position: "relative",
				shadowOpacity: 0.25,
				shadowOffset: { width: 0, height: 0 },
				shadowRadius: 5,
				elevation: 2,
				backgroundColor: Colors.background,
				borderRadius: size / 2,
			}}>
			{!pic ? (
				<View
					style={{
						width: size,
						height: size,
						overflow: "hidden",
						borderRadius: size / 2,
					}}>
					<Icon
						name="person"
						size={size}
						color={Colors.textSecondary}
						style={{
							transform: [
								{
									translateY: size / 6,
								},
							],
						}}
					/>
				</View>
			) : (
				<>
					<LoadingAnimation loading={photoLoading} />
					<Image
						source={{ uri: pic }}
						style={{
							width: size,
							height: size,
							borderRadius: size / 2,
							zIndex: 50,
						}}
						onLoadStart={() => {
							if (!pic) {
								setPhotoLoading(true);
							}
						}}
						onLoad={() => setPhotoLoading(false)}
					/>
				</>
			)}
		</View>
	);
}
export default function Avatar({ pic, size = 40, id }: AvatarProps) {
	const { userId } = useContext(Context);
	const navigation = useNavigation();
	const [modalVisible, setModalVisible] = useState(false);

	function handleNavigate() {
		if (id === userId) {
			// @ts-expect-error
			navigation.navigate("Profile");
		} else {
			setModalVisible(true);
		}
	}

	return (
		<>
			<TouchableOpacity onPress={() => handleNavigate()}>
				<Picture size={size} pic={pic} />
			</TouchableOpacity>
			<ModalWrapper
				visible={modalVisible}
				setVisible={setModalVisible}
				fullHeight={false}
				scrollable={false}
				noSwipe={false}>
				<View
					style={{
						position: "absolute",
						right: 20,
						top: 20,
						zIndex: 100,
					}}>
					<DefaultOptions
						type={"user"}
						id={id}
						size={25}
						onPress={() => setModalVisible(false)}
					/>
				</View>
				<OtherProfile id={id} />
				<Button
					onPress={() => setModalVisible(false)}
					variant="outlined"
					colorScheme="gray"
					style={{
						flex: 1,
						marginTop: 50,
					}}>
					Close
				</Button>
			</ModalWrapper>
		</>
	);
}
