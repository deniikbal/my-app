'use client';
import { useState, useEffect } from 'react';

interface Siswa {
  id: number;
  nama: string;
  kelas: string;
  jenis_kelamin: string;
  createdAt: string;
  updatedAt: string;
}

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

function Alert({ type, message }: AlertProps) {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}>
      {message}
    </div>
  );
}

export default function SiswaPage() {
  const [formData, setFormData] = useState<{
    nama: string;
    kelas: string;
    jenis_kelamin: string;
  }>({
    nama: '',
    kelas: '',
    jenis_kelamin: ''
  });

  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/siswa');
    const data = await response.json();
    setSiswaList(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editId ? `/api/siswa/${editId}` : '/api/siswa';
    const method = editId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setAlert({
        type: 'success',
        message: editId
          ? 'Data berhasil diupdate!'
          : 'Data berhasil ditambahkan!'
      });
      setTimeout(() => setAlert(null), 3000);

      fetchData();
      setFormData({
        nama: '',
        kelas: '',
        jenis_kelamin: 'Laki-laki'
      });
      setEditId(null);
    } else {
      setAlert({
        type: 'error',
        message: 'Terjadi kesalahan saat menyimpan data'
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleEdit = (siswa: Siswa) => {
    setFormData({
      nama: siswa.nama,
      kelas: siswa.kelas,
      jenis_kelamin: siswa.jenis_kelamin
    });
    setEditId(siswa.id);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      'Apakah Anda yakin ingin menghapus data ini?'
    );
    if (confirmDelete) {
      const response = await fetch(`/api/siswa/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAlert({
          type: 'success',
          message: 'Data berhasil dihapus!'
        });
        setTimeout(() => setAlert(null), 3000);
        fetchData();
      } else {
        setAlert({
          type: 'error',
          message: 'Gagal menghapus data'
        });
        setTimeout(() => setAlert(null), 3000);
      }
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className='container mx-auto p-6 max-w-4xl'>
        <div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
          <h1 className='text-3xl font-bold text-blue-800 mb-6'>
            Form Data Siswa
          </h1>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Nama Lengkap
              </label>
              <input
                type='text'
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Kelas
              </label>
              <select
                value={formData.kelas}
                onChange={(e) =>
                  setFormData({ ...formData, kelas: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                required>
                <option value=''>Pilih Kelas</option>
                <option value='XII MIPA 1'>XII MIPA 1</option>
                <option value='XII MIPA 2'>XII MIPA 2</option>
                <option value='XII MIPA 3'>XII MIPA 3</option>
                <option value='XII MIPA 4'>XII MIPA 4</option>
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Jenis Kelamin
              </label>
                <select
                value={formData.jenis_kelamin}
                onChange={(e) =>
                  setFormData({ ...formData, jenis_kelamin: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                required>
                <option value=''>Pilih Jenis Kelamin</option>
                <option value='Laki-laki'>Laki-laki</option>
                <option value='Perempuan'>Perempuan</option>
              </select>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95'>
              {editId ? 'Update Data' : 'Tambah Data'}
            </button>
          </form>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-blue-800'>Daftar Siswa</h2>
            <div className='relative'>
              <input
                type='text'
                placeholder='Cari nama siswa...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-blue-50'>
                  <th className='px-4 py-3 text-left text-sm font-medium text-blue-800'>
                    Nama
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-blue-800'>
                    Kelas
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-blue-800'>
                    Jenis Kelamin
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-blue-800'>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {siswaList
                  .filter((siswa) =>
                    siswa.nama.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((siswa) => (
                    <tr
                      key={siswa.id}
                      className='hover:bg-gray-50 transition-colors'>
                      <td className='px-4 py-3'>{siswa.nama}</td>
                      <td className='px-4 py-3'>{siswa.kelas}</td>
                      <td className='px-4 py-3'>{siswa.jenis_kelamin}</td>
                      <td className='px-4 py-3 space-x-2'>
                        <button
                          onClick={() => handleEdit(siswa)}
                          className='bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-medium transition-all transform hover:scale-105 active:scale-95'>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(siswa.id)}
                          className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-all transform hover:scale-105 active:scale-95'>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className='flex justify-end mt-6 space-x-2'>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-3 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed'>
                {'<'}
              </button>

              {Array.from({
                length: Math.ceil(
                  siswaList.filter((siswa) =>
                    siswa.nama.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length / itemsPerPage
                )
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 text-xs font-medium ${
                    currentPage === index + 1
                      ? 'text-white bg-blue-600'
                      : 'text-blue-600 bg-white'
                  } border border-blue-300 rounded-md hover:bg-blue-50`}>
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(
                    siswaList.filter((siswa) =>
                      siswa.nama
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    ).length / itemsPerPage
                  )
                }
                className='px-3 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed'>
                {'>'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
