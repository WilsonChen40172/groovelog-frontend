import { makeStyles } from "@mui/material";

export const useStyles = makeStyles({
    App: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px',
    },
    textField: {
        marginRight: '16px',
        flexGrow: 1,
    },
    addButton: {
        height: '56px',
    },
}); 