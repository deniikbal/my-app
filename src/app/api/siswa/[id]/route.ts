import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const siswa = await prisma.siswa.findUnique({
      where: { id: Number(params.id) }
    })
    
    if (!siswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(siswa)
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const siswa = await prisma.siswa.update({
      where: { id: Number(params.id) },
      data: {
        nama: data.nama,
        kelas: data.kelas,
        jenis_kelamin: data.jenis_kelamin
      }
    })
    return NextResponse.json(siswa)
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengupdate siswa' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.siswa.delete({
      where: { id: Number(params.id) }
    })
    return NextResponse.json({ message: 'Siswa berhasil dihapus' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menghapus siswa' },
      { status: 500 }
    )
  }
}
