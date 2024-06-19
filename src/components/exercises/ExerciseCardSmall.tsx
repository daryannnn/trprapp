import {Box} from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Typography from "@mui/material/Typography";
import Link from "next/link";
import * as React from "react";
import {useEffect} from "react";
import getProgramData from "@/firebase/getProgramData";
import getExerciseData from "@/firebase/getExerciseData";

interface Props {
    programId: string,
    id: string,
}

export default function ExerciseCardSmall(props: Props) {
    const [name, setName] = React.useState(null);
    const [setsNumber, setSetsNumber] = React.useState('');
    const [repsNumber, setRepsNumber] = React.useState('');
    const [regularity, setRegularity] = React.useState('');
    useEffect(() => {
        async function getExercise() {
            const post = await getExerciseData(props.programId, props.id);
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
        }
        getExercise();
    }, [props.id, props.programId])
    return (
        <Box sx={{ width: "45vw", flexDirection: 'row', bgcolor: "white", display: 'flex', justifyContent: 'space-between', padding: "10px", borderRadius: 1, margin: "0 7vw 0 6vw", alignItems: "center"}}>
            <Box>
                <Typography><strong>{name}</strong></Typography>
                <Box>
                    <Typography display={"inline"}>{repsNumber} раз</Typography>
                    <Typography sx={{margin: "0 20px"}} display={"inline"}>{setsNumber} подхода</Typography>
                    <Typography display={"inline"}>{regularity}</Typography>
                </Box>
            </Box>
            <Link href={`/program/${props.programId}/exercise/${props.id}`}>
                <NavigateNextIcon />
            </Link>
        </Box>
    )
}