import * as React from 'react';
import {useEffect} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {blue} from '@mui/material/colors';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {Rating} from '@mui/material';
import getReviewData from "@/firebase/getReviewData";
import {getDownloadURL, getStorage, ref} from "@firebase/storage";
import firebase_app from "@/firebase/config";
import Link from "next/link";

interface Props {
    id: string,
}

export default function Review(props: Props) {
    const [rate, setRate] = React.useState<number | null>(0);
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const [authorId, setAuthorId] = React.useState('');
    const [authorName, setAuthorName] = React.useState('');
    const [dateCreated, setDateCreated] = React.useState(null);
    const [authorProfilePhotoUrl, setAuthorProfilePhotoUrl] = React.useState("");
    useEffect(() => {
        async function getReview() {
            const post = await getReviewData(props.id);
            // @ts-ignore
            setRate(post.result.rating);
            // @ts-ignore
            setTitle(post.result.title);
            // @ts-ignore
            setText(post.result.text);
            // @ts-ignore
            setAuthorName(post.result.authorName);
            // @ts-ignore
            setAuthorId(post.result.authorId);
            // @ts-ignore
            setDateCreated(post.result.dateCreated.toDate().toLocaleDateString());
            // @ts-ignore
            setAuthorProfilePhotoUrl(post.result.authorProfilePhotoUrl);
        }
        getReview();
    }, [])

    const storage = getStorage(firebase_app);
    const [avatar, setAvatar] = React.useState<string>("");
    useEffect(() => {
        if (authorProfilePhotoUrl.length > 0) {
            const reference = ref(storage, authorProfilePhotoUrl);
            getDownloadURL(reference).then((url) => {
                setAvatar(url)
            });
        }
    }, [authorProfilePhotoUrl]);

    return (
        <Card sx={{ width: "60vw", margin: "10px auto" }}>
            <CardHeader
                avatar={
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/profile/${authorId}`}>
                        {
                            (avatar.length > 0) ? (
                                <Avatar variant="rounded" src={avatar}>
                                    <AccountBoxIcon />
                                </Avatar>
                            ) : (
                                <Avatar sx={{ bgcolor: blue[500] }} variant="rounded">
                                    <AccountBoxIcon />
                                </Avatar>
                            )
                        }
                    </Link>
                }
                action={
                    <>
                        <Rating value={rate} readOnly />
                    </>
                }
                title={authorName}
                subheader={dateCreated}
            />
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {text}
                </Typography>
            </CardContent>
        </Card>
    );
}