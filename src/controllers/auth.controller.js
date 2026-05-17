import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import crypto from "crypto";
import sessionModel from "../models/session.model.js";

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

        const refreshTokne = jwt.sign({
            id: user._id,
            username: user.username,
            issuedAt: Date.now()},
            config.jwtSecretKey, {expiresIn: "7d"}
        );

        const refreshTokenHash = crypto.createHash("sha256").update(refreshTokne).digest("hex");

        const session = await sessionModel.create({
            userId: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]    
        });

        const accessToken = jwt.sign({
            id: user._id, 
            session: session._id, // Include session ID to allow for session revocation and tracking.
        }, config.jwtSecretKey, {expiresIn: "15m"});

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
                accessToken: accessToken
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

export async function login(req, res){
    try{
        const {email, password} = req.body;   

        const user = await userModel.findOne({ email });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        const hashPassword = crypto.createHash("sha256").update(password).digest("hex");

        if(hashPassword !== user.password){
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const refreshTokne = jwt.sign({
            id: user._id,
            issuedAt: Date.now()},
            config.jwtSecretKey, {expiresIn: "7d"}
        );

        const refreshTokenHash = crypto.createHash("sha256").update(refreshTokne).digest("hex");

        const session = await sessionModel.create({
            userId: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]    
        });

        const accessToken = jwt.sign({
            id: user._id, 
            session: session._id, // Include session ID to allow for session revocation and tracking.
        }, config.jwtSecretKey, {expiresIn: "15m"});

        res.cookie("refreshToken", refreshTokne, {
            httpOnly: true,
            // secure: true, // Set to true in production with HTTPS
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                username: user.username,
                email: user.email,
                accessToken: accessToken
            }
        });
        
    }catch(err){
        return res.status(500).json({
            message: "Failed to login",
            error: err.message
        });
    }
}

export async function getMe(req, res){
    try{
        const accessToken = req.headers.authorization?.split(" ")[1];

        if(!accessToken)
        {
            return res.status(401).json({
                message: "Unauthorized: token not found"
            });
        }

        const decoded = jwt.verify(accessToken, config.jwtSecretKey);
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

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });
        if(!session){
            return res.status(401).json({
                message: "Unauthorized: invalid refresh token"
            });
        }

        const accessToken = jwt.sign({
            id: decoded.id,
            createdAt: Date.now()
        }, config.jwtSecretKey, {expiresIn: "15m"});

        const newRefreshToken = jwt.sign({
            id: decoded.id,
            issuedAt: Date.now()
        }, config.jwtSecretKey, {expiresIn: "7d"});

        const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

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

export async function logout(req, res){
    try{
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(400).json({
                message: "Refresh token not found"
            });
        }

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if(!session){
            return res.status(400).json({
                message: "Invalid refresh token"
            });
        }

        session.revoked = true;
        await session.save();

        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Logged out successfully"
        });

    }catch(err){
        return res.status(500).json({
            message: "Failed to logout",
            error: err.message
        });
    }
}

export async function logoutAll(req, res)
{
    try{

        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(400).json({
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(refreshToken, config.jwtSecretKey);

        await sessionModel.updateMany({
            userId: decoded.id,
            revoked: false
        }, { revoked: true });

        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Logged out from all devices successfully"
        });


    }catch(err)
    {
        return res.status(500).json({
            message: "Failed to logout all",
            error: err.message
        })
    }
}