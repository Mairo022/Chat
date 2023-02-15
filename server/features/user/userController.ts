import UserModel from './userModel'
import { IUser } from "./userTypes"
import { throwError } from "../utils/errorHandler";

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function register(req, res): Promise<void> {
    const { username, password }: IUser = req.body
    const userExists = () => UserModel.exists({ username })

    if (username === undefined) throwError("Username is required", 400)
    if (username.length < 4) throwError("Minimum username length is 4 characters", 400)
    if (username.length > 20) throwError("Maximum username length is 20 characters", 400)

    if (password === undefined) throwError("Password is required", 400)
    if (password.length < 8) throwError("Minimum password length is 8 characters", 400)
    if (password.length > 255) throwError("Maximum password length is 255 characters", 400)

    if (await userExists()) throwError("Username already exists", 409)

    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS as string))
    const passwordHashed = await bcrypt.hashSync(password, salt)
    const user = new UserModel({
        username: username,
        password: passwordHashed
    })

    await user.save()

    res.status(201).json({ message: "User registered" })
}

async function login(req, res): Promise<void> {
    const { username, password }: IUser = req.body
    const user = await UserModel.findOne({ username })
    const passwordMatch = () => bcrypt.compare(password, user?.password)

    if (user === null) throwError("User not found", 400)
    if (!await passwordMatch()) throwError("Wrong password", 400)

    res.cookie('token', token({ userID: user!._id }), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60000 * 60 * 24 * 30
    })

    res.status(201).json({ userID: user!._id, username: user!.username })
}

const token = (userID: object): string =>
    jwt.sign(userID, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

export default {
    register,
    login
}