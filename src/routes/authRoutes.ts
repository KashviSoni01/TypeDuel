import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const router: Router = express.Router();

router.post("/signup", async (req, res) => {
  const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        })
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(403).json({
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            message: "User registered successfully",
        });


    } catch (e) {
        return res.status(500).json({
            message: "Sign up failed"
        })
    }
});

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      (process.env.JWT_SECRET as string) || "fallback-secret"
    );

    res.json({
      token
    });

  } catch (error) {

    res.status(500).json({
      message: "Login failed"
    });

  }
});

export default router;