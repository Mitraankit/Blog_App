import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTimedError } from "../hooks/useTimedError";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useTimedError();
  const [formData, setFormData] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [publishError, setPublishError] = useTimedError();
  const { postId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}&status=all`);
        const data = await res.json();
        if (!res.ok) { setPublishError(data.message); return; }
        setPublishError(null);
        setFormData(data.posts[0]);
      } catch (error) {
        if (import.meta.env.DEV) console.error(error.message);
      }
    };
    fetchPost();
  }, [postId]);

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
      const currentTags = formData.tags || [];
      if (!currentTags.includes(tag)) {
        setFormData((prev) => ({ ...prev, tags: [...currentTags, tag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) =>
    setFormData((prev) => ({ ...prev, tags: (prev.tags || []).filter((t) => t !== tag) }));

  const handleUpdloadImage = () => {
    if (!file) { setImageUploadError("Please select an image"); return; }
    setImageUploadError(null);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setImageUploadProgress(((e.loaded / e.total) * 100).toFixed(0));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        setImageUploadProgress(null);
        setImageUploadError(null);
        setFormData((prev) => ({ ...prev, image: res.secure_url }));
      } else {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
      }
    };
    xhr.onerror = () => { setImageUploadError("Image upload failed"); setImageUploadProgress(null); };
    xhr.send(data);
  };

  const handleSubmit = async (e, status = formData.status || 'published') => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status }),
      });
      const data = await res.json();
      if (!res.ok) { setPublishError(data.message); return; }
      setPublishError(null);
      if (status === 'published') navigate(`/post/${data.slug}`);
      else navigate('/dashboard?tab=posts');
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text" placeholder="Title" required id="title" className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title || ''}
          />
          <TextInput
            type="text"
            placeholder="Category (e.g. travel, food, tech)"
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            value={formData.category || ''}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <TextInput
            type="text"
            placeholder="Add tags (press Enter or comma)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
          {(formData.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(formData.tags || []).map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 text-xs rounded-full border border-indigo-400 text-indigo-600">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-gray-400 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-indigo-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline onClick={handleUpdloadImage} disabled={imageUploadProgress}>
            {imageUploadProgress ? (
              <div className="w-16 h-16"><CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} /></div>
            ) : "Upload Image"}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && <img src={formData.image} alt="upload" className="w-full h-72 object-cover" />}

        <ReactQuill
          theme="snow" value={formData.content || ''} placeholder="Write something..."
          className="h-72 mb-12" required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <div className="flex gap-3">
          <Button type="submit" gradientDuoTone="purpleToBlue" className="flex-1"
            onClick={(e) => handleSubmit(e, 'published')}>
            Publish
          </Button>
          <Button type="button" color="gray" className="flex-1"
            onClick={(e) => handleSubmit(e, 'draft')}>
            Save as Draft
          </Button>
        </div>
        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
