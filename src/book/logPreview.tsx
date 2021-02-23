import * as React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import { BookLog } from "../../models/book";
import * as Moment from "moment";

type LogPreviewProps = {
    logs: BookLog[];
    isLoading: boolean;
}

const LogPreview: React.FC<LogPreviewProps> = ({ logs, isLoading }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<Icons.ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Logs</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {
                    isLoading ? (
                        <Typography>Loading Logs</Typography>
                    ) : (<TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log: BookLog) =>
                                    <TableRow key={log.id}>
                                        <TableCell component="th" scope="row">
                                            {Moment(log.dateTime).format("LLL")}
                                        </TableCell>
                                        <TableCell align="right">{log.message}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                        )
                }
            </AccordionDetails >
        </Accordion >
    )
}

export default LogPreview;