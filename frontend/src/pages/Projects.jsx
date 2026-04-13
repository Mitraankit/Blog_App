import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Alert, Modal, TextInput, Textarea, FileInput } from 'flowbite-react';
import { HiTrash } from 'react-icons/hi';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Projects() {
  const { currentUser } = useSelector((state) => state.user);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', link: '' });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (res.ok) setProjects(data);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setUploadError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) { setUploadError('Please select a project image'); return; }
    if (!formData.title || !formData.description || !formData.link) {
      setSubmitError('All fields are required'); return;
    }
    setUploadError(null);
    setSubmitError(null);

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
        const res = await fetch('/api/projects/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, image: result.secure_url }),
        });
        if (res.ok) {
          setUploadProgress(null);
          setFile(null);
          setPreviewUrl(null);
          setFormData({ title: '', description: '', link: '' });
          setShowForm(false);
          fetchProjects();
        } else {
          const err = await res.json();
          setSubmitError(err.message);
          setUploadProgress(null);
        }
      } else {
        setUploadError('Image upload failed');
        setUploadProgress(null);
      }
    };

    xhr.onerror = () => {
      setUploadError('Image upload failed');
      setUploadProgress(null);
    };

    xhr.send(data);
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/projects/${confirmDelete}`, { method: 'DELETE' });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p._id !== confirmDelete));
      setConfirmDelete(null);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6 min-h-screen'>
      <h1 className='text-3xl font-semibold text-center my-8'>Projects</h1>

      {currentUser?.isAdmin && (
        <div className='flex justify-center mb-8'>
          <Button gradientDuoTone='purpleToBlue' onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Project'}
          </Button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className='mb-10 p-6 border border-indigo-500 border-dashed rounded-xl flex flex-col gap-4 max-w-xl mx-auto'
        >
          <TextInput
            placeholder='Project title'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            placeholder='Project description'
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <TextInput
            placeholder='Project URL (https://...)'
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
          />
          <FileInput accept='image/*' onChange={handleFileChange} />
          {previewUrl && (
            <img src={previewUrl} alt='preview' className='w-full h-48 object-cover rounded-lg' />
          )}
          {uploadError && <Alert color='failure'>{uploadError}</Alert>}
          {submitError && <Alert color='failure'>{submitError}</Alert>}
          <Button type='submit' gradientDuoTone='purpleToBlue' disabled={!!uploadProgress}>
            {uploadProgress ? (
              <div className='w-10 h-10'>
                <CircularProgressbar value={uploadProgress} text={`${uploadProgress}%`} />
              </div>
            ) : (
              'Save Project'
            )}
          </Button>
        </form>
      )}

      {projects.length === 0 ? (
        <p className='text-center text-gray-500'>No projects yet.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.map((project) => (
            <div
              key={project._id}
              className='relative group border border-indigo-500 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
              onClick={() => window.open(project.link, '_blank')}
            >
              <img
                src={project.image}
                alt={project.title}
                className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
              />
              <div className='p-4 flex flex-col gap-2'>
                <h2 className='text-lg font-semibold'>{project.title}</h2>
                <p className='text-sm text-gray-500 line-clamp-2'>{project.description}</p>
                <span className='text-xs text-indigo-500 font-medium'>Click to view →</span>
              </div>
              {currentUser?.isAdmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(project._id); }}
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
              Are you sure you want to delete this project?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDelete}>Yes, delete</Button>
              <Button color='gray' onClick={() => setConfirmDelete(null)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
