import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import getUsersPrograms from "@/firebase/getUsersPrograms";
import ProgramCardSmall from "@/components/ProgramCardSmall";

interface Props {
    id: string,
    currentUserId: string,
}

export default function UserPrograms(props: Props) {
    let programIds: string[] = [];
    // @ts-ignore
    const posts = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getPosts() {
            programIds = await getUsersPrograms(props.id);
            programIds.map((postId: string) => {
                posts.push(
                    <Grid item xs={12} sm={6} xl={4}>
                        <ProgramCardSmall id={postId} currentUserId={props.currentUserId} />
                    </Grid>
                );
                // @ts-ignore
                setP(posts);
            })}
        getPosts();
    }, [])

    return (
        <Grid container spacing={1} >
            {p}
        </Grid>
    );
}