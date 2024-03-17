import * as React from 'react';
import {useEffect, useMemo} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useSiteSetting} from "@/contexts/SiteContext";

const TableItems = (Props: any) => {
    const {data, size} = Props;
    // @ts-ignore
    const {siteSetting} = useSiteSetting();


    const [rows, setRows] = React.useState<Row[]>([]);
    const [sizePackage, setSizePackage] = React.useState({width: 0, height: 0, length: 0});

    function createRow(name: string, qty: number, weight: number, value: number) {
        return {name, qty, weight, value};
    }

    interface Row {
        name: string;
        qty: number;
        weight: number;
        value: number;
    }

    function totalValue(data: readonly Row[]) {
        return data.reduce((sum, i) => sum + i.value * i.qty, 0);
    }

    function totalWeight(data: readonly Row[]) {
        return data.reduce((sum, i) => sum + i.weight * i.qty, 0);
    }


    const totalValueResult = totalValue(rows);
    const totalWeightResult = totalWeight(rows);
    const sizeConvert = useMemo(() => {
        if (sizePackage) {
            const totalSize = sizePackage?.width * sizePackage?.height * sizePackage["length"];
            return totalSize / siteSetting.rateConvert;
        }
        return 0;
    }, [sizePackage, siteSetting.rateConvert]);

    const checkSize = useMemo(() => {
        return Object.values(sizePackage).some(value => value > siteSetting.limitSize) || sizeConvert / 1000 > siteSetting.limitWeight;
    }, [sizePackage, siteSetting.limitSize, siteSetting.limitWeight, sizeConvert])

    const finalWeight = useMemo(() => {
        return !checkSize ? totalWeightResult : Math.max(sizeConvert, totalWeightResult);
    }, [checkSize, sizeConvert, totalWeightResult])

    useEffect(() => {
        if (data) {
            const rows = data.map((item: any) => {
                return createRow(item.itemName, item.itemQuantity, item.itemWeight, item.itemValue);
            });
            setRows(rows);
        }
    }, [data]);

    useEffect(() => {
        if (size) {
            setSizePackage(JSON.parse(size))
        }
    }, [size]);

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 700}}>
                <TableHead>
                    <TableRow sx={{
                        backgroundColor: "#f5f5f5"
                    }}>
                        <TableCell align="left" colSpan={2}>
                            Package Size
                        </TableCell>
                        <TableCell align="right" colSpan={2}>W:{sizePackage.width || 0}cm - H:{sizePackage.height || 0}cm
                            - L:{sizePackage.length || 0}cm</TableCell>
                    </TableRow>
                    <TableRow sx={{
                        backgroundColor: "#f5f5f5"
                    }}>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Qty.</TableCell>
                        <TableCell align="center">Weight</TableCell>
                        <TableCell align="center">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">{row.qty}</TableCell>
                            <TableCell align="right">{row.weight} gram</TableCell>
                            <TableCell align="right">${row.value}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={3} sx={{
                            textAlign: "right"
                        }}>Total value</TableCell>
                        <TableCell align="right">${totalValueResult}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{
                            textAlign: "right"
                        }}>Total Weight</TableCell>
                        <TableCell align="right">{totalWeightResult} gram</TableCell>
                    </TableRow>
                    {sizeConvert > totalWeightResult ?
                        <>
                            <TableRow>
                                <TableCell colSpan={3} sx={{
                                    textAlign: "right"
                                }}>Volumetric Weight</TableCell>
                                <TableCell align="right">{sizeConvert} gram</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} sx={{
                                    textAlign: "right"
                                }}>Final Weight</TableCell>
                                <TableCell align="right">{finalWeight} gram</TableCell>
                            </TableRow>
                        </>
                        :null}
                </TableBody>
            </Table>
        </TableContainer>)
}
export default TableItems;