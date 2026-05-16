import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import crypto from "crypto";

export async function register(req, res){
    try {
        const {username, email, password} = req.body;

        const isAlreadyRegistered = await userModel.findOne({
            $or : [{username}, {email}]
        });

        if (isAlreadyRegistered) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        // Weak against brute-force and rainbow-table attacks.
        const hashPassword = crypto.createHash("sha256").update(password).digest("hex");
        const user = await userModel.create({username, email, password: hashPassword});

        const accessToken = jwt.sign({
            id: user._id, // Store user ID and username in token payload for later verification and user info retrieval.
            username: user.username
        }, config.jwtSecretKey, {expiresIn: "15m"});

        const refreshTokne = jwt.sign({
            id: user._id,
            username: user.username,
            issuedAt: Date.now()},
            config.jwtSecretKey, {expiresIn: "7d"}
        );

        res.cookie("refreshToken", refreshTokne, {
            httpOnly: true,
            // secure: true, // Set to true in production with HTTPS
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                username: user.username,
                email: user.email,
                token: accessToken
            }
        });
    } catch (err) {
        // DB operations and validation can throw; convert to safe API error response.
        return res.status(500).json({
            message: "Failed to register user",
            error: err.message
        });
    }
}

export async function getMe(req, res){
    try{
        const token = req.headers.authorization?.split(" ")[1];

        if(!token)
        {
            return res.status(401).json({
                message: "Unauthorized: token not found"
            });
        }

        const decoded = jwt.verify(token, config.jwtSecretKey);
        // console.log(decoded);
        /*
        {
            id: '6a0810a3dfa879808517dc8b', //id is given while creating token in register function
            username: 'tester1',
            iat: 1778913443,
            exp: 1778999843
        }
        */

        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User info retrieved successfully",
            user: {
                username: user.username,
                email: user.email
            }
        });

    }catch(err){
        return res.status(500).json({
            message: "Failed to retrieve user info",
            error: err.message
        });
    }
}

export async function refreshToken(req, res){
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({
                message: "Unauthorized: refresh token not found"
            });
        }

        const decoded = jwt.verify(refreshToken, config.jwtSecretKey);
        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        const accessToken = jwt.sign({
            id: user._id,
            username: user.username,
            createdAt: Date.now()
        }, config.jwtSecretKey, {expiresIn: "15m"});

        const newRefreshToken = jwt.sign({
            id: user._id,
            username: user.username,
            issuedAt: Date.now()
        }, config.jwtSecretKey, {expiresIn: "7d"});

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            // secure: true, // Set to true in production with HTTPS
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        });
    }catch(err){
        return res.status(500).json({
            message: "Failed to refresh token",
            error: err.message
        });
    }
}