"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";

export default function KonversiPage() {
  const [input, setInput] = useState("");
  const [minRange, setMinRange] = useState(85);
  const [maxRange, setMaxRange] = useState(95);
  const [convertedNumbers, setConvertedNumbers] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [fileInputCount, setFileInputCount] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = e.target?.result;
      if (fileData) {
        try {
          const workbook = XLSX.read(fileData, { type: 'binary' });
          
          const allData: { name: string, number: string, sheet: string }[] = [];
          const sheetNames = workbook.SheetNames;
          
          sheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
            
            const sheetData = json
              .slice(1)
              .map((row) => ({
                name: row[0]?.toString() || `Peserta ${json.indexOf(row)}`,
                number: row[1]?.toString() || '',
                sheet: sheetName
              }))
              .filter(item => item.number.trim() !== '');
              
            allData.push(...sheetData);
          });

          const numbers = allData.map(item => item.number);
          const names = allData.map(item => item.name);
          const sheets = allData.map(item => item.sheet);

          setInput(numbers.join(", "));
          setNames(names);
          setSheets(sheets);
          setFileInputCount(numbers.length);
          setError("");
        } catch {
          setError("Gagal membaca file Excel");
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  const convertNumbers = () => {
    setError("");
    try {
      const numbers = input
        .split(",")
        .map(str => parseFloat(str.trim()))
        .filter(num => !isNaN(num));

      if (numbers.length === 0) {
        throw new Error("Masukkan angka yang valid");
      }

      if (minRange >= maxRange) {
        throw new Error("Angka minimal harus lebih kecil dari angka maksimal");
      }

      const minInput = Math.min(...numbers);
      const maxInput = Math.max(...numbers);

      const converted = numbers.map(num => {
        const normalized = (num - minInput) / (maxInput - minInput);
        return Math.round(minRange + normalized * (maxRange - minRange));
      });

      setConvertedNumbers(converted);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat mengkonversi angka");
      }
      setConvertedNumbers([]);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(convertedNumbers.join(", "));
  };

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    const groupedData: { [key: string]: string[][] } = {};
    input.split(",").forEach((num, i) => {
      const sheetName = sheets[i] || "Sheet1";
      if (!groupedData[sheetName]) {
        groupedData[sheetName] = [
          ["Nama Lengkap", "Angka Acak", "Hasil Konversi"]
        ];
      }
      groupedData[sheetName].push([
        names[i] || `Peserta ${i+1}`,
        num.trim(),
        convertedNumbers[i].toString()
      ]);
    });

    Object.entries(groupedData).forEach(([sheetName, data]) => {
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, "hasil_konversi.xlsx");
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4'>
      <div className='bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-2xl w-full max-w-md border border-white/20'>
        <h1 className='text-2xl font-bold mb-4 text-center bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent'>
          Untuk Menyenangkan Kamu
        </h1>

        <div className='space-y-2'>
          <div>
            <label htmlFor='numbers' className='block font-semibold mb-2'>
              Masukkan angka (pisahkan dengan koma):
            </label>
            <div className='space-y-4'>
              <div>
                <input
                  type='file'
                  id='fileInput'
                  className='hidden'
                  accept='.xlsx, .xls'
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <label
                  htmlFor='fileInput'
                  className='w-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center text-sm'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 mr-2'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Upload File Excel
                </label>
                <div className='mt-2 text-center text-sm'>
                  <a
                    href='/template_upload.xlsx'
                    download
                    className='text-blue-600 hover:text-blue-800 hover:underline'>
                    Download Template Excel
                  </a>
                </div>
              </div>

              <div className='text-center text-sm text-gray-500 my-2'>atau</div>

              <textarea
                id='numbers'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[80px] text-sm'
                placeholder='Masukkan angka secara manual (pisahkan dengan koma)'
              />
              {fileInputCount > 0 && (
                <div className='text-sm text-gray-500'>
                  {fileInputCount} angka berhasil diinput dari file Excel
                </div>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label htmlFor='min' className='block font-semibold mb-2'>
                Angka Minimal:
              </label>
              <input
                type='number'
                id='min'
                value={minRange}
                onChange={(e) => setMinRange(parseInt(e.target.value))}
                className='w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm'
              />
            </div>
            <div>
              <label htmlFor='max' className='block font-semibold mb-2'>
                Angka Maksimal:
              </label>
              <input
                type='number'
                id='max'
                value={maxRange}
                onChange={(e) => setMaxRange(parseInt(e.target.value))}
                className='w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm'
              />
            </div>
          </div>

          {error && <div className='text-red-500 text-sm'>{error}</div>}

          <button
            onClick={convertNumbers}
            className='w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-md text-sm'>
            Konversi
          </button>

          {convertedNumbers.length > 0 && (
            <div>
              <div className='flex justify-between items-center mb-1'>
                <h2 className='font-semibold'>Hasil Konversi:</h2>
                <div className='flex gap-2'>
                  <button
                    onClick={copyResult}
                    className='text-xs bg-blue-50 backdrop-blur-sm border border-blue-200 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-all shadow-sm hover:shadow-md active:scale-95 active:opacity-80 text-blue-700 hover:text-blue-800'>
                    Copy
                  </button>
                  <button
                    onClick={downloadExcel}
                    className='text-xs bg-green-50 backdrop-blur-sm border border-green-200 px-2.5 py-1 rounded-md hover:bg-green-100 transition-all shadow-sm hover:shadow-md flex items-center gap-1 active:scale-95 active:opacity-80 text-green-700 hover:text-green-800'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z'
                      />
                    </svg>
                    Excel
                  </button>
                </div>
              </div>
              <textarea
                value={convertedNumbers.join(', ')}
                readOnly
                className='w-full p-2 border-2 border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[80px] text-sm'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
