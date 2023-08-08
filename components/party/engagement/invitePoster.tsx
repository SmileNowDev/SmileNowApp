import { downloadImage } from "../../../utils/downloadView";
import React, { useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Button,
	Image,
	Alert,
} from "react-native";
import { ButtonStyles, Dim } from "../../../styles/styles";
import { Colors, Fonts } from "../../../styles/theme";
import QRCode from "react-native-qrcode-svg";
import Icon from "../../core/icons";
// @ts-expect-error
import appStore from "../../../assets/appStore.png";
import LogoBackground from "./logoBackground";
const appStoreURL =
	"https://apps.apple.com/us/app/smile-now-party-pics/id6449005895";
export default function InvitePoster({
	code,
	name,
}: {
	code: string;
	name: string;
}) {
	const scale = 5;
	const downloadRef = useRef(null);
	const exampleRef = useRef(null);
	const paperRatio = 11 / 8.5;
	const samplePosterWidth = Dim.width - 60;
	const downloadPosterWidth = samplePosterWidth * scale;
	const downloadPosterHeight = downloadPosterWidth * paperRatio;

	const Poster = ({ style }: { style?: object }) => {
		return (
			<View
				style={{
					...style,
					shadowColor: "black",
					...styles.shadowWrapper,
				}}>
				<View
					style={{
						width: downloadPosterWidth,
						height: downloadPosterHeight,
						padding: 10 * scale,
						backgroundColor: Colors.background,
						overflow: "hidden",
						justifyContent: "center",
					}}>
					<View
						style={{
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Text
							style={{
								fontSize: (Fonts.subTitle.fontSize - 2) * scale,
								fontFamily: Fonts.subTitle.fontFamily,
								textAlign: "center",
							}}>
							Welcome to{" "}
							<Text style={{ fontFamily: Fonts.title.fontFamily }}>{name}</Text>
						</Text>
						<Text
							style={{
								fontSize: (Fonts.body.fontSize - 2) * scale,
								fontFamily: Fonts.subTitle.fontFamily,
							}}>
							A <Text style={{ fontStyle: "italic" }}>Smile Now</Text>{" "}
							Experience
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							marginVertical: 10 * scale,
							gap: 10 * scale,
							position: "relative",
							height: 60 * scale,
						}}>
						<View
							style={{
								position: "absolute",
								width: Dim.width * scale,
								backgroundColor: Colors.primary + "30",
								height: 60 * scale,
							}}></View>
						<Text
							style={{
								width: Dim.width * scale - 80 * scale,
								fontFamily: Fonts.title.fontFamily,
								fontSize: (Fonts.body.fontSize - 2) * scale,
								textAlign: "center",
							}}>
							Please help me create a memorable event by taking candid photos
							with SmileNow
						</Text>
					</View>
					<View
						style={{
							width: "100%",
							gap: 20 * scale,
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "flex-start",
							paddingVertical: 10 * scale,
						}}>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "flex-start",
								gap: 10 * scale,
								alignItems: "center",
							}}>
							<Text
								style={{
									fontFamily: Fonts.title.fontFamily,
									fontSize: Fonts.body.fontSize * scale,
								}}>
								1. Download App
							</Text>
							<Image
								source={appStore}
								style={{
									width: 126 * scale,
									height: 36 * scale,
								}}
							/>
							<View
								style={{
									backgroundColor: Colors.background,
									borderRadius: 5 * scale,
									padding: 5 * scale,
									...styles.shadowWrapper,
								}}>
								<QRCode value={appStoreURL} size={120 * scale} />
							</View>
						</View>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "flex-start",
								gap: 10 * scale,
								alignItems: "center",
							}}>
							<Text
								style={{
									fontFamily: Fonts.title.fontFamily,
									fontSize: Fonts.body.fontSize * scale,
								}}>
								2. Create Account
							</Text>
							<View
								style={{
									width: 126 * scale,
									height: 36 * scale,
									backgroundColor: Colors.secondary,
									borderRadius: 4 * scale,
									justifyContent: "center",
									alignItems: "center",
								}}>
								<Text
									style={{
										fontFamily: Fonts.button.fontFamily,
										fontSize: Fonts.body.fontSize * scale,
									}}>
									Join Party
								</Text>
							</View>
							<View
								style={{
									backgroundColor: Colors.background,
									borderRadius: 5 * scale,
									padding: 5 * scale,
									...styles.shadowWrapper,
								}}>
								<QRCode value={code} size={120 * scale} />
							</View>
						</View>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							gap: 10 * scale,
						}}>
						<Text
							style={{
								fontFamily: Fonts.titleBold.fontFamily,
								fontSize: Fonts.subTitle.fontSize * scale,
							}}>
							3. Have Fun!
						</Text>
					</View>
					<LogoBackground scale={scale} />
				</View>
			</View>
		);
	};
	return (
		<>
			<View
				style={{
					width: Dim.width - 40,
					height: Dim.height - 160,
					justifyContent: "center",
					alignItems: "center",
				}}>
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
					<Poster />
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
		</>
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
	shadowWrapper: {
		shadowColor: "black",
		shadowOpacity: 0.15,
		shadowRadius: 50,
		elevation: 5,
		shadowOffset: {
			width: 0,
			height: 0,
		},
	},
});

{
	/* <Text
						style={{
							marginBottom: 10,
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize * 10,
							textAlign: "center",
						}}>
						Tell friends to join with
					</Text> */
}
{
	/* <Text
						style={{
							fontFamily: Fonts.title.fontFamily,
							fontSize: (Fonts.title.fontSize + 10) * 10,
							color: Colors.primary,
							textAlign: "center",
							marginBottom: 20,
						}}>
						{code}
					</Text> */
}
