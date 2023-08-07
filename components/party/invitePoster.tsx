import { downloadImage } from "../../utils/downloadView";
import React, { useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Button,
	Alert,
} from "react-native";
import { ButtonStyles, Dim } from "../../styles/styles";
import { Colors, Fonts } from "../../styles/theme";
import QRCode from "react-native-qrcode-svg";
import Icon from "../../components/core/icons";

export default function InvitePoster({
	code,
	name,
}: {
	code: string;
	name: string;
}) {
	const scale = 10;
	const downloadRef = useRef(null);
	const paperRatio = 11 / 8.5;
	const samplePosterWidth = Dim.width - 60;
	const downloadPosterWidth = samplePosterWidth * scale;
	const downloadPosterHeight = downloadPosterWidth * paperRatio;

	const Poster = ({ style }) => {
		return (
			<View
				style={{
					width: downloadPosterWidth,
					height: downloadPosterHeight,
					padding: 10 * scale,
					backgroundColor: Colors.background,
					...style,
				}}>
				<View
					style={{
						flexDirection: "column",
						justifyContent: "flex-start",
						alignItems: "center",
					}}>
					<Text
						style={{
							fontSize: Fonts.subTitle.fontSize * scale,
							fontFamily: Fonts.title.fontFamily,
						}}>
						Welcome to {name}
					</Text>
					<Text
						style={{
							fontSize: (Fonts.subTitle.fontSize - 5) * scale,
							fontFamily: Fonts.subTitle.fontFamily,
						}}>
						A <Text style={{ fontStyle: "italic" }}>Smile Now</Text> Party
					</Text>
				</View>
				<Text
					style={{
						marginBottom: 10,
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize * 10,
						textAlign: "center",
					}}>
					Tell friends to join with
				</Text>
				<Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: (Fonts.title.fontSize + 10) * 10,
						color: Colors.primary,
						textAlign: "center",
						marginBottom: 20,
					}}>
					{code}
				</Text>
				<QRCode value={code} size={150 * scale} />
			</View>
		);
	};
	return (
		<View
			style={{
				width: Dim.width - 40,
				height: Dim.height - 160,
				justifyContent: "center",
				alignItems: "center",
			}}>
			<TouchableOpacity
				style={{
					position: "absolute",
					top: 10,
					right: 10,
				}}>
				<Icon name="close" size={30} />
			</TouchableOpacity>
			<View
				style={{
					transform: [{ scale: 1 / scale }],
				}}>
				<Poster
					style={{
						...styles.container,
						position: "relative",
					}}
				/>
			</View>
			<View
				ref={downloadRef}
				style={{
					position: "absolute",
					transform: [{ translateX: downloadPosterWidth * 15 }],
				}}>
				<Poster style={{}} />
			</View>

			<TouchableOpacity
				style={{
					position: "absolute",
					bottom: 0,
					...ButtonStyles.primary,
					...ButtonStyles.buttonLarge,
				}}
				onPress={() => {
					downloadImage(downloadRef);
				}}>
				<Text
					style={{
						...ButtonStyles.buttonTextLarge,
					}}>
					Save to Camera Roll
				</Text>
			</TouchableOpacity>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		margin: 5,
		borderWidth: 1,
		borderColor: Colors.border,
		borderStyle: "solid",

		shadowColor: "black",
		shadowOpacity: 0.5,
		shadowRadius: 14,
		elevation: 10,
	},
});
