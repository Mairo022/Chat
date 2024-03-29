const catchErrors = func =>
    (req, res, next) =>
        func(req, res, next)
            .catch((e) => {
                const message = e.message ? e.message : "Request failed"
                const code = e.code ? e.code : 400

                res.status(code).json({ message })
            })

const throwError = (message: string, code: number) => {
    throw ({ message, code })
}

export {
    catchErrors,
    throwError
}