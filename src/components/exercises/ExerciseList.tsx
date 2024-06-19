import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import getProgramExercises from "@/firebase/getProgramExercises";
import ExerciseCardSmall from "@/components/exercises/ExerciseCardSmall";

interface Props {
    id: string,
}

export default function ExerciseList(props: Props) {
    let exIds: string[] = [];
    // @ts-ignore
    const exercises = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getPosts() {
            exIds = await getProgramExercises(props.id);
            exIds.map((postId: string) => {
                exercises.push(
                    <Grid item sx={{justifyContent: "center"}}>
                        <ExerciseCardSmall programId={props.id} id={postId}/>
                    </Grid>
                );
                // @ts-ignore
                setP(exercises);
            })}
        getPosts();
    }, [])

    return (
        <Grid sx={{margin: "0 auto"}} container spacing={1}>
            {p}
        </Grid>
    );
}