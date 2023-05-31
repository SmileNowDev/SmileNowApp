import AnimatedLottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";
import { Dim } from "../../styles/styles";

export default function PartyLoading() {
	return (
		<View
			style={{
				flex: 1,
				height: "100%",
				backgroundColor: "rgb(12,0,64)",
				alignItems: "center",
				justifyContent: "center",
			}}>
			<AnimatedLottieView
				source={require("../../assets/animations/polaroid-loop.json")}
				autoPlay
				loop
				style={{
					width: Dim.width,
					height: Dim.width,
				}}
			/>
			<AnimatedLottieView
				source={require("../../assets/animations/polaroid-loop.json")}
				autoPlay
				loop
				style={{
					width: Dim.width,
					height: Dim.width,
				}}
			/>
			<AnimatedLottieView
				source={require("../../assets/animations/polaroid-loop.json")}
				autoPlay
				loop
				style={{
					width: Dim.width,
					height: Dim.width,
				}}
			/>
		</View>
	);
}
