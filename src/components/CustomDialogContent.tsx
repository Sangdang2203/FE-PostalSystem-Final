import {Dialog, DialogContent, DialogTitle, Slide} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

export default function CustomDialogContent(props: { title: React.ReactNode; content: React.ReactNode; isOpen: boolean, setIsOpen: (value: boolean) => void}) {

    const handleCloseDialog = () => {
        props.setIsOpen(false);
    };

    return (
        <>
            <Dialog
                open={props.isOpen}
                TransitionComponent={Slide}
                onClose={handleCloseDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{props.title}</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    {props.content}
                </DialogContent>
            </Dialog>
        </>
    )
}