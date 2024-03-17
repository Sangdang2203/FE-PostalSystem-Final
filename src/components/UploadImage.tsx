/*
import * as React from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

// @ts-ignore
export default function InputFileUpload({preview, setPreview, uploadFile, setUploadFile, setImage}) {

    const handleFileUpload = async () => {
        if (preview) {
            // @ts-ignore
            const formData = new FormData();
            formData.append('file', preview);
            const response = await fetch('/api/aws-s3', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            return data.fileLink;
        }
    };
    React.useEffect(() => {
        if (uploadFile === true) {
            handleFileUpload().then((res) => {
                setImage(res.fileLink)
            });
            setUploadFile(false);
        }
    }, [uploadFile]);

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon/>}
        >
            Upload file
            <VisuallyHiddenInput type="file" onChange={(e) => {
                // @ts-ignore
                setPreview(e.target.files[0] || null);
            }}/>

        </Button>
    );
}*/
