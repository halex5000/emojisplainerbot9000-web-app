import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import {useTheme, ThemeProvider, createTheme} from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CssBaseline from '@mui/material/CssBaseline';
import Picker from '@emoji-mart/react';
import axios from 'axios';
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';
import Filter8Icon from '@mui/icons-material/Filter8';
import Filter9Icon from '@mui/icons-material/Filter9';

import {
	Card,
	CardMedia,
	CardContent,
	CardHeader,
	CardActions,
	Grid,
	Popover,
	Button,
	ToggleButtonGroup,
	ToggleButton,
	Tooltip,
} from '@mui/material';

const ColorModeContext = React.createContext({toggleColorMode() {}});

function Toggler() {
	const theme = useTheme();
	const colorMode = React.useContext(ColorModeContext);
	return (
		<AppBar
			position="sticky"
			color="inherit"
			sx={{top: 'auto', bottom: 0, width: '100%'}}
		>
			<Toolbar color="inherit">
				<Box
					sx={{
						display: 'flex',
						width: '100%',
						alignItems: 'center',
						justifyContent: 'center',
						bgcolor: 'background.default',
						color: 'text.primary',
						borderRadius: 1,
						p: 3,
					}}
				>
					{theme.palette.mode} mode
					<IconButton
						sx={{ml: 1}}
						color="inherit"
						onClick={colorMode.toggleColorMode}
					>
						{theme.palette.mode === 'dark' ? (
							<Brightness7Icon />
						) : (
							<Brightness4Icon />
						)}
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
}

function MyApp() {
	const [emoji, setEmoji] = React.useState();
	const [pickerOpen, setPickerOpen] = React.useState(false);
	const [emojiTitle, setEmojiTitle] = React.useState();
	const [emojiUsage, setEmojiUsage] = React.useState();

	React.useEffect(() => {
		// Do the thing to get the emoji title and usage here
		async function fetchData() {
			const response = await axios({
				baseURL: import.meta.env.VITE_API_URL,
				url: 'emojisplainer-lookup-bot',
				params: {
					emoji,
				},
			});

			if (response.data) {
				setEmojiTitle(response.data.emojiTitle);
				setEmojiUsage(response.data.emojiUsage);
			}
		}

		fetchData();
	}, [emoji]);

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

	const [segmentId, setSegmentId] = React.useState(0);

	const handleSegmentChange = (event, newSegmentId) => {
		setSegmentId(newSegmentId);
	};

	return (
		<>
			<Popover
				open={pickerOpen}
				id={id}
				anchorOrigin={{
					vertical: 'bottom',
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
					<Typography gutterBottom variant="h4" component="div">
						Please select a value to begin
					</Typography>
					<ToggleButtonGroup
						exclusive
						value={segmentId}
						aria-label="text alignment"
						onChange={handleSegmentChange}
					>
						<ToggleButton value={1}>
							<Filter1Icon />
						</ToggleButton>
						<ToggleButton value={2}>
							<Filter2Icon />
						</ToggleButton>
						<ToggleButton value={3}>
							<Filter3Icon />
						</ToggleButton>
						<ToggleButton value={4}>
							<Filter4Icon />
						</ToggleButton>
						<ToggleButton value={5}>
							<Filter5Icon />
						</ToggleButton>
						<ToggleButton value={6}>
							<Filter6Icon />
						</ToggleButton>
						<ToggleButton value={7}>
							<Filter7Icon />
						</ToggleButton>
						<ToggleButton value={8}>
							<Filter8Icon />
						</ToggleButton>
						<ToggleButton value={9}>
							<Filter9Icon />
						</ToggleButton>
					</ToggleButtonGroup>
					<Card
						centered
						disabled
						sx={{
							width: 1,
						}}
					>
						<CardHeader
							avatar={<Avatar>9K</Avatar>}
							title="EmojiSplainerBot 9000"
						/>
						<CardContent>
							<CardMedia
								component="img"
								Height="200"
								image="/noun-smiley-struck-out-tongue-1735782-E6E6E6.png"
								alt="emojisplainer bot 9000"
							/>
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									EmojiSplainerBot 9000
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Tell me your emoji and I will explain it to you!
								</Typography>
							</CardContent>
						</CardContent>
						<CardActions>
							<Tooltip title="please select a number at the top first">
								<span>
									<Button
										disabled={segmentId === 0}
										variant="contained"
										onClick={openPicker}
									>
										Open Picker
									</Button>
								</span>
							</Tooltip>
						</CardActions>
					</Card>
					<br />
					{emoji ? (
						<Card>
							<CardHeader title={emojiTitle} />
							<CardMedia>
								<Typography gutterBottom variant="h1" component="div">
									{emoji}
								</Typography>
							</CardMedia>
							<CardContent>{emojiUsage}</CardContent>
						</Card>
					) : null}
				</Grid>
			</Grid>
			<Toggler />
		</>
	);
}

export default function ToggleColorMode() {
	const [mode, setMode] = React.useState('light');
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
				<MyApp />
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}
