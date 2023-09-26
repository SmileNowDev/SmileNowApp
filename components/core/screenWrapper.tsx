// File: Reusable loading wrapper
// Default
import React, { useCallback, useState } from "react";
// Theming
// Libraries
import {
	ActivityIndicator,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	View,
} from "react-native";
import { Colors } from "../../styles/theme";
import { trackEvent } from "@aptabase/react-native";

type ScreenWrapperProps = {
	scrollEnabled?: any;
	onRefresh?: any;
	loading?: any;
	onBottomScroll?: any;
	children?: any;
	bottomLoading?: any;
	style?: any;
	keyboardShouldPersistTaps?: "always" | "never" | "handled";
	analyticsTitle?: string;
};

export default function ScreenWrapper({
	scrollEnabled,
	onRefresh,
	loading,
	onBottomScroll,
	children,
	bottomLoading,
	style,
	keyboardShouldPersistTaps = "handled",
	analyticsTitle,
}: ScreenWrapperProps) {
	const [refreshing, setRefreshing] = useState(false);

	const isCloseToBottom = ({
		layoutMeasurement,
		contentOffset,
		contentSize,
	}) => {
		const paddingToBottom = 1000;
		return (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - paddingToBottom
		);
	};
	// @ts-expect-error
	const onRefreshWrapper = useCallback(async () => {
		setRefreshing(true);
		onRefresh();
		setRefreshing(false);
	});
	if (analyticsTitle) {
		trackEvent("Page_View", {
			analyticsTitle,
		});
	}
	if (loading) {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ flex: 1, justifyContent: "center" }}>
					<ActivityIndicator size={"large"} color={Colors.primary} />
				</View>
			</SafeAreaView>
		);
	} else
		return (
			<>
				<ScrollView
					refreshControl={
						onRefresh ? (
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh ? onRefreshWrapper : null}
							/>
						) : null
					}
					onScroll={({ nativeEvent }) => {
						if (isCloseToBottom(nativeEvent)) {
							if (onBottomScroll) {
								onBottomScroll();
							}
						}
					}}
					scrollEventThrottle={400}
					scrollEnabled={scrollEnabled ? true : false}
					style={
						style
							? style
							: {
									borderRadius: 10,
									paddingHorizontal: 10,
							  }
					}
					keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
					<View style={{ alignItems: "center" }}>
						<View
							style={{
								flex: 1,
								width: "100%",
								zIndex: 1,
							}}>
							{children}
						</View>

						{bottomLoading && <ActivityIndicator />}
						<View style={{ height: 100 }} />
					</View>
				</ScrollView>
			</>
		);
}
