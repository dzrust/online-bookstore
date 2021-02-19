export const  createResponse = (data: any, status: number): string => {
    return JSON.stringify({
        data,
        status
    });
}