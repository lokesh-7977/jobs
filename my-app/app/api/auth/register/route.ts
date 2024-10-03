import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/../lib/prisma";

type Role = "jobSeeker" | "employer";

interface RequestBody {
  name: string;
  email: string;
  password: string;
  role?: Role;
  // Fields required for employers
  organizationName?: string;
  industryType?: string;
  totalEmployee?: number;
  description?: string;
  address?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
    createdOrg?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await request.json();
    const {
      name,
      email,
      password,
      role,
      organizationName,
      industryType,
      totalEmployee,
      description,
      address,
      province,
      city,
      district,
      postalCode,
      createdOrg
    } = body;

    // Common validation for required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate role
    if (role !== "jobSeeker" && role !== "employer") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = Math.random().toString(36).substring(2);
    const verifyTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    let user;

    if (role === "employer") {
      if (!organizationName || !industryType) {
        return NextResponse.json({ error: "Missing organization details for employer" }, { status: 400 });
      }

      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          verifyToken,
          verifyTokenExpiry,
          role: "employer",
          industryType,
          totalEmployee,
          description,
          address,
          province,
          city,
          district,
          postalCode,
          createdOrg
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          verifyToken,
          verifyTokenExpiry,
          role: "jobSeeker",
          industryType,
          totalEmployee,
          description,
          address,
          province,
          city,
          district,
          postalCode,
          createdOrg
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
