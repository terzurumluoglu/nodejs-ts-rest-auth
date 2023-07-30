export const promiseHandler = (promise: Promise<any>): Promise<{ result: any; error: any; } | { error: any; result: any; }> => {
    return promise
        .then(result => ({ result, error: undefined }))
        .catch(error => ({ error, result: undefined }));
};
