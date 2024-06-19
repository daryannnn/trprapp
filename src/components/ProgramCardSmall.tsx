import React, {useEffect} from "react";
import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Divider,
    IconButton,
    Typography
} from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import StarIcon from '@mui/icons-material/Star';
import {blue, yellow} from "@mui/material/colors";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Link from "next/link";
import getProgramData from "@/firebase/getProgramData";
import {getAuth} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import {collection, onSnapshot, query, where, setDoc, deleteDoc, doc} from "firebase/firestore";
import {getFirestore} from "@firebase/firestore";
import {getDownloadURL, getStorage, ref} from "@firebase/storage";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

interface Props {
    id: string,
    currentUserId: string,
}

const auth = getAuth(firebase_app);

export default function ProgramCardSmall(props: Props) {
    const [authorId, setAuthorId] = React.useState(null);
    const [generalDescription, setDescription] = React.useState(null);
    const [title, setTitle] = React.useState(null);
    const [goal, setGoal] = React.useState("");
    const [imagesUrls, setImagesUrls] = React.useState<string[]>([]);
    const [authorProfilePhotoUrl, setAuthorProfilePhotoUrl] = React.useState("");
    useEffect(() => {
        async function getProgram() {
            const post = await getProgramData(props.id);
            // @ts-ignore
            setAuthorId(post.result.authorId);
            // @ts-ignore
            setDescription(post.result.generalDescription);
            // @ts-ignore
            setTitle(post.result.title);
            // @ts-ignore
            if (post.result.serviceGoal == "gain") {
                setGoal("Набор мышечной массы")
            } else { // @ts-ignore
                if (post.result.serviceGoal == "keeping") {
                                setGoal("Поддержание формы")
                            } else {
                                setGoal("Похудение")
                            }
            }
            // @ts-ignore
            setImagesUrls(post.result.generalImagesUrls);
            // @ts-ignore
            setAuthorProfilePhotoUrl(post.result.authorProfilePhotoUrl);
        }
        getProgram();
    }, [props])

    const storage = getStorage(firebase_app);
    const [image, setImage] = React.useState<string>("");
    useEffect(() => {
        if (imagesUrls.length > 0) {
            const reference = ref(storage, imagesUrls[0]);
            getDownloadURL(reference).then((url) => {
                setImage(url);
            });
        } else {
            setImage("");
        }
    }, [imagesUrls]);

    const [avatar, setAvatar] = React.useState<string>("");
    useEffect(() => {
        if (authorProfilePhotoUrl.length > 0) {
            const reference = ref(storage, authorProfilePhotoUrl);
            getDownloadURL(reference).then((url) => {
                setAvatar(url)
            });
        } else {
            setAvatar("")
        }
    }, [authorProfilePhotoUrl]);

    const [favorite, setFavorite] = React.useState(false);
    function handleFavorite() {
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Training Programs", props.id, "Training Program UserIds Favs", props.currentUserId), {
            userId: props.currentUserId,
        });
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "User TrainingProgramsIds Favs", props.id), {
            trainingProgramId: props.id,
        });
    }
    function handleUnfavorite() {
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Training Programs", props.id, "Training Program UserIds Favs", props.currentUserId));
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "User TrainingProgramsIds Favs", props.id));
    }

    const qFavs = query(collection(getFirestore(firebase_app), "Training Programs", props.id, "Training Program UserIds Favs"), where("userId", "==", props.currentUserId));
    const isFavs = onSnapshot(qFavs, (querySnapshot) => {
        setFavorite(!querySnapshot.empty);
    });

    return (
        <Card sx={{ maxWidth: 300, margin: "10px auto" }}>
            {
                (image.length > 0) ? (
                    <CardMedia
                        component="img"
                        height="175"
                        image={image}
                        alt="image"
                    />
                ) : (
                    <Avatar sx={{ height: '175px', width: '300px' }} variant="square" >
                        <InsertPhotoIcon sx={{ fontSize: 160, color: "primary.light" }} />
                    </Avatar>
                )
            }
            <CardHeader
                avatar={
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/profile/${authorId}`}>
                        {
                            (avatar.length > 0) ? (
                                <Avatar variant="rounded" src={avatar}>
                                    <AccountBoxIcon />
                                </Avatar>
                            ) : (
                                <Avatar sx={{ bgcolor: "primary.main" }} variant="rounded">
                                    <AccountBoxIcon />
                                </Avatar>
                            )
                        }
                    </Link>
                }
                title={
                    <Typography >{title}</Typography>
                }
                subheader={
                    <Box>
                        <Box display={"flex"} justifyContent={"start"}>
                            <CurrencyRubleIcon sx={{height: "20px"}}/>
                            <Typography variant={"body2"} color={"text.secondary"}>Бесплатно</Typography>
                        </Box>
                    </Box>
                }
                action = {
                    <Link href={`/program/${props.id}`}>
                        <IconButton sx={{ color: "primary" }}>
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Link>
                }
            />
            <Divider />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {generalDescription}
                </Typography>
            </CardContent>
            <Divider />
            <CardActions >
                <Box sx={{ flexGrow: 2 }} />
                <Box sx={{ margin: "0 5px", padding: "2px 5px", borderRadius: 2, bgcolor: "primary.light" }}>
                    {goal}
                </Box>
                <Box sx={{ flexGrow: 1 }}/>
                <div>
                    {
                        favorite ? (
                            <IconButton onClick={handleUnfavorite} sx={{ color: "yellow" }}>
                                <StarIcon />
                            </IconButton>
                        ) : (
                            <IconButton onClick={handleFavorite} >
                                <StarIcon />
                            </IconButton>
                        )
                    }
                </div>
            </CardActions>
        </Card>
    );
}