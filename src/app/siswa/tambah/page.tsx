'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const kelasOptions = [
  'XII MIPA 1',
  'XII MIPA 2',
  'XII MIPA 3',
  'XII MIPA 4',
  'XII IPS 1',
  'XII IPS 2',
  'XII IPS 3',
  'XII IPS 4',
  'XII IPS 5',
  'XII IPS 6',
  'XII IPS 7'
];

export default function TambahSiswaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className='p-8'>
      <button
        onClick={toggleModal}
        className='px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors'>
        Tambah Siswa
      </button>

      <ModalTambahSiswa isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
}

function ModalTambahSiswa({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '',
    kelas: '',
    jenis_kelamin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/siswa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Siswa berhasil ditambahkan', {
          duration: 4000,
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
        router.push('/siswa');
      } else {
        throw new Error('Gagal menambahkan siswa');
      }
    } catch (error) {
      console.error('Error:', error);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-8'>
              Tambah Siswa
            </h1>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Nama Lengkap
                </label>
                <input
                  type='text'
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Kelas
                </label>
                <select
                  value={formData.kelas}
                  onChange={(e) =>
                    setFormData({ ...formData, kelas: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                  required
                  disabled={isSubmitting}>
                  <option value=''>Pilih Kelas</option>
                  {kelasOptions.map((kelas) => (
                    <option key={kelas} value={kelas}>
                      {kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Jenis Kelamin
                </label>
                <select
                  value={formData.jenis_kelamin}
                  onChange={(e) =>
                    setFormData({ ...formData, jenis_kelamin: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                  required
                  disabled={isSubmitting}>
                  <option value=''>Pilih Jenis Kelamin</option>
                  <option value='Laki-laki'>Laki-laki</option>
                  <option value='Perempuan'>Perempuan</option>
                </select>
              </div>

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  type='button'
                  onClick={onClose}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'>
                  Tutup
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors'
                  disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
