import { registerForPushNotificationsAsync } from "../lib/notifications";
import React, { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
export default function NotificationProvider({ children }) {
	const navigation = useNavigation();
	useEffect(() => {
		registerForPushNotificationsAsync();
	}, []);

	const notificationListener = useRef();
	const responseListener = useRef();
	useEffect(() => {
		//@ts-expect-error
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {});
		//@ts-expect-error
		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				let data = response.notification.request.content.data;

				if (data.type === "navigation") {
					// @ts-expect-error
					navigation.navigate(data.screen, data.params);
				}
			});
		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);
	return <>{children}</>;
}
