import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Colors, Fonts } from "../../styles/theme";
import Icon from "./icons";

export default function QueryLoadingStatus({ isLoading, status }) {
	return (
		<View>
			{isLoading ? (
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: 5,
					}}>
					<ActivityIndicator size="small" color={Colors.textSecondary} />

					<Text
						style={{
							fontFamily: Fonts.small.fontFamily,
							fontSize: Fonts.small.fontSize,
							color: Colors.textSecondary,
						}}>
						Saving...
					</Text>
				</View>
			) : (
				<>
					{status === "success" && (
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								gap: 5,
							}}>
							<Icon name="check" size={18} color={Colors.textSecondary} />
							<Text
								style={{
									fontFamily: Fonts.small.fontFamily,
									fontSize: Fonts.small.fontSize,
									color: Colors.textSecondary,
								}}>
								Saved
							</Text>
						</View>
					)}
					{status === "error" && (
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								gap: 5,
							}}>
							<Icon name="error" size={18} color={Colors.danger} />
							<Text
								style={{
									fontFamily: Fonts.small.fontFamily,
									fontSize: Fonts.small.fontSize,
									color: Colors.textSecondary,
								}}>
								Try again later
							</Text>
						</View>
					)}
				</>
			)}
		</View>
	);
}
