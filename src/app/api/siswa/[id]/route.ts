import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PUT update siswa
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { nama, kelas, jenis_kelamin } = await request.json();

    const updatedSiswa = await prisma.siswa.update({
      where: { id: Number(params.id) },
      data: {
        nama,
        kelas,
        jenis_kelamin
      }
    });

    return NextResponse.json(updatedSiswa);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE siswa
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.siswa.delete({
      where: { id: Number(params.id) }
    });

    return NextResponse.json({ message: 'Data deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
