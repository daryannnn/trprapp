import React, {useEffect} from "react";
import {Grid} from "@mui/material";
import getProgramReviews from "@/firebase/getProgramReviews";
import Review from "@/components/reviews/Review";

interface Props {
    id: string,
}

export default function ProgramReviews(props: Props) {
    let reviewIds: string[] = [];
    // @ts-ignore
    const reviews = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getReviews() {
            reviewIds = await getProgramReviews(props.id);
            reviewIds.map((reviewId: string) => {
                reviews.push(
                    <Grid item>
                        <Review id={reviewId} />
                    </Grid>
                );
                // @ts-ignore
                setP(reviews);
            })}
        getReviews();
    }, [])

    return (
        <Grid sx={{justifyContent: "center"}} container spacing={1}>
            {p}
        </Grid>
    );
}