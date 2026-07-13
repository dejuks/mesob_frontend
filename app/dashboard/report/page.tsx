"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ReportRow {
    window_name: string;
    service_name: string;
    highly_satisfied: number;
    satisfied: number;
    not_satisfied: number;
    total: number;
}

export default function CustomerSatisfactionReport() {
    const [rows, setRows] = useState<ReportRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    async function loadReport() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/feedback-report`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load report");
            }

            const result = await response.json();

            setRows(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const totals = useMemo(() => {
        return rows.reduce(
            (acc, row) => {
                acc.highly += Number(row.highly_satisfied);
                acc.satisfied += Number(row.satisfied);
                acc.notSatisfied += Number(row.not_satisfied);
                acc.total += Number(row.total);

                return acc;
            },
            {
                highly: 0,
                satisfied: 0,
                notSatisfied: 0,
                total: 0,
            }
        );
    }, [rows]);

    return (
        <div className="container mx-auto py-8">

            <Card>

                <CardHeader>
                    <CardTitle className="text-2xl">
                        Customer Satisfaction Report
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    {loading ? (
                        <div className="text-center py-10">
                            Loading...
                        </div>
                    ) : (

                        <Table>

                            <TableHeader>

                                <TableRow>
                                    <TableHead rowSpan={2}>Window</TableHead>
                                    <TableHead rowSpan={2}>Service</TableHead>

                                    <TableHead
                                        colSpan={5}
                                        className="text-center"
                                    >
                                        Customer Satisfaction Scale
                                    </TableHead>
                                </TableRow>

                                <TableRow>
                                    <TableHead className="text-center">
                                        Highly Satisfied
                                    </TableHead>

                                    <TableHead className="text-center">
                                        Satisfied
                                    </TableHead>

                                    <TableHead className="text-center">
                                        Not Satisfied
                                    </TableHead>

                                    <TableHead className="text-center">
                                        Total
                                    </TableHead>

                                    <TableHead className="text-center">
                                        %
                                    </TableHead>
                                </TableRow>

                            </TableHeader>

                            <TableBody>

                                {rows.map((row, index) => {

                                    const percent =
                                        row.total > 0
                                            ? (
                                                ((row.highly_satisfied +
                                                        row.satisfied) /
                                                    row.total) *
                                                100
                                            ).toFixed(1)
                                            : "0.0";

                                    return (
                                        <TableRow key={index}>

                                            <TableCell>
                                                {row.window_name}
                                            </TableCell>

                                            <TableCell>
                                                {row.service_name}
                                            </TableCell>

                                            <TableCell className="text-center text-green-600 font-semibold">
                                                {row.highly_satisfied}
                                            </TableCell>

                                            <TableCell className="text-center text-blue-600 font-semibold">
                                                {row.satisfied}
                                            </TableCell>

                                            <TableCell className="text-center text-red-600 font-semibold">
                                                {row.not_satisfied}
                                            </TableCell>

                                            <TableCell className="text-center font-semibold">
                                                {row.total}
                                            </TableCell>

                                            <TableCell className="text-center font-bold">
                                                {percent}%
                                            </TableCell>

                                        </TableRow>
                                    );
                                })}

                            </TableBody>

                            <TableFooter>

                                <TableRow>

                                    <TableCell colSpan={2}>
                                        TOTAL
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {totals.highly}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {totals.satisfied}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {totals.notSatisfied}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {totals.total}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {totals.total > 0
                                            ? (
                                                ((totals.highly +
                                                        totals.satisfied) /
                                                    totals.total) *
                                                100
                                            ).toFixed(1)
                                            : "0.0"}
                                        %
                                    </TableCell>

                                </TableRow>

                            </TableFooter>

                        </Table>

                    )}

                </CardContent>

            </Card>

        </div>
    );
}