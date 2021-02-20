import * as React from "react";
import { BookLog } from "../../models/book";

type LogPreviewProps = {
    logs: BookLog[];
    isLoading: boolean;
}

const LogPreview: React.FC<LogPreviewProps> = ({ logs, isLoading }) => {
    const [isLogsOpen, setIsLogsOpen] = React.useState(false);
    return (
        <div>
            <div onClick={() => setIsLogsOpen(!isLogsOpen)}>
                Logs {isLogsOpen ? "-" : "O"}
            </div>
            {
                isLogsOpen && !isLoading ? (
                    <div className="table">
                        {
                            logs.map((log: BookLog) => {
                                return (
                                    <div key={log.id} className="row">
                                        <div className="column bold">{log.dateTime}</div>
                                        <div className="column">{log.message}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : null
            }
        </div>
    )
}

export default LogPreview;