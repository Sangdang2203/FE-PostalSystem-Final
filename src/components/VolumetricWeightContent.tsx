import {Box, Typography} from "@mui/material";
import {useSiteSetting} from "@/contexts/SiteContext";

export default function VolumetricWeightContent() {
    // @ts-ignore
    const {siteSetting} = useSiteSetting();
    const {rateConvert , limitSize, limitWeight} = siteSetting;
    return(
        <Box>
            <Typography variant="body1" sx={{fontSize: '14px', textAlign: 'left', py:1}}>
                The size of the package is calculated based on the length, width, and height of the package.
                Volumetric Weight is a calculation that reflects the density of a package. A less dense item generally.
                The calculation formula is as follows:
            </Typography>
            <Typography variant="body1" sx={{fontSize: '14px', textAlign: 'left', py:1}}>
                The calculation formula is as follows:
            </Typography>
            <Typography variant="body1" sx={{fontSize: '15px', textAlign: 'center', fontWeight: 550, py:2}}>
                (Length x Width x Height) / {rateConvert * 1000} = Volumetric Weight (kg)
            </Typography>
            <Typography variant="body1" sx={{fontSize: '14px', textAlign: 'left', py:1}}>
                If any element of size (weight,width,length) is greater than {limitSize}cm or Volumetric Weight is greater than {limitWeight}KG.
            </Typography>
            <Typography variant="body1" sx={{fontSize: '14px', textAlign: 'left', py:1}}>
                The results are compared with the actual weight of the package to determine which weight is greater.
                Volumetric weight or actual weight. The larger weight is used to calculate shipping costs.
            </Typography>
        </Box>
    )
}