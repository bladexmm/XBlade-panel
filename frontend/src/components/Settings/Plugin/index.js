import Grid from "@mui/joy/Grid";


export default function Plugin() {
    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}
              columns={{xs: 6, sm: 8, md: 12}}>
            <Grid xs={6} sm={8} md={6} container direction="column" justifyContent="center" alignItems="center"
                  spacing={2} columns={{xs: 6, sm: 8, md: 12}}>
            </Grid>

        </Grid>
    );
}