import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import ProgramCardSmall from "@/components/ProgramCardSmall";
import getFavoritePrograms from "@/firebase/getFavoritePrograms";

interface Props {
    id: string,
}

export default function FavoritePrograms(props: Props) {
    let programIds: string[] = [];
    // @ts-ignore
    const posts = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getPosts() {
            programIds = await getFavoritePrograms(props.id);
            programIds.map((postId: string) => {
                posts.push(
                    <Grid item xs={12} sm={6} xl={4}>
                        <ProgramCardSmall id={postId} currentUserId={props.id}/>
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