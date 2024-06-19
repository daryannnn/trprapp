import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    MenuList,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import Link from "next/link";
import React from "react";
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import {blue} from "@mui/material/colors";
import FavoritePrograms from "@/components/FavoritePrograms";

interface Props {
    currentUserId: string,
}

export default function FavoriteProgramsSurface(props: Props) {
    const [goal, setGoal] = React.useState('');

    const handleGoal = (event: SelectChangeEvent) => {
        setGoal(event.target.value as string);
    };

    const [serviceType, setServiceType] = React.useState('');

    const handleServiceType = (event: SelectChangeEvent) => {
        setServiceType(event.target.value as string);
    };

    return (
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Box sx={{padding: "10px", margin: "30px 0px", width: "20vw", minWidth: "150px"}}>
                <Typography color={"text.secondary"}>Выберите цель</Typography>
                <FormControl fullWidth sx={{margin: "15px auto"}}>
                    <InputLabel id="typeOfProfile-label">Цель</InputLabel>
                    <Select
                        value={goal}
                        label="Цель"
                        labelId="typeOfProfile-label"
                        onChange={handleGoal}
                        id="typeOfProfile"
                    >
                        <MenuItem value={"gain"}>Набор мышечной массы</MenuItem>
                        <MenuItem value={"lose"}>Похудение</MenuItem>
                        <MenuItem value={"keeping"}>Поддержание формы</MenuItem>
                    </Select>
                </FormControl>
                <Typography color={"text.secondary"}>Выберите вид услуги</Typography>
                <FormControl fullWidth sx={{margin: "15px auto"}}>
                    <InputLabel id="typeOfProfile-label">Вид</InputLabel>
                    <Select
                        value={serviceType}
                        label="Вид услуги"
                        onChange={handleServiceType}
                        labelId="typeOfProfile-label"
                        id="typeOfProfile"
                    >
                        <MenuItem value={"training-program"}>Тренировочная программа</MenuItem>
                    </Select>
                </FormControl>
                <Typography color={"text.secondary"}>Выберите рейтинг программы</Typography>
                <TextField label={"Рейтинг, от"} type={"number"} variant={"outlined"} sx={{ margin: "10px auto 15px auto"}}/>
                <Typography color={"text.secondary"}>Выберите стоимость</Typography>
                <TextField label={"Рублей, до"} type={"number"} variant={"outlined"} sx={{ margin: "10px auto 15px auto"}}/>
            </Box>

            <Paper sx={{ width:"55vw", margin: "30px auto", padding: "0 0 10px 0", bgcolor: blue[200] }}>
                <Box sx={{ flexDirection: 'row', bgcolor: blue[300], display: 'flex', justifyContent: 'space-between', padding: "10px", margin: "0 0 10px 0", borderRadius: 1}}>
                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                        <SportsMmaIcon sx={{margin: "5px 10px 0 0"}} color={"primary"}/>
                        <Typography sx={{margin: "4px 0 0 0"}} display="inline" variant="h6">Избранные услуги</Typography>
                    </Box>
                </Box>

                <FavoritePrograms id={props.currentUserId}/>

            </Paper>

            <Box sx={{display: "flex", justifyContent: "end"}}>
                <MenuList sx={{margin: "30px", width: "15vw"}}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/favorites/posts"}>
                        <MenuItem>Публикации</MenuItem>
                    </Link>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/favorites/events"}>
                        <MenuItem>Мероприятия</MenuItem>
                    </Link>
                    <MenuItem selected>Услуги</MenuItem>
                </MenuList>
            </Box>
        </Box>
    )
}