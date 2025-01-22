import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const siswa = await prisma.siswa.findMany()
    return NextResponse.json(siswa)
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const siswa = await prisma.siswa.create({
      data: {
        nama: data.nama,
        kelas: data.kelas,
        jenis_kelamin: data.jenis_kelamin
      }
    })
    return NextResponse.json(siswa)
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menambahkan siswa' },
      { status: 500 }
    )
  }
}
