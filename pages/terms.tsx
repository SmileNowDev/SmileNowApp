// File:
// Default
import React from "react";
import {
	Alert,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
// Libraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/core/screenWrapper";
import { ButtonStyles } from "../styles/styles";
import Header from "../components/header";

export default function TermsAndConditions({ navigation }) {
	// Functions
	const close = async () => {
		Alert.alert(
			"Welcome",
			"By Clicking Accept, you are agreeing to this applications EULA and Privacy Policy",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{
					text: "Accept",
					onPress: async () => {
						await AsyncStorage.setItem("readTerms", "read");
						navigation.goBack();
					},
				},
			]
		);
	};

	return (
		<SafeAreaView>
			<Header goBack={false} />

			<ScrollView style={{ padding: 10 }}>
				<Text>EULA</Text>
				<Text>
					This End-User License Agreement ("EULA") is a legal agreement between
					you and Quae, Inc.. Our EULA was created by EULA Template for Quae.
					This EULA agreement governs your acquisition and use of our Quae
					software ("Software") directly from Quae, Inc. or indirectly through a
					Quae, Inc. authorized reseller or distributor (a "Reseller"). Please
					read this EULA agreement carefully before completing the installation
					process and using the Quae software. It provides a license to use the
					Quae software and contains warranty information and liability
					disclaimers. If you register for a free trial of the Quae software,
					this EULA agreement will also govern that trial. By clicking "accept"
					or installing and/or using the Quae software, you are confirming your
					acceptance of the Software and agreeing to become bound by the terms
					of this EULA agreement. If you are entering into this EULA agreement
					on behalf of a company or other legal entity, you represent that you
					have the authority to bind such entity and its affiliates to these
					terms and conditions. If you do not have such authority or if you do
					not agree with the terms and conditions of this EULA agreement, do not
					install or use the Software, and you must not accept this EULA
					agreement. This EULA agreement shall apply only to the Software
					supplied by Quae, Inc. herewith regardless of whether other software
					is referred to or described herein. The terms also apply to any Quae,
					Inc. updates, supplements, Internet-based services, and support
					services for the Software, unless other terms accompany those items on
					delivery. If so, those terms apply. License Grant Quae, Inc. hereby
					grants you a personal, non-transferable, non-exclusive licence to use
					the Quae software on your devices in accordance with the terms of this
					EULA agreement. You are permitted to load the Quae software (for
					example a PC, laptop, mobile or tablet) under your control. You are
					responsible for ensuring your device meets the minimum requirements of
					the Quae software. You are not permitted to: Edit, alter, modify,
					adapt, translate or otherwise change the whole or any part of the
					Software nor permit the whole or any part of the Software to be
					combined with or become incorporated in any other software, nor
					decompile, disassemble or reverse engineer the Software or attempt to
					do any such things Reproduce, copy, distribute, resell or otherwise
					use the Software for any commercial purpose Allow any third party to
					use the Software on behalf of or for the benefit of any third party
					Use the Software in any way which breaches any applicable local,
					national or international law Use the Software for any purpose that
					Quae, Inc. considers is a breach of this EULA agreement We have no
					tolerance for objectionable content or abusive users Intellectual
					Property and Ownership Quae, Inc. shall at all times retain ownership
					of the Software as originally downloaded by you and all subsequent
					downloads of the Software by you. The Software (and the copyright, and
					other intellectual property rights of whatever nature in the Software,
					including any modifications made thereto) are and shall remain the
					property of Quae, Inc.. Quae, Inc. reserves the right to grant
					licences to use the Software to third parties. Termination This EULA
					agreement is effective from the date you first use the Software and
					shall continue until terminated. You may terminate it at any time upon
					written notice to Quae, Inc.. It will also terminate immediately if
					you fail to comply with any term of this EULA agreement. Upon such
					termination, the licenses granted by this EULA agreement will
					immediately terminate and you agree to stop all access and use of the
					Software. The provisions that by their nature continue and survive
					will survive any termination of this EULA agreement. Governing Law
					This EULA agreement, and any dispute arising out of or in connection
					with this EULA agreement, shall be governed by and construed in
					accordance with the laws of US.
				</Text>
				<Text>Privacy Policy</Text>
				<Text>
					Last updated: June 22, 2021 This Privacy Policy describes Our policies
					and procedures on the collection, use and disclosure of Your
					information when You use the Service and tells You about Your privacy
					rights and how the law protects You. We use Your Personal data to
					provide and improve the Service. By using the Service, You agree to
					the collection and use of information in accordance with this Privacy
					Policy. This Privacy Policy has been created with the help of the
					Privacy Policy Generator. Interpretation and Definitions
					Interpretation The words of which the initial letter is capitalized
					have meanings defined under the following conditions. The following
					definitions shall have the same meaning regardless of whether they
					appear in singular or in plural. Definitions For the purposes of this
					Privacy Policy: Account means a unique account created for You to
					access our Service or parts of our Service. Affiliate means an entity
					that controls, is controlled by or is under common control with a
					party, where "control" means ownership of 50% or more of the shares,
					equity interest or other securities entitled to vote for election of
					directors or other managing authority. Application means the software
					program provided by the Company downloaded by You on any electronic
					device, named Quae Company (referred to as either "the Company", "We",
					"Us" or "Our" in this Agreement) refers to Quae, Inc., 128 Washington
					St, NJ 07030. Country refers to: New Jersey, United States Device
					means any device that can access the Service such as a computer, a
					cellphone or a digital tablet. Personal Data is any information that
					relates to an identified or identifiable individual. Service refers to
					the Application. Service Provider means any natural or legal person
					who processes the data on behalf of the Company. It refers to
					third-party companies or individuals employed by the Company to
					facilitate the Service, to provide the Service on behalf of the
					Company, to perform services related to the Service or to assist the
					Company in analyzing how the Service is used. Usage Data refers to
					data collected automatically, either generated by the use of the
					Service or from the Service infrastructure itself (for example, the
					duration of a page visit). You means the individual accessing or using
					the Service, or the company, or other legal entity on behalf of which
					such individual is accessing or using the Service, as applicable.
					Collecting and Using Your Personal Data Types of Data Collected
					Personal Data While using Our Service, We may ask You to provide Us
					with certain personally identifiable information that can be used to
					contact or identify You. Personally identifiable information may
					include, but is not limited to: Email address First name and last name
					Phone number Address, State, Province, ZIP/Postal code, City Usage
					Data Usage Data Usage Data is collected automatically when using the
					Service. Usage Data may include information such as Your Device's
					Internet Protocol address (e.g. IP address), browser type, browser
					version, the pages of our Service that You visit, the time and date of
					Your visit, the time spent on those pages, unique device identifiers
					and other diagnostic data. When You access the Service by or through a
					mobile device, We may collect certain information automatically,
					including, but not limited to, the type of mobile device You use, Your
					mobile device unique ID, the IP address of Your mobile device, Your
					mobile operating system, the type of mobile Internet browser You use,
					unique device identifiers and other diagnostic data. We may also
					collect information that Your browser sends whenever You visit our
					Service or when You access the Service by or through a mobile device.
					Information Collected while Using the Application While using Our
					Application, in order to provide features of Our Application, We may
					collect, with Your prior permission: Pictures and other information
					from your Device's camera and photo library We use this information to
					provide features of Our Service, to improve and customize Our Service.
					The information may be uploaded to the Company's servers and/or a
					Service Provider's server or it may be simply stored on Your device.
					You can enable or disable access to this information at any time,
					through Your Device settings. Use of Your Personal Data The Company
					may use Personal Data for the following purposes: To provide and
					maintain our Service, including to monitor the usage of our Service.
					To manage Your Account: to manage Your registration as a user of the
					Service. The Personal Data You provide can give You access to
					different functionalities of the Service that are available to You as
					a registered user. For the performance of a contract: the development,
					compliance and undertaking of the purchase contract for the products,
					items or services You have purchased or of any other contract with Us
					through the Service. To contact You: To contact You by email,
					telephone calls, SMS, or other equivalent forms of electronic
					communication, such as a mobile application's push notifications
					regarding updates or informative communications related to the
					functionalities, products or contracted services, including the
					security updates, when necessary or reasonable for their
					implementation. To provide You with news, special offers and general
					information about other goods, services and events which we offer that
					are similar to those that you have already purchased or enquired about
					unless You have opted not to receive such information. To manage Your
					requests: To attend and manage Your requests to Us. For business
					transfers: We may use Your information to evaluate or conduct a
					merger, divestiture, restructuring, reorganization, dissolution, or
					other sale or transfer of some or all of Our assets, whether as a
					going concern or as part of bankruptcy, liquidation, or similar
					proceeding, in which Personal Data held by Us about our Service users
					is among the assets transferred. For other purposes: We may use Your
					information for other purposes, such as data analysis, identifying
					usage trends, determining the effectiveness of our promotional
					campaigns and to evaluate and improve our Service, products, services,
					marketing and your experience. We may share Your personal information
					in the following situations: With Service Providers: We may share Your
					personal information with Service Providers to monitor and analyze the
					use of our Service, to contact You. For business transfers: We may
					share or transfer Your personal information in connection with, or
					during negotiations of, any merger, sale of Company assets, financing,
					or acquisition of all or a portion of Our business to another company.
					With Affiliates: We may share Your information with Our affiliates, in
					which case we will require those affiliates to honor this Privacy
					Policy. Affiliates include Our parent company and any other
					subsidiaries, joint venture partners or other companies that We
					control or that are under common control with Us. With business
					partners: We may share Your information with Our business partners to
					offer You certain products, services or promotions. With other users:
					when You share personal information or otherwise interact in the
					public areas with other users, such information may be viewed by all
					users and may be publicly distributed outside. With Your consent: We
					may disclose Your personal information for any other purpose with Your
					consent. Retention of Your Personal Data The Company will retain Your
					Personal Data only for as long as is necessary for the purposes set
					out in this Privacy Policy. We will retain and use Your Personal Data
					to the extent necessary to comply with our legal obligations (for
					example, if we are required to retain your data to comply with
					applicable laws), resolve disputes, and enforce our legal agreements
					and policies. The Company will also retain Usage Data for internal
					analysis purposes. Usage Data is generally retained for a shorter
					period of time, except when this data is used to strengthen the
					security or to improve the functionality of Our Service, or We are
					legally obligated to retain this data for longer time periods.
					Transfer of Your Personal Data Your information, including Personal
					Data, is processed at the Company's operating offices and in any other
					places where the parties involved in the processing are located. It
					means that this information may be transferred to — and maintained on
					— computers located outside of Your state, province, country or other
					governmental jurisdiction where the data protection laws may differ
					than those from Your jurisdiction. Your consent to this Privacy Policy
					followed by Your submission of such information represents Your
					agreement to that transfer. The Company will take all steps reasonably
					necessary to ensure that Your data is treated securely and in
					accordance with this Privacy Policy and no transfer of Your Personal
					Data will take place to an organization or a country unless there are
					adequate controls in place including the security of Your data and
					other personal information. Disclosure of Your Personal Data Business
					Transactions If the Company is involved in a merger, acquisition or
					asset sale, Your Personal Data may be transferred. We will provide
					notice before Your Personal Data is transferred and becomes subject to
					a different Privacy Policy. Law enforcement Under certain
					circumstances, the Company may be required to disclose Your Personal
					Data if required to do so by law or in response to valid requests by
					public authorities (e.g. a court or a government agency). Other legal
					requirements The Company may disclose Your Personal Data in the good
					faith belief that such action is necessary to: Comply with a legal
					obligation Protect and defend the rights or property of the Company
					Prevent or investigate possible wrongdoing in connection with the
					Service Protect the personal safety of Users of the Service or the
					public Protect against legal liability Security of Your Personal Data
					The security of Your Personal Data is important to Us, but remember
					that no method of transmission over the Internet, or method of
					electronic storage is 100% secure. While We strive to use commercially
					acceptable means to protect Your Personal Data, We cannot guarantee
					its absolute security. Children's Privacy Our Service does not address
					anyone under the age of 13. We do not knowingly collect personally
					identifiable information from anyone under the age of 13. If You are a
					parent or guardian and You are aware that Your child has provided Us
					with Personal Data, please contact Us. If We become aware that We have
					collected Personal Data from anyone under the age of 13 without
					verification of parental consent, We take steps to remove that
					information from Our servers. If We need to rely on consent as a legal
					basis for processing Your information and Your country requires
					consent from a parent, We may require Your parent's consent before We
					collect and use that information. Links to Other Websites Our Service
					may contain links to other websites that are not operated by Us. If
					You click on a third party link, You will be directed to that third
					party's site. We strongly advise You to review the Privacy Policy of
					every site You visit. We have no control over and assume no
					responsibility for the content, privacy policies or practices of any
					third party sites or services. Changes to this Privacy Policy We may
					update Our Privacy Policy from time to time. We will notify You of any
					changes by posting the new Privacy Policy on this page. We will let
					You know via email and/or a prominent notice on Our Service, prior to
					the change becoming effective and update the "Last updated" date at
					the top of this Privacy Policy. You are advised to review this Privacy
					Policy periodically for any changes. Changes to this Privacy Policy
					are effective when they are posted on this page. Contact Us If you
					have any questions about this Privacy Policy, You can contact us: By
					email: info@quae.app
				</Text>

				<TouchableOpacity
					onPress={close}
					style={{ ...ButtonStyles.primary, ...ButtonStyles.buttonLarge }}
				>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Accept</Text>
				</TouchableOpacity>
				<View style={{ height: 100 }} />
			</ScrollView>
		</SafeAreaView>
	);
}
