import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {blue, yellow} from '@mui/material/colors';
import StarIcon from '@mui/icons-material/Star';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {Box, Collapse, Dialog, DialogContent, Grid} from "@mui/material";
import CurrencyRubleIcon from "@mui/icons-material/CurrencyRuble";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import {getAuth} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import {useEffect} from "react";
import getProgramData from "@/firebase/getProgramData";
import {collection, deleteDoc, doc, onSnapshot, query, setDoc, where} from "firebase/firestore";
import {getFirestore} from "@firebase/firestore";
import {getDownloadURL, getStorage, ref, StorageReference} from "@firebase/storage";
import Link from "next/link";

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

const auth = getAuth(firebase_app);

export default function ProgramCard(props: Props) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [authorId, setAuthorId] = React.useState(null);
    const [authorName, setAuthorName] = React.useState(null);
    const [generalDescription, setDescription] = React.useState(null);
    const [goal, setGoal] = React.useState("");
    const [detailedDescription, setDetailedDescription] = React.useState(null);
    const [generalPhotoUrlsArr, setGeneralPhotoUrlsArr] = React.useState<string[]>([]);
    const [detailedPhotoUrlsArr, setDetailedPhotoUrlsArr] = React.useState<string[]>([]);
    const [authorProfilePhotoUrl, setAuthorProfilePhotoUrl] = React.useState("");
    useEffect(() => {
        async function getProgram() {
            const post = await getProgramData(props.id);
            // @ts-ignore
            setAuthorId(post.result.authorId);
            // @ts-ignore
            setDescription(post.result.generalDescription);
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
            setAuthorName(post.result.authorName);
            // @ts-ignore
            setDetailedDescription(post.result.detailedDescription);
            // @ts-ignore
            setGeneralPhotoUrlsArr(post.result.generalImagesUrls);
            // @ts-ignore
            setDetailedPhotoUrlsArr(post.result.detailedImagesUrls);
            // @ts-ignore
            setAuthorProfilePhotoUrl(post.result.authorProfilePhotoUrl);
        }
        getProgram();
    }, [])

    // @ts-ignore
    let photos = [];
    const [p, setP] = React.useState(null);
    const [pDetailed, setPDetailed] = React.useState(null);

    const storage = getStorage(firebase_app);

    const [generalImages, setGeneralImages] = React.useState<string[]>([]);
    const [detailedImages, setDetailedImages] = React.useState<string[]>([]);

    useEffect(() => {
        let imagesArr: string[] = [];
        async function getImages(reference: StorageReference) {
            await getDownloadURL(reference).then((url) => {
                imagesArr.push(url);
            });
            return imagesArr;
        }

        if (generalPhotoUrlsArr.length > 0) {
            setGeneralImages([])
            generalPhotoUrlsArr.map((url) => {
                const reference = ref(storage, url);
                getImages(reference).then((i) => {
                    if (generalPhotoUrlsArr.length == i.length) {
                        setGeneralImages(i)
                    }
                });
            })
        }
    }, [generalPhotoUrlsArr]);

    useEffect(() => {
        let imagesArr2: string[] = [];
        async function getImages(reference: StorageReference) {
            await getDownloadURL(reference).then((url) => {
                imagesArr2.push(url);
            });
            return imagesArr2;
        }

        if (detailedPhotoUrlsArr.length > 0) {
            setDetailedImages([])
            //imagesArr = [];
            detailedPhotoUrlsArr.map((url) => {
                const reference = ref(storage, url);
                getImages(reference).then((i) => {
                    if (detailedPhotoUrlsArr.length == i.length) {
                        setDetailedImages(i)
                    }
                });
            })
        }
    }, [detailedPhotoUrlsArr]);

    useEffect(() => {
        photos = [];
        console.log(generalImages)
        if (generalImages.length > 0) {
            generalImages.map((photoUrl) => {
                photos.push(
                    <Grid item xs={12} sm={6} lg={4}>
                        <CardMedia
                            component="img"
                            height="200"
                            sx={{ maxWidth: 250, borderRadius: 2, margin: "0 5px"}}
                            image={photoUrl}
                            alt="program image"
                            onClick={() => handleClickOpenImage(photoUrl)}
                        />
                    </Grid>
                );
                // @ts-ignore
                setP(photos);
            })
        }
    }, [generalImages]);

    useEffect(() => {
        photos = [];
        if (detailedImages.length > 0) {
            detailedImages.map((photoUrl) => {
                photos.push(
                    <Grid item xs={12} sm={6} lg={4}>
                        <CardMedia
                            component="img"
                            height="200"
                            sx={{ maxWidth: 250, borderRadius: 2, margin: "0 5px"}}
                            image={photoUrl}
                            alt="program image"
                            onClick={() => handleClickOpenImage(photoUrl)}
                        />
                    </Grid>
                );
                // @ts-ignore
                setPDetailed(photos);
            })
        }
    }, [detailedImages]);

    const [avatar, setAvatar] = React.useState<string>("");
    useEffect(() => {
        if (authorProfilePhotoUrl.length > 0) {
            const reference = ref(storage, authorProfilePhotoUrl);
            getDownloadURL(reference).then((url) => {
                setAvatar(url)
            });
        }
    }, [authorProfilePhotoUrl]);

    const [openImage, setOpenImage] = React.useState(false);
    const [imageOpened, setImageOpened] = React.useState("");
    const handleClickOpenImage = (image: string) => {
        setImageOpened(image);
        setOpenImage(true);
    };
    const handleCloseImage = () => {
        setOpenImage(false);
    };

    const [own, setOwn] = React.useState(authorId == props.currentUserId);
    useEffect(() => {
        (authorId == props.currentUserId) ? setOwn(true) : setOwn(false)
    }, [authorId]);

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

    const [acquired, setAcquired] = React.useState(false);
    const qAcquired = query(collection(getFirestore(firebase_app), "Training Programs", props.id, "Training Program UserIds Acquired"), where("userId", "==", props.currentUserId));
    const isAcquired = onSnapshot(qAcquired, (querySnapshot) => {
        setAcquired(!querySnapshot.empty);
    });

    return (
        <Card sx={{ maxWidth: "50vw", margin: "10px auto"}}>
            <CardHeader
                avatar={
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/profile/${authorId}`}>
                        {
                            (avatar.length > 0) ? (
                                <Avatar variant="rounded" src={avatar}>
                                    <AccountBoxIcon />
                                </Avatar>
                            ) : (
                                <Avatar sx={{ bgcolor: "primary.dark" }} variant="rounded">
                                    <AccountBoxIcon />
                                </Avatar>
                            )
                        }
                    </Link>
                }
                action={
                    <Box display={"flex"} justifyContent={"start"} alignContent={"center"}>
                        <CurrencyRubleIcon sx={{height: "18px", color: "text.secondary"}}/>
                        <Typography variant={"body2"} color={"text.secondary"}>Бесплатно</Typography>
                    </Box>
                }
                title={
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/profile/${authorId}`}>
                        <Typography color={"primary.dark"}>{authorName}</Typography>
                    </Link>
                }
            />
            <CardContent>
                <Typography variant="body1" color="text.secondary">
                    {generalDescription}
                </Typography>
            </CardContent>

            <Grid sx={{padding: "0 10px 0 0"}} container spacing={1} >
                {p}
            </Grid>

            <CardActions >
                <div>
                    {
                        favorite ? (
                            <IconButton onClick={handleUnfavorite} aria-label="like" sx={{ color: "yellow" }}>
                                <StarIcon />
                            </IconButton>
                        ) : (
                            <IconButton onClick={handleFavorite} aria-label="like">
                                <StarIcon />
                            </IconButton>
                        )
                    }
                </div>
                <Box flexGrow={1}></Box>
                <Box sx={{ margin: "0 5px", padding: "2px 5px", borderRadius: 2, bgcolor: yellow[100] }}>
                    {goal}
                </Box>
                <Box flexGrow={1}></Box>
                <div>
                    {
                        (acquired || own) ? (
                            <div>
                                <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded}>
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </div>
                        ) : (
                            <div></div>
                        )
                    }
                </div>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>
                        {detailedDescription}
                    </Typography>
                    <Grid container spacing={1} >
                        {pDetailed}
                    </Grid>
                </CardContent>
            </Collapse>

            <Dialog
                open={openImage}
                onClose={handleCloseImage}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "80vw",
                        },
                    },
                }}
            >
                <DialogContent sx={{justifyContent: "center"}}>
                    <img
                        src={imageOpened}
                        loading="lazy"
                        style={{borderRadius:'10px', maxWidth: "70vw", margin: "0 auto"}}
                    />
                </DialogContent>
            </Dialog>

        </Card>
    );
}