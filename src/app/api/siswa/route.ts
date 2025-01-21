import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all siswa
export async function GET() {
  try {
    const siswa = await prisma.siswa.findMany();
    return NextResponse.json(siswa);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to get data' },
      { status: 500 }
    );
  }
}

// POST create new siswa
export async function POST(request: Request) {
  try {
    const { nama, kelas, jenis_kelamin } = await request.json();

    const newSiswa = await prisma.siswa.create({
      data: {
        nama,
        kelas,
        jenis_kelamin
      }
    });

    return NextResponse.json(newSiswa, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create data' },
      { status: 500 }
    );
  }
}
