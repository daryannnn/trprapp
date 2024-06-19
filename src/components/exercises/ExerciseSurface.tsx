import {Box, Dialog, DialogContent, Grid, Paper, ThemeProvider} from "@mui/material";
import {blue} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import Link from "next/link";
import getExerciseData from "@/firebase/getExerciseData";
import getProgramData from "@/firebase/getProgramData";
import {getDownloadURL, getStorage, ref, StorageReference} from "@firebase/storage";
import firebase_app from "@/firebase/config";
import {theme} from "@/utils/theme";

interface Props {
    programId: string,
    exerciseId: string,
}

export default function ExerciseSurface(props: Props) {
    const [name, setName] = React.useState(null);
    const [setsNumber, setSetsNumber] = React.useState(0);
    const [repsNumber, setRepsNumber] = React.useState(0);
    const [regularity, setRegularity] = React.useState('');
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [photoUrlsArr, setPhotoUrlsArr] = React.useState<string[]>([]);
    useEffect(() => {
        async function getExercise() {
            const post = await getExerciseData(props.programId, props.exerciseId)
            // @ts-ignore
            setName(post.result.name);
            // @ts-ignore
            setSetsNumber(post.result.setsNumber);
            // @ts-ignore
            switch (post.result.regularity) {
                case "every_day":
                    setRegularity("Каждый день");
                    break;
                case "every_two_days":
                    setRegularity("Через день");
                    break;
                case "three_days_week":
                    setRegularity("Три раза в неделю");
                    break;
                case "two_days_week":
                    setRegularity("Два раза в неделю");
                    break;
                case "one_day_week":
                    setRegularity("Раз в неделю");
                    break;
            }
            // @ts-ignore
            setRepsNumber(post.result.repsNumber);
            // @ts-ignore
            setDescription(post.result.description);
            // @ts-ignore
            setPhotoUrlsArr(post.result.imagesUrls);
        }
        async function getProgram() {
            const post = await getProgramData(props.programId);
            // @ts-ignore
            setTitle(post.result.title);
        }

        getProgram();
        getExercise();
    }, [props])

    // @ts-ignore
    let photos = [];
    const [p, setP] = React.useState(null);
    const storage = getStorage(firebase_app);
    const [images, setImages] = React.useState<string[]>([]);
    useEffect(() => {
        let imagesArr: string[] = [];
        async function getImages(reference: StorageReference) {
            await getDownloadURL(reference).then((url) => {
                imagesArr.push(url);
            });
            return imagesArr;
        }

        if (photoUrlsArr.length > 0) {
            setImages([])
            photoUrlsArr.map((url) => {
                const reference = ref(storage, url);
                getImages(reference).then((i) => {
                    if (photoUrlsArr.length == i.length) {
                        setImages(i)
                    }
                });
            })
        }
    }, [photoUrlsArr]);

    useEffect(() => {
        photos = [];
        if (images.length > 0) {
            // @ts-ignore
            images.map((photoUrl) => {
                photos.push(
                    <Grid item xs={12} sm={6} lg={4}>
                        <CardMedia
                            component="img"
                            height="200"
                            sx={{ maxWidth: 250, borderRadius: 2, margin: "10px"}}
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
    }, [images]);

    const [openImage, setOpenImage] = React.useState(false);
    const [imageOpened, setImageOpened] = React.useState("");
    const handleClickOpenImage = (image: string) => {
        setImageOpened(image);
        setOpenImage(true);
    };
    const handleCloseImage = () => {
        setOpenImage(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Paper sx={{ maxWidth: "60vw", margin: "10px auto", padding: "0 0 10px 0", bgcolor: "primary.light" }}>
                <Box sx={{ flexDirection: 'row', bgcolor: "primary.main", display: 'flex', justifyContent: 'space-between', padding: "10px", margin: "0 0 10px 0", borderRadius: 1}}>
                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                        <SportsMmaIcon sx={{margin: "5px 10px 0 0", color: "primary.dark"}} />
                        <Link style={{ textDecoration: 'none' }} href={`/program/${props.programId}`}>
                            <Typography display="inline" variant="h6">{title}</Typography>
                        </Link>
                        <Typography display="inline" variant="h6"> &nbsp; - &nbsp; </Typography>
                        <Typography display="inline" variant="h6">{name}</Typography>
                    </Box>
                </Box>
                <Box sx={{ maxWidth: "40vw", minWidth: 250, flexDirection: 'row', bgcolor: "primary.main", display: 'flex', justifyContent: 'space-between', padding: "10px 40px 10px 40px", borderRadius: 1, margin: "5px auto"}}>
                    <Box sx={{display: "flex", alignItems: 'center', flexDirection: 'column', margin: "auto 10px"}}>
                        <Typography variant="body2">Число повторений</Typography>
                        <Typography variant={"h5"}>{repsNumber}</Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: 'center', flexDirection: 'column', margin: "auto 5px"}}>
                        <Typography variant="body2">Число подходов</Typography>
                        <Typography variant={"h5"}>{setsNumber}</Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: 'center', flexDirection: 'column', margin: "auto 10px"}}>
                        <Typography variant="body2">Регулярность</Typography>
                        <Typography variant={"h5"}>{regularity}</Typography>
                    </Box>
                </Box>
                <Card sx={{ maxWidth: "50vw", margin: "10px auto", padding: "5px" }}>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary">
                            {description}
                        </Typography>
                    </CardContent>

                    <Grid sx={{padding: "0 20px 0 0"}} container spacing={1} >
                        {p}
                    </Grid>

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
            </Paper>
        </ThemeProvider>
    );
}