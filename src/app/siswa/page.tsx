'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type FormData = {
  nama: string;
  kelas: string;
  jenis_kelamin: string;
};

type Siswa = {
  id: number;
  nama: string;
  kelas: string;
  jenis_kelamin: string;
};

export default function SiswaPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [filteredSiswa, setFilteredSiswa] = useState<Siswa[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    kelas: '',
    jenis_kelamin: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = siswa.filter((s) =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSiswa(filtered);
    setCurrentPage(1);
  }, [searchQuery, siswa]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSiswa.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSiswa.length / itemsPerPage);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/siswa');
      const data = await response.json();
      setSiswa(data);
      toast.success('Data siswa berhasil dimuat', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px'
        }
      });
    } catch (error) {
      console.error('Gagal mengambil data siswa:', error);
      toast.error('Gagal memuat data siswa', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#ef4444',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/siswa/${id}`, {
        method: 'DELETE'
      });
      fetchData();
      toast.success('Siswa berhasil dihapus', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px'
        }
      });
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Gagal menghapus siswa:', error);
      toast.error('Gagal menghapus siswa', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#ef4444',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px'
        }
      });
    }
  };

  const confirmDelete = (siswa: Siswa) => {
    setSelectedSiswa(siswa);
    setShowDeleteModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return;

    try {
      const response = await fetch(`/api/siswa/${selectedSiswa.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Gagal mengupdate siswa');

      fetchData();
      setShowEditModal(false);
      setFormData({
        nama: '',
        kelas: '',
        jenis_kelamin: ''
      });

      toast.success('Data siswa berhasil diupdate', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px'
        }
      });
    } catch (error) {
      console.error('Gagal mengupdate siswa:', error);
      toast.error('Gagal mengupdate data siswa', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#ef4444',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px'
        }
      });
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/siswa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Gagal menambahkan siswa');

      fetchData();
      setShowAddModal(false);
      setFormData({
        nama: '',
        kelas: '',
        jenis_kelamin: ''
      });

      toast.success('Siswa berhasil ditambahkan', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px'
        }
      });
    } catch (error) {
      console.error('Gagal menambahkan siswa:', error);
      toast.error('Gagal menambahkan siswa', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#ef4444',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px'
        }
      });
    }
  };

  return (
    <div className='p-8'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-colors duration-300'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
          <h1 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>
            Daftar Siswa
          </h1>
          <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
            <input
              type='text'
              placeholder='Cari siswa...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 transition-colors duration-300'
            />
            <button
              onClick={() => setShowAddModal(true)}
              className='px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95 flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              Tambah Siswa
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className='space-y-4'>
            <div className='animate-pulse space-y-4'>
              <div className='h-12 bg-gray-100 dark:bg-gray-700 rounded-lg'></div>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='h-16 bg-gray-100 dark:bg-gray-700 rounded-lg'></div>
              ))}
            </div>
            <div className='text-center py-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 dark:border-gray-600 mx-auto mb-4'></div>
              <p className='text-gray-600 dark:text-gray-400'>
                Memuat data siswa...
              </p>
            </div>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <div className='border-b border-gray-200 dark:border-gray-700'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-700/50 sticky top-0 backdrop-blur-sm'>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400'>
                      Nama
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400'>
                      Kelas
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400'>
                      Jenis Kelamin
                    </th>
                    <th className='px-4 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400'>
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((s) => (
                    <tr
                      key={s.id}
                      className='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150'>
                      <td className='px-4 py-1.5 text-xs text-gray-700 dark:text-gray-300'>
                        {s.nama}
                      </td>
                      <td className='px-4 py-1.5 text-xs text-gray-600 dark:text-gray-400'>
                        {s.kelas}
                      </td>
                      <td className='px-4 py-1.5 text-xs text-gray-600 dark:text-gray-400'>
                        {s.jenis_kelamin}
                      </td>
                      <td className='px-4 py-2 text-right'>
                        <div className='flex gap-2 justify-end'>
                          <button
                            onClick={() => {
                              setSelectedSiswa(s);
                              setShowEditModal(true);
                              setFormData({
                                nama: s.nama,
                                kelas: s.kelas,
                                jenis_kelamin: s.jenis_kelamin
                              });
                            }}
                            className='px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-900/30 rounded-md transition-all duration-150 flex items-center gap-1 hover:scale-[1.02] active:scale-95 hover:shadow-sm'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-4 w-4'
                              viewBox='0 0 20 20'
                              fill='currentColor'>
                              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(s)}
                            className='px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-900/30 rounded-md transition-all duration-150 flex items-center gap-1 hover:scale-[1.02] active:scale-95 hover:shadow-sm'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-4 w-4'
                              viewBox='0 0 20 20'
                              fill='currentColor'>
                              <path
                                fillRule='evenodd'
                                d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                clipRule='evenodd'
                              />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className='flex flex-col sm:flex-row justify-between items-center mt-6 gap-4'>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                Menampilkan {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredSiswa.length)} dari{' '}
                {filteredSiswa.length} siswa
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className='px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100/70 dark:hover:bg-blue-900/40 transition-all duration-200 active:scale-95 flex items-center gap-2 border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Sebelumnya
                </button>

                <div className='flex gap-1'>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        currentPage === i + 1
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30'
                          : 'text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-900/40'
                      } transition-all duration-200`}>
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className='px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100/70 dark:hover:bg-blue-900/40 transition-all duration-200 active:scale-95 flex items-center gap-2 border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed'>
                  Selanjutnya
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedSiswa && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm'>
              <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100 mb-6'>
                Konfirmasi Hapus
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mb-8 leading-relaxed'>
                Apakah Anda yakin ingin menghapus siswa{' '}
                <span className='font-medium text-gray-800 dark:text-gray-200'>
                  {selectedSiswa.nama}
                </span>
                ? Aksi ini tidak dapat dibatalkan.
              </p>
              <div className='flex justify-end gap-4'>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className='px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200'>
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(selectedSiswa.id)}
                  className='px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200'>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditModal && selectedSiswa && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl p-8 max-w-md w-full shadow-2xl'>
              <h2 className='text-xl font-bold text-gray-800 mb-6'>
                Edit Data Siswa
              </h2>
              <form onSubmit={handleEdit} className='space-y-6'>
                <div>
                  <label
                    htmlFor='nama'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Nama Siswa
                  </label>
                  <input
                    type='text'
                    id='nama'
                    name='nama'
                    value={formData.nama}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='kelas'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Kelas
                  </label>
                  <select
                    id='kelas'
                    name='kelas'
                    value={formData.kelas}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    required>
                    <option value=''>Pilih Kelas</option>
                    {[...Array(4)].map((_, i) => (
                      <option key={`mipa-${i + 1}`} value={`XII MIPA ${i + 1}`}>
                        XII MIPA {i + 1}
                      </option>
                    ))}
                    {[...Array(7)].map((_, i) => (
                      <option key={`ips-${i + 1}`} value={`XII IPS ${i + 1}`}>
                        XII IPS {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='jenis_kelamin'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Jenis Kelamin
                  </label>
                  <select
                    id='jenis_kelamin'
                    name='jenis_kelamin'
                    value={formData.jenis_kelamin}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    required>
                    <option value=''>Pilih Jenis Kelamin</option>
                    <option value='Laki-laki'>Laki-laki</option>
                    <option value='Perempuan'>Perempuan</option>
                  </select>
                </div>

                <div className='flex justify-end gap-4'>
                  <button
                    type='button'
                    onClick={() => setShowEditModal(false)}
                    className='px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200'>
                    Batal
                  </button>
                  <button
                    type='submit'
                    className='px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200'>
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Student Modal */}
        {showAddModal && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl p-8 max-w-md w-full shadow-2xl'>
              <h2 className='text-xl font-bold text-gray-800 mb-6'>
                Tambah Siswa Baru
              </h2>
              <form onSubmit={handleAdd} className='space-y-6'>
                <div>
                  <label
                    htmlFor='nama'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Nama Siswa
                  </label>
                  <input
                    type='text'
                    id='nama'
                    name='nama'
                    value={formData.nama}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='kelas'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Kelas
                  </label>
                  <select
                    id='kelas'
                    name='kelas'
                    value={formData.kelas}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    required>
                    <option value=''>Pilih Kelas</option>
                    {[...Array(4)].map((_, i) => (
                      <option key={`mipa-${i + 1}`} value={`XII MIPA ${i + 1}`}>
                        XII MIPA {i + 1}
                      </option>
                    ))}
                    {[...Array(7)].map((_, i) => (
                      <option key={`ips-${i + 1}`} value={`XII IPS ${i + 1}`}>
                        XII IPS {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='jenis_kelamin'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Jenis Kelamin
                  </label>
                  <select
                    id='jenis_kelamin'
                    name='jenis_kelamin'
                    value={formData.jenis_kelamin}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    required>
                    <option value=''>Pilih Jenis Kelamin</option>
                    <option value='Laki-laki'>Laki-laki</option>
                    <option value='Perempuan'>Perempuan</option>
                  </select>
                </div>

                <div className='flex justify-end gap-4'>
                  <button
                    type='button'
                    onClick={() => setShowAddModal(false)}
                    className='px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200'>
                    Batal
                  </button>
                  <button
                    type='submit'
                    className='px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200'>
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
