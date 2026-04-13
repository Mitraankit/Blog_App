import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Alert, Modal, FileInput } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { HiTrash } from 'react-icons/hi';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Gallery() {
  const { currentUser } = useSelector((state) => state.user);
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const fetchPhotos = async () => {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    if (res.ok) setPhotos(data);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setUploadError(null);
  };

  const handleUpload = () => {
    if (!file) {
      setUploadError('Please select a photo first');
      return;
    }
    setUploadError(null);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(((e.loaded / e.total) * 100).toFixed(0));
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        const res = await fetch('/api/gallery/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: result.secure_url }),
        });
        if (res.ok) {
          setUploadProgress(null);
          setFile(null);
          setPreviewUrl(null);
          fetchPhotos();
        }
      } else {
        setUploadError('Upload failed');
        setUploadProgress(null);
      }
    };

    xhr.onerror = () => {
      setUploadError('Upload failed');
      setUploadProgress(null);
    };

    xhr.send(data);
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/gallery/${confirmDelete}`, { method: 'DELETE' });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p._id !== confirmDelete));
      setConfirmDelete(null);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6 min-h-screen'>
      <h1 className='text-3xl font-semibold text-center my-8'>Gallery</h1>

      {currentUser?.isAdmin && (
        <div className='mb-10 p-6 border border-indigo-500 border-dashed rounded-xl flex flex-col items-center gap-4'>
          <p className='text-gray-500 text-sm'>Upload a new photo</p>
          <FileInput accept='image/*' onChange={handleFileChange} />
          {previewUrl && (
            <img
              src={previewUrl}
              alt='preview'
              className='w-40 h-40 object-cover rounded-lg'
            />
          )}
          {uploadError && <Alert color='failure'>{uploadError}</Alert>}
          <Button
            gradientDuoTone='purpleToBlue'
            onClick={handleUpload}
            disabled={!!uploadProgress}
          >
            {uploadProgress ? (
              <div className='w-10 h-10'>
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress}%`}
                />
              </div>
            ) : (
              'Upload Photo'
            )}
          </Button>
        </div>
      )}

      {photos.length === 0 ? (
        <p className='text-center text-gray-500'>No photos yet.</p>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {photos.map((photo) => (
            <div key={photo._id} className='relative group overflow-hidden rounded-xl'>
              <img
                src={photo.image}
                alt='gallery'
                className='w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer'
                loading='lazy'
                onClick={() => setLightbox(photo.image)}
              />
              {currentUser?.isAdmin && (
                <button
                  onClick={() => setConfirmDelete(photo._id)}
                  className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                >
                  <HiTrash size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <Modal show={!!confirmDelete} onClose={() => setConfirmDelete(null)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this photo?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDelete}>Yes, delete</Button>
              <Button color='gray' onClick={() => setConfirmDelete(null)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {lightbox && (
        <div
          className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt='full size'
            className='max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl object-contain'
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className='absolute top-4 right-6 text-white text-3xl font-bold hover:text-gray-300'
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
