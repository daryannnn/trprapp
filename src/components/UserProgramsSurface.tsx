import {
    Box, Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, Grid, InputLabel, MenuItem, OutlinedInput,
    Paper, Select, SelectChangeEvent,
    TextField, ThemeProvider
} from "@mui/material";
import {blue} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import AddIcon from '@mui/icons-material/Add';
import ProgramCardSmall from "@/components/ProgramCardSmall";
import {getAuth} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import {doc, getDoc, getFirestore} from "@firebase/firestore";
import {addProgram} from "@/firebase/addProgram";
import UserPrograms from "@/components/UserPrograms";
import Link from "next/link";
import {theme} from "@/utils/theme";

const auth = getAuth(firebase_app);

interface Props {
    id: string,
    currentUserId: string,
    currentUserName: string,
}

export default function UserProgramsSurface(props: Props) {
    const [own, setOwn] = React.useState(props.id == props.currentUserId);

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setGeneralImages(null);
        setDetailedImages(null);
    };

    const [serviceType, setServiceType] = React.useState('training-program');
    const handleServiceType = (event: SelectChangeEvent) => {
        setServiceType(event.target.value as string);
    };

    const [serviceGoal, setServiceGoal] = React.useState('');
    const handleServiceGoal = (event: SelectChangeEvent) => {
        setServiceGoal(event.target.value as string);
    };

    const [rusType, setRusType] = React.useState("");
    const [name, setName] = React.useState();
    const [organizerProfilePhotoUrl, setOrganizerProfilePhotoUrl] = React.useState("");
    useEffect(() => {
        async function getType() {
            const docRef = doc(getFirestore(firebase_app), "Users", props.id);
            const docSnap = await getDoc(docRef);
            (docSnap.get("userType") == "organization") ? (setRusType("организации")) : (setRusType("пользователя"))
        }
        async function getName() {
            const docRef = doc(getFirestore(firebase_app), "Users", props.id);
            const docSnap = await getDoc(docRef);
            setName(docSnap.get("name"))
            setOrganizerProfilePhotoUrl(docSnap.get("profilePhotoUrl"))
        }
        getType();
        getName();
    }, [props]);

    const [title, setTitle] = React.useState("");
    const [generalDescription, setGeneralDescription] = React.useState("");
    const [detailedDescription, setDetailedDescription] = React.useState("");
    const [type, setType] = React.useState();
    useEffect(() => {
        async function getType() {
            const docRef = doc(getFirestore(firebase_app), "Users", props.currentUserId);
            const docSnap = await getDoc(docRef);
            setType(docSnap.get("userType"))
        }
        getType();
    }, [props]);

    const [generalImages, setGeneralImages] = React.useState<File[] | null>(null);
    const [detailedImages, setDetailedImages] = React.useState<File[] | null>(null);
    const handleGeneralFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // @ts-ignore
            if (((e.target.files.length + generalImages?.length) > 10) || (e.target.files.length > 10)) {
                alert("Вы можете выбрать до 10 изображений")
            } else {
                setGeneralImages(Array.from(e.target.files));
            }
        }
    };
    const handleDetailedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // @ts-ignore
            if (((e.target.files.length + detailedImages?.length) > 10) || (e.target.files.length > 10)) {
                alert("Вы можете выбрать до 10 изображений")
            } else {
                setDetailedImages(Array.from(e.target.files));
            }
        }
    };

    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        // @ts-ignore
        await addProgram(title, props.currentUserId, props.currentUserName, type, organizerProfilePhotoUrl, generalDescription, detailedDescription, serviceGoal, generalImages, detailedImages).then(() => {
            handleClose();
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <Paper sx={{ maxWidth: 800, margin: "10px auto", padding: "0 0 10px 0", bgcolor: "primary.light"}}>
                <Box sx={{ flexDirection: 'row', bgcolor: "primary.main", display: 'flex', justifyContent: 'space-between', padding: "10px", margin: "0 0 10px 0", borderRadius: 1}}>
                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                        <SportsMmaIcon sx={{margin: "5px 10px 0 0", color: "primary.dark"}}/>
                        <Typography display="inline" variant="h6">Услуги&nbsp;</Typography>
                        <Typography display="inline" variant="h6">{rusType}&nbsp;</Typography>
                        <Link style={{ textDecoration: 'none' }} href={`/profile/${props.id}`}>
                            <Typography display="inline" variant="h6">{name}</Typography>
                        </Link>
                    </Box>
                    <div>
                        {
                            own ? (
                                <Button onClick={handleClickOpen} variant="contained" sx={{bgcolor: "#2E7D32"}}>
                                    <AddIcon sx={{color: "white"}}/>
                                    <Typography sx={{color: "white"}} variant="button">услуга</Typography>
                                </Button>) : (
                                <div>
                                </div>
                            )
                        }
                    </div>
                </Box>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Новая услуга</DialogTitle>
                    <form onSubmit={handleForm}>
                        <DialogContent>
                            <FormControl fullWidth>
                                <InputLabel>Вид услуги</InputLabel>
                                <Select
                                    value={serviceType}
                                    label="Вид услуги"
                                    onChange={handleServiceType}
                                    defaultValue={"training-program"}
                                >
                                    <MenuItem value={"training-program"}>Тренировочная программа</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Название программы"
                                variant="outlined"
                                fullWidth
                                margin={"normal"}
                                required
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Цель услуги *</InputLabel>
                                <Select
                                    value={serviceGoal}
                                    label="Цель услуги *"
                                    onChange={handleServiceGoal}
                                    required
                                >
                                    <MenuItem value={"gain"}>Набор мышечной массы</MenuItem>
                                    <MenuItem value={"loss"}>Похудение</MenuItem>
                                    <MenuItem value={"keeping"}>Поддержание формы</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                defaultValue="Бесплатно"
                                label="Стоимость"
                                variant="outlined"
                                fullWidth
                                margin={"normal"}
                                disabled
                            />
                            <TextField
                                label="Описание"
                                variant="outlined"
                                fullWidth
                                margin={"normal"}
                                multiline
                                required
                                onChange={(e) => setGeneralDescription(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                component="label"
                                sx={{margin: "10px 0 0 0"}}
                            >
                                Добавить фото (до 10)
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleGeneralFileChange}
                                    multiple
                                />
                            </Button>
                            <div>
                                {
                                    (generalImages && generalImages.length > 0) ? (
                                        <>
                                            {
                                                generalImages.map((image) => (
                                                    <Typography key={image.name}>{image.name}</Typography>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <div>
                                        </div>
                                    )
                                }
                            </div>
                            <DialogContentText>Детальная информация для пользователей, которые приобретут услугу</DialogContentText>
                            <TextField
                                label="Дополнительное описание"
                                variant="outlined"
                                fullWidth
                                margin={"normal"}
                                multiline
                                required
                                onChange={(e) => setDetailedDescription(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                component="label"
                                sx={{margin: "10px 0 0 0"}}
                            >
                                Добавить фото (до 10)
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleDetailedFileChange}
                                    multiple
                                />
                            </Button>
                            <div>
                                {
                                    (detailedImages && detailedImages.length > 0) ? (
                                        <>
                                            {
                                                detailedImages.map((image) => (
                                                    <Typography key={image.name}>{image.name}</Typography>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <div>
                                        </div>
                                    )
                                }
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button sx={{color: "primary.dark"}} onClick={handleClose}>Отмена</Button>
                            <Button sx={{color: "primary.dark"}} type="submit">Добавить</Button>
                        </DialogActions>
                    </form>
                </Dialog>

                <UserPrograms id={props.id} currentUserId={props.currentUserId} />

            </Paper>
        </ThemeProvider>
    );
}