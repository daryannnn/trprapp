import {
    Box,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField, ThemeProvider
} from "@mui/material";
import {blue} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React, {useEffect} from "react";
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import CheckIcon from '@mui/icons-material/Check';
import ProgramCard from "@/components/ProgramCard";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {IconButtonProps} from "@mui/material/IconButton";
import {styled} from "@mui/material/styles";
import {collection, deleteDoc, doc, increment, onSnapshot, query, setDoc, updateDoc, where} from "firebase/firestore";
import {getFirestore} from "@firebase/firestore";
import firebase_app from "@/firebase/config";
import getProgramData from "@/firebase/getProgramData";
import Link from "next/link";
import {addExercise} from "@/firebase/addExercise";
import ExerciseList from "@/components/exercises/ExerciseList";
import {theme} from "@/utils/theme";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

interface Props {
    id: string,
    currentUserId: string,
}

export default function ProgramSurface(props: Props) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [openEx, setOpenEx] = React.useState(false);
    const handleClickOpenEx = () => {
        setOpenEx(true);
    };
    const handleCloseEx = () => {
        setOpenEx(false);
        setImages(null);
    };

    const [authorId, setAuthorId] = React.useState(null);
    const [title, setTitle] = React.useState(null);
    const [acquiredCount, setAcquiredCount] = React.useState(null);
    const [reviewsCount, setReviewsCount] = React.useState(null);
    const [rating, setRating] = React.useState(null);
    useEffect(() => {
        async function getProgram() {
            const post = await getProgramData(props.id);
            // @ts-ignore
            setAuthorId(post.result.authorId);
            // @ts-ignore
            setTitle(post.result.title);
            // @ts-ignore
            setAcquiredCount(post.result.acquiredCount);
            // @ts-ignore
            setReviewsCount(post.result.reviewsCount);
            // @ts-ignore
            setRating(post.result.rating);
        }
        getProgram();
    }, [])

    const [own, setOwn] = React.useState(authorId == props.currentUserId);
    useEffect(() => {
        (authorId == props.currentUserId) ? setOwn(true) : setOwn(false)
    }, [authorId]);

    const [acquired, setAcquired] = React.useState(false);
    function handleAcquire() {
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Training Programs", props.id, "Training Program UserIds Acquired", props.currentUserId), {
            userId: props.currentUserId,
        });
        updateDoc(doc(getFirestore(firebase_app), "Training Programs", props.id), {
            acquiredCount: increment(1),
        });
        // @ts-ignore
        setAcquiredCount(acquiredCount+1)
    }
    function handleUnacquire() {
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Training Programs", props.id, "Training Program UserIds Acquired", props.currentUserId));
        updateDoc(doc(getFirestore(firebase_app), "Training Programs", props.id), {
            acquiredCount: increment(-1),
        });
        // @ts-ignore
        setAcquiredCount(acquiredCount-1)
    }

    const qAcquired = query(collection(getFirestore(firebase_app), "Training Programs", props.id, "Training Program UserIds Acquired"), where("userId", "==", props.currentUserId));
    const isAcquired = onSnapshot(qAcquired, (querySnapshot) => {
        setAcquired(!querySnapshot.empty);
    });

    const [images, setImages] = React.useState<File[] | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // @ts-ignore
            if (((e.target.files.length + images?.length) > 10) || (e.target.files.length > 10)) {
                alert("Вы можете выбрать до 10 изображений")
            } else {
                setImages(Array.from(e.target.files));
            }
        }
    };

    const [regularity, setRegularity] = React.useState('');
    const handleRegularity = (event: SelectChangeEvent) => {
        setRegularity(event.target.value as string);
    };
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [setsNumber, setSetsNumber] = React.useState('');
    const [repsNumber, setRepsNumber] = React.useState('');
    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        await addExercise(props.id, name, description, Number(setsNumber), Number(repsNumber), regularity, images).then(() => {
            handleCloseEx();
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <Paper sx={{ maxWidth: "60vw", margin: "10px auto", padding: "0 0 10px 0", bgcolor: "primary.light", justifyContent: 'center' }}>
                <Box sx={{ flexDirection: 'row', bgcolor: "primary.main", display: 'flex', justifyContent: 'space-between', padding: "10px", margin: "0 0 10px 0", borderRadius: 1}}>
                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                        <SportsMmaIcon sx={{margin: "5px 10px 0 0", color: "primary.dark"}}/>
                        <Typography display="inline" variant="h6">{title}</Typography>
                    </Box>
                    <div>
                        {
                            own ? (
                                <div></div>
                            ) : (
                            acquired ?
                                ( <Button sx={{bgcolor: "#2E7D32"}} variant="contained" onClick={handleUnacquire}>
                                    <CheckIcon sx={{color: "white"}} />
                                    <Typography sx={{color: "white"}} variant="button">приобретена</Typography>
                                </Button> ) :
                                ( <Button sx={{bgcolor: "#2E7D32"}} variant="contained" onClick={handleAcquire}>
                                    <AddIcon sx={{color: "white"}} />
                                    <Typography sx={{color: "white"}} variant="button">приобрести</Typography>
                                </Button> )
                            )
                        }
                    </div>
                </Box>
                <Box sx={{ maxWidth: "40vw", flexDirection: 'row', bgcolor: "primary.main", display: 'flex', justifyContent: 'space-between', padding: "10px 40px 10px 40px", borderRadius: 1, margin: "5px auto"}}>
                    <Box sx={{display: "flex", alignItems: 'center', flexDirection: 'column', margin: "auto 10px"}}>
                        <Typography variant="body2">Приобретений</Typography>
                        <Typography variant={"h5"}>{acquiredCount}</Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: 'center', flexDirection: 'column', margin: "auto 10px"}}>
                        <Typography variant="body2">Отзывов</Typography>
                        <Typography variant={"h5"}>{reviewsCount}</Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: 'center', flexDirection: 'column', margin: "auto 10px"}}>
                        <Typography variant="body2">Рейтинг</Typography>
                        <Typography variant={"h5"}>{rating}</Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: 'center'}}>
                        <Link href={`/program/${props.id}/reviews`}>
                            <NavigateNextIcon />
                        </Link>
                    </Box>
                </Box>

                <ProgramCard id={props.id} currentUserId={props.currentUserId} />

                <div>
                    {
                        (acquired || own) ?
                            (<div>
                                <Box sx={{ maxWidth: "40vw", flexDirection: 'row', bgcolor: "primary.main", display: 'flex', justifyContent: 'center', padding: "10px 40px 10px 40px", borderRadius: 1, margin: "5px auto", alignItems: "center"}}>
                                    <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded}>
                                        <ExpandMoreIcon />
                                    </ExpandMore>
                                    <Box flexGrow={1}></Box>
                                    <Typography variant={"h6"} display={"inline"}>Упражнения</Typography>
                                    <Box flexGrow={1}></Box>
                                    <div>
                                        {
                                            own ? (
                                                <Button onClick={handleClickOpenEx} variant="contained">
                                                    <AddIcon />
                                                    <Typography variant="button">упражнение</Typography>
                                                </Button>) : (
                                                <div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </Box>
                            </div>) :
                            ( <div></div> )
                    }
                </div>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <ExerciseList id={props.id} />
                </Collapse>

                <Dialog open={openEx} onClose={handleCloseEx}>
                    <DialogTitle>Новое упражнение</DialogTitle>
                    <form onSubmit={handleForm}>
                        <DialogContent>
                            <TextField
                                label="Название"
                                variant="outlined"
                                fullWidth
                                margin={"normal"}
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                label="Описание"
                                variant="outlined"
                                fullWidth
                                margin={"normal"}
                                multiline
                                required
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <TextField
                                type={"number"}
                                label="Число повторений"
                                variant="outlined"
                                fullWidth
                                margin={"normal"}
                                required
                                onChange={(e) => setRepsNumber(e.target.value)}
                            />
                            <TextField
                                type={"number"}
                                label="Число подходов"
                                variant="outlined"
                                fullWidth
                                margin={"normal"}
                                required
                                onChange={(e) => setSetsNumber(e.target.value)}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Регулярность *</InputLabel>
                                <Select
                                    value={regularity}
                                    label="Регулярность *"
                                    required
                                    onChange={handleRegularity}
                                >
                                    <MenuItem value={"every_day"}>Каждый день</MenuItem>
                                    <MenuItem value={"every_two_days"}>Через день</MenuItem>
                                    <MenuItem value={"three_days_week"}>Три раза в неделю</MenuItem>
                                    <MenuItem value={"two_days_week"}>Два раза в неделю</MenuItem>
                                    <MenuItem value={"one_day_week"}>Раз в неделю</MenuItem>
                                </Select>
                            </FormControl>
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
                                    onChange={handleFileChange}
                                    multiple
                                />
                            </Button>
                            <div>
                                {
                                    (images && images.length > 0) ? (
                                        <>
                                            {
                                                images.map((image) => (
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
                            <Button onClick={handleCloseEx}>Отмена</Button>
                            <Button type="submit">Добавить</Button>
                        </DialogActions>
                    </form>
                </Dialog>

            </Paper>
        </ThemeProvider>
    );
}