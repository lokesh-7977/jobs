import express,{ Request, Response } from "express";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import User from "../models/auth.model";  
import { config } from "../config/index";

interface CustomRequest extends Request {
  userId?: string;
}

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });

    const user = await newUser.save();
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const jwtSecret = config.jwt as string;
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: config.jwt_expiration as string });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

export const getUser = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ msg: "User Not Found" });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

export const deleteUser = async (req: CustomRequest, res: Response): Promise<Response> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

export const updateUser = async (req: CustomRequest, res: Response): Promise<Response> => {
  const userId = req.userId;
  const { email, name, password } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (email) user.email = email;
    if (name) user.name = name;
    if (password) user.password = await bcrypt.hash(password, 10);

    const updatedUser = await user.save();

    return res.status(200).json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};

export const logOut = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const verified = jwt.verify(token, config.jwt as string);
    if (!verified) {
      return res.status(401).json({ msg: "Token verification failed, authorization denied" });
    }
    
    return res.status(200).json({ msg: "Logged out successfully" });
  } catch (error: any) {
    return res.status(500).json({ msg: "Error: " + error.message });
  }
};
