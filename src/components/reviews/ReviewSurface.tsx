import {Box, Button, Paper, Rating} from "@mui/material";
import {blue} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React, {useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import {getAuth} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import getProgramData from "@/firebase/getProgramData";
import Link from "next/link";
import {addReview} from "@/firebase/addReview";
import {doc, getDoc, getFirestore} from "@firebase/firestore";
import ProgramReviews from "@/components/reviews/ProgramReviews";

const auth = getAuth(firebase_app);

interface Props {
    programId: string,
    currentUserId: string,
    currentUserName: string,
}

export default function ReviewSurface(props: Props) {
    //const currentUser = auth.currentUser;

    const [authorId, setAuthorId] = React.useState(null);
    const [programTitle, setProgramTitle] = React.useState(null);
    const [reviewsCount, setReviewsCount] = React.useState(null);
    const [rating, setRating] = React.useState(null);
    const [authorProfilePhotoUrl, setAuthorProfilePhotoUrl] = React.useState("");
    useEffect(() => {
        async function getProgram() {
            const post = await getProgramData(props.programId);
            // @ts-ignore
            setAuthorId(post.result.authorId);
            // @ts-ignore
            setProgramTitle(post.result.title);
            // @ts-ignore
            setReviewsCount(post.result.reviewsCount);
            // @ts-ignore
            setRating(post.result.rating);
            // @ts-ignore
            setAuthorProfilePhotoUrl(post.result.authorProfilePhotoUrl);
        }
        getProgram();
    }, [])

    const [own, setOwn] = React.useState(authorId == props.currentUserId);
    useEffect(() => {
        (authorId == props.currentUserId) ? setOwn(true) : setOwn(false)
    }, [authorId]);

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [type, setType] = React.useState();
    useEffect(() => {
        async function getType() {
            const docRef = doc(getFirestore(firebase_app), "Users", props.currentUserId);
            const docSnap = await getDoc(docRef);
            setType(docSnap.get("userType"))
        }
        getType();
    }, []);

    const [rate, setRate] = React.useState<number | null>(0);
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        // @ts-ignore
        await addReview(props.currentUserId, props.currentUserName, type, authorProfilePhotoUrl, title, text, rate, props.programId, rating, reviewsCount);
        setRate(0);
        handleClose();
    }

    return (
        <Paper sx={{ maxWidth: 800, margin: "10px auto", padding: "0 0 10px 0", bgcolor: blue[200] }}>
            <Box sx={{ flexDirection: 'row', bgcolor: blue[300], display: 'flex', justifyContent: 'space-between', padding: "10px", margin: "0 0 10px 0", borderRadius: 1}}>
                <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                    <VisibilityIcon sx={{margin: "5px 10px 0 0"}} color={"primary"}/>
                    <Typography display="inline" variant="h6">Отзывы на программу: &nbsp; </Typography>
                    <Link style={{ textDecoration: 'none' }} href={`/program/${props.programId}`}>
                        <Typography display="inline" variant="h6">{programTitle}</Typography>
                    </Link>
                </Box>
                <div>
                    {
                        own ? (
                            <div></div>
                        ) : (
                            <Button onClick={handleClickOpen} variant="contained">
                                <AddIcon />
                                <Typography variant="button">ОТЗЫВ</Typography>
                            </Button>
                        )
                    }
                </div>
            </Box>
                <Box sx={{ maxWidth: 200, flexDirection: 'row', bgcolor: blue[300], display: 'flex', justifyContent: 'space-between', padding: "10px 40px 10px 40px", borderRadius: 1, margin: "5px auto"}}>
                    <Box sx={{justifyContent: "center"}}>
                        <Typography variant="h3">{rating}</Typography>
                        <Typography color="text.secondary">из 5</Typography>
                    </Box>
                    <Box sx={{padding: "25px 0px 10px 0px"}}>
                        <Rating value={rating} precision={0.5} readOnly />
                        <Typography variant="h6">{reviewsCount} отзыва</Typography>
                    </Box>
                </Box>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <form onSubmit={handleForm}>
                    <DialogTitle>Новый отзыв</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ваша оценка: *
                        </DialogContentText>
                        <Rating
                            value={rate}
                            onChange={(event, newValue) => {
                                setRate(newValue);
                            }}
                        />
                        <TextField
                            label="Заголовок"
                            variant="outlined"
                            fullWidth
                            margin={"normal"}
                            required
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label="Текст отзыва"
                            variant="outlined"
                            fullWidth
                            margin={"normal"}
                            multiline
                            required
                            onChange={(e) => setText(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Отмена</Button>
                        <div>
                            {
                                (rate == 0) ? (
                                    <Button disabled type="submit">Добавить</Button>
                                ) : (
                                    <Button type="submit">Добавить</Button>
                                )
                            }
                        </div>
                    </DialogActions>
                </form>
            </Dialog>

            <ProgramReviews id={props.programId} />

        </Paper>
    );
}