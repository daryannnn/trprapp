import {
    Autocomplete,
    Box, Button,
    FormControl, Grid, InputAdornment,
    InputLabel,
    MenuItem,
    MenuList,
    OutlinedInput,
    Select, SelectChangeEvent, TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import Link from "next/link";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import React, {lazy} from "react";
import searchPrograms from "@/firebase/searchPrograms";
import ProgramCard from "@/components/ProgramCard";
import ProgramCardSmall from "./ProgramCardSmall";
import {theme} from "@/utils/theme";

interface Props {
    currentUserId: string,
}

export default function SearchPrograms(props: Props) {
    const [goal, setGoal] = React.useState('');
    const handleGoal = (event: SelectChangeEvent) => {
        setGoal(event.target.value as string);
    };

    const [serviceType, setServiceType] = React.useState('');
    const handleServiceType = (event: SelectChangeEvent) => {
        setServiceType(event.target.value as string);
    };

    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState<any>(null);
    const [rating, setRating] = React.useState<any>(null);

    const [programIds, setProgramId] = React.useState<string[]>([]);
    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await searchPrograms(name, goal, rating).then((ids) => {
            console.log(ids)
            setProgramId(ids)
        })
    };

    return (
        <ThemeProvider theme={theme}>
        <form onSubmit={handleForm}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Box sx={{padding: "10px", margin: "30px 0px", width: "15vw", minWidth: "200px"}}>
                    <Typography color={"text.secondary"}>Выберите цель</Typography>
                    <FormControl fullWidth sx={{margin: "15px auto"}}>
                        <InputLabel id="typeOfProfile-label">Цель</InputLabel>
                        <Select
                            value={goal}
                            label="Цель"
                            labelId="typeOfProfile-label"
                            onChange={handleGoal}
                            id="typeOfProfile"
                            sx={{ width: "15vw", minWidth: "150px"}}
                        >
                            <MenuItem value={"gain"}>Набор мышечной массы</MenuItem>
                            <MenuItem value={"loss"}>Похудение</MenuItem>
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
                            sx={{ width: "15vw", minWidth: "150px"}}
                        >
                            <MenuItem value={"training-program"}>Тренировочная программа</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography color={"text.secondary"}>Выберите рейтинг программы</Typography>
                    <TextField
                        onChange={(newValue) => setRating(newValue.target.value)}
                        label={"Рейтинг, от"}
                        type={"number"}
                        variant={"outlined"}
                        InputProps={{ inputProps: { min: 0, max: 5 } }}
                        sx={{ margin: "10px auto 15px auto", width: "15vw", minWidth: "150px"}}/>
                    <Typography color={"text.secondary"}>Выберите стоимость</Typography>
                    <TextField
                        disabled
                        onChange={(newValue) => setPrice(newValue.target.value)}
                        label={"Рублей, до"}
                        type={"number"}
                        variant={"outlined"}
                        sx={{ margin: "10px auto 15px auto", width: "15vw", minWidth: "150px"}}
                    />
                </Box>

                <Box>
                    <Box sx={{
                        margin: "30px auto",
                        width: "50vw",
                    }}>
                        <TextField
                            onChange={(newValue) => setName(newValue.target.value)}
                            id="input-with-icon-textfield"
                            placeholder="Поиск..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            sx={{
                                width: "40vw"
                            }}
                        />

                        <Button variant="contained" type={"submit"} sx={{margin: "10px"}}><SearchOutlinedIcon /></Button>
                    </Box>
                    <div>
                        {
                            programIds.length > 0 && <Grid  container spacing={1}>{programIds.map((id) => (
                                <Grid item key={id} xs={12} md={6} xl={4}>
                                    <ProgramCardSmall id={id} currentUserId={props.currentUserId} />
                                </Grid>
                            ))}</Grid>
                        }
                    </div>
                </Box>

                <Box sx={{display: "flex", justifyContent: "end"}}>
                    <MenuList sx={{width: "15vw", margin: "30px"}}>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/search/organizations"}>
                            <MenuItem>Организации</MenuItem>
                        </Link>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/search/events"}>
                            <MenuItem>Мероприятия</MenuItem>
                        </Link>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/search/sportsmen"}>
                            <MenuItem>Спортсмены</MenuItem>
                        </Link>
                        <MenuItem selected>Услуги</MenuItem>
                    </MenuList>
                </Box>
            </Box>
        </form>
        </ThemeProvider>
    )
}