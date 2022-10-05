import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import {useTheme, ThemeProvider, createTheme} from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CssBaseline from '@mui/material/CssBaseline';
import Picker from '@emoji-mart/react';
import axios from 'axios';
import {useFlags, useLDClient} from 'launchdarkly-react-client-sdk';
import PropTypes from 'prop-types';
import stringHash from 'string-hash';
import {useDeviceData} from 'react-device-detect';
import store from 'store2';

import {
	Card,
	CardMedia,
	CardContent,
	CardHeader,
	CardActions,
	Grid,
	Popover,
	Button,
	Tooltip,
	TextField,
	ButtonGroup,
} from '@mui/material';

const ColorModeContext = React.createContext({toggleColorMode() {}});

const randomNumberGenerator = () => {
	return Math.floor(1_000_000_000 + Math.random() * 9_000_000_000);
};

function Toggler({login, userKey}) {
	const theme = useTheme();

	console.log('user key in toggler', userKey);

	const [temporaryPhoneNumber, setTemporaryPhoneNumber] = React.useState(
		`+1${randomNumberGenerator()}1`,
	);
	const [isChangingPhoneNumber, setIsChangingPhoneNumber] =
		React.useState('false');

	const toggleIsChangingPhoneNumber = () => {
		setIsChangingPhoneNumber(!isChangingPhoneNumber);
	};

	const colorMode = React.useContext(ColorModeContext);

	const {darkMode} = useFlags();

	const phoneNumberChange = (event) => {
		setTemporaryPhoneNumber(event.target.value);
	};

	return (
		<AppBar
			position="sticky"
			color="inherit"
			sx={{top: 'auto', bottom: 0, width: '100%', alignItems: 'center'}}
		>
			<Toolbar color="inherit">
				{darkMode ? (
					<IconButton
						sx={{ml: 1, paddingRight: 2}}
						color="inherit"
						onClick={colorMode.toggleColorMode}
					>
						{theme.palette.mode === 'dark' ? (
							<Brightness7Icon />
						) : (
							<Brightness4Icon />
						)}
					</IconButton>
				) : null}
				{userKey && isChangingPhoneNumber ? (
					<>
						<Typography>{userKey}</Typography>
						<Button
							variant="contained"
							color="secondary"
							sx={{margin: 2}}
							onClick={toggleIsChangingPhoneNumber}
						>
							Change User Key
						</Button>
					</>
				) : (
					<>
						<TextField
							sx={{marginTop: 2}}
							id="phoneNumber"
							label="Telephone Number"
							value={temporaryPhoneNumber}
							helperText="a random phone number"
							onChange={phoneNumberChange}
						/>
						<ButtonGroup
							sx={{paddingLeft: 2}}
							orientation="vertical"
							aria-label="vertical outlined button group"
						>
							<Button
								onClick={() => {
									login(temporaryPhoneNumber);
									setIsChangingPhoneNumber(true);
								}}
							>
								Save
							</Button>
							<Button onClick={toggleIsChangingPhoneNumber}>Cancel</Button>
						</ButtonGroup>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
}

Toggler.propTypes = {
	login: PropTypes.func,
	userKey: PropTypes.number,
};

function MyApp({login, userKey}) {
	const [emoji, setEmoji] = React.useState();
	const [pickerOpen, setPickerOpen] = React.useState(false);
	const [emojiTitle, setEmojiTitle] = React.useState();
	const [emojiUsage, setEmojiUsage] = React.useState();

	React.useEffect(() => {
		// Do the thing to get the emoji title and usage here
		async function fetchData() {
			try {
				if (emoji) {
					const response = await axios({
						baseURL: import.meta.env.VITE_API_URL,
						url: import.meta.env.VITE_API_PATH,
						params: {
							emoji,
							userKey,
						},
					});

					if (response.data) {
						setEmojiTitle(response.data.emojiTitle);
						setEmojiUsage(response.data.emojiUsage);
					}
				}
			} catch (error) {
				console.error(error);
			}
		}

		fetchData();
	}, [emoji, userKey]);

	const [anchorElement, setAnchorElement] = React.useState();
	const open = Boolean(anchorElement);
	const id = open ? 'emoji=picker' : undefined;

	const openPicker = (event) => {
		setPickerOpen(true);
		setAnchorElement(event.currentTarget);
	};

	const closePicker = () => {
		setPickerOpen(false);
		setAnchorElement(null);
	};

	return (
		<>
			<Toggler login={login} userKey={userKey} />
			<Popover
				open={pickerOpen}
				id={id}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				anchorEl={anchorElement}
				onClose={closePicker}
			>
				<Picker
					onEmojiSelect={(selectedEmoji) => {
						console.log(selectedEmoji);
						setEmoji(selectedEmoji.native);
						closePicker();
					}}
				/>
			</Popover>
			<Grid
				container
				sx={{
					width: 1,
					height: '100vh',
				}}
			>
				<Grid item xs={0} md={4} lg={4} />
				<Grid item xs={12} md={4} lg={4}>
					<Card
						disabled
						sx={{
							width: 1,
						}}
					>
						<CardHeader
							title="EmojiSplainerBot 9000"
							sx={{
								textAlign: 'center',
							}}
						/>
						<CardContent>
							<CardMedia
								component="img"
								height="300"
								image="/noun-smiley-struck-out-tongue-1735782-E6E6E6.png"
								alt="emojisplainer bot 9000"
							/>
							<CardContent>
								<Typography
									gutterBottom
									variant="h5"
									component="div"
									sx={{textAlign: 'center'}}
								>
									Pick an your emoji and I will explain it to you!
								</Typography>
							</CardContent>
						</CardContent>
						<CardActions sx={{justifyContent: 'center'}}>
							<Tooltip title="please select a number at the top first">
								<span>
									<Button variant="contained" onClick={openPicker}>
										Open Emoji Picker
									</Button>
								</span>
							</Tooltip>
						</CardActions>
					</Card>
					<br />
					{emoji ? (
						<Card>
							<Box sx={{alignItems: 'center'}}>
								<Box sx={{alignItems: 'center'}}>
									<CardMedia>
										<Typography
											gutterBottom
											variant="h2"
											component="div"
											sx={{textAlign: 'center'}}
										>
											{emoji}
										</Typography>
									</CardMedia>
								</Box>
								<CardContent>
									<Typography
										gutterBottom
										variant="h5"
										component="div"
										sx={{textAlign: 'center'}}
									>
										{emojiTitle}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{emojiUsage}
									</Typography>
								</CardContent>
							</Box>
						</Card>
					) : null}
				</Grid>
			</Grid>
		</>
	);
}

MyApp.propTypes = {
	login: PropTypes.func,
	userKey: PropTypes.number,
};

export default function ToggleColorMode() {
	const [mode, setMode] = React.useState('light');

	const launchDarklyClient = useLDClient();

	const hasUserKey = store.has('userKey');
	const [userKey, setUserKey] = React.useState(
		hasUserKey ? store.get('userKey') : null,
	);

	const [phoneNumber, setPhoneNumber] = React.useState();
	const deviceData = useDeviceData();

	React.useEffect(() => {
		if (phoneNumber) {
			setUserKey(`${stringHash(phoneNumber)}${phoneNumber.slice(-1)}`);
		}

		if (userKey && launchDarklyClient) {
			launchDarklyClient.identify({
				key: userKey,
				custom: {
					browserName: deviceData.browser.Name,
					deviceName: deviceData.model,
					osName: deviceData.os.name,
				},
			});
			store.set('userKey', userKey);
		}
	}, [userKey, phoneNumber, launchDarklyClient, deviceData]);

	const colorMode = React.useMemo(
		() => ({
			toggleColorMode() {
				setMode((previousMode) =>
					previousMode === 'light' ? 'dark' : 'light',
				);
			},
		}),
		[],
	);

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode],
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<MyApp login={setPhoneNumber} userKey={userKey} />
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}
