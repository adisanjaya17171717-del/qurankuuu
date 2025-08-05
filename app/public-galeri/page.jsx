'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';
import { FaPlus, FaCloudUploadAlt, FaTimes, FaHeart, FaRegHeart, FaShare, FaDownload, FaSearch, FaTags, FaSpinner, FaImages } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import toast, { Toaster } from 'react-hot-toast';
// Custom lightbox component to replace react-image-lightbox
const CustomLightbox = ({ isOpen, mainSrc, nextSrc, prevSrc, onCloseRequest, onMovePrevRequest, onMoveNextRequest, imageTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={onCloseRequest}>
      <div className="relative max-w-screen max-h-screen" onClick={(e) => e.stopPropagation()}>
        <img 
          src={mainSrc} 
          alt={imageTitle}
          className="max-w-full max-h-screen object-contain"
        />
        <button
          onClick={onCloseRequest}
          className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
        >
          ×
        </button>
        {prevSrc && (
          <button
            onClick={onMovePrevRequest}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
          >
            ‹
          </button>
        )}
        {nextSrc && (
          <button
            onClick={onMoveNextRequest}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};
import CreatableSelect from 'react-select/creatable';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageMetadatas, setImageMetadatas] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likes, setLikes] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Fetch gambar dan kategori dari Supabase
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch gambar
      const { data: imagesData, error: imagesError } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!imagesError && imagesData) {
        setImages(imagesData);
        setFilteredImages(imagesData);
        const initialLikes = {};
        imagesData.forEach(img => {
          initialLikes[img.id] = false;
        });
        setLikes(initialLikes);
      }

      // Fetch kategori
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (!categoriesError && categoriesData) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data galeri");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes
    const galleryChannel = supabase
      .channel('realtime gallery')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'gallery'
      }, (payload) => {
        setImages(prev => [payload.new, ...prev]);
        setFilteredImages(prev => [payload.new, ...prev]);
        setLikes(prev => ({ ...prev, [payload.new.id]: false }));
        toast.success('Gambar baru ditambahkan!');
      })
      .subscribe();

    const categoryChannel = supabase
      .channel('realtime categories')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'categories'
      }, (payload) => {
        setCategories(prev => [...prev, payload.new]);
        toast.success('Kategori baru ditambahkan!');
      })
      .subscribe();

    return () => {
      galleryChannel.unsubscribe();
      categoryChannel.unsubscribe();
    };
  }, [fetchData]);

  // Handle pencarian dan filter kategori
  useEffect(() => {
    let results = images;
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(img => 
        img.name?.toLowerCase().includes(query) || 
        img.description?.toLowerCase().includes(query) ||
        img.category?.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      results = results.filter(img => img.category === selectedCategory.value);
    }
    
    setFilteredImages(results);
  }, [searchQuery, selectedCategory, images]);

  // Handle file selection (max 1 file)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => file.size <= 50 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      toast.error('Beberapa file melebihi 50MB dan diabaikan');
    }

    // Batasi hanya 1 file
    if (validFiles.length > 1) {
      toast.error('Maksimal 1 file per unggahan');
      validFiles.splice(1);
    }

    setSelectedFiles(validFiles);
    
    // Inisialisasi metadata untuk file pertama
    const initialMetadata = validFiles.slice(0, 1).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name.split('.')[0] || `Gambar ${index + 1}`,
      description: '',
      category: ''
    }));
    
    setImageMetadatas(initialMetadata);
  };

  // Handle update metadata
  const updateMetadata = (id, field, value) => {
    setImageMetadatas(prev => 
      prev.map(meta => 
        meta.id === id ? { ...meta, [field]: value } : meta
      )
    );
  };

  // Handle upload (single file)
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    // Validasi metadata untuk file pertama
    if (!imageMetadatas[0]?.name?.trim()) {
      toast.error('Harap beri nama untuk gambar');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      
      const res = await fetch('/api/cloud', {
        method: 'POST',
        body: formData
      });
      
      const result = await res.json();
      
      if (!result.success) throw new Error('Upload gagal');

      const galleryInsert = {
        url: result.url,
        provider: result.provider,
        name: imageMetadatas[0].name,
        description: imageMetadatas[0].description,
        category: imageMetadatas[0].category
      };

      const { error } = await supabase
        .from('gallery')
        .insert([galleryInsert]);

      if (error) throw error;

      // Simpan kategori baru ke supabase (jika ada)
      if (imageMetadatas[0].category) {
        const { error: categoryError } = await supabase
          .from('categories')
          .upsert(
            { name: imageMetadatas[0].category },
            { onConflict: 'name' }
          );

        if (categoryError) console.error('Error saving category:', categoryError);
      }

      resetUpload();
      toast.success('Berhasil mengunggah gambar!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload gagal: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFiles([]);
    setImageMetadatas([]);
    setShowUploadModal(false);
    setDragActive(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle drag and drop (max 1 file)
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      
      // Buat event tiruan untuk handleFileChange
      const event = {
        target: {
          files: files
        }
      };
      handleFileChange(event);
    }
  };

  // Toggle like
  const toggleLike = (imageId) => {
    setLikes(prev => ({ ...prev, [imageId]: !prev[imageId] }));
    toast.success(likes[imageId] ? 'Disukai dihapus' : 'Disukai!');
  };

  // Buka lightbox
  const openLightbox = (image, index) => {
    setActiveImage(image.url);
    setCurrentImageIndex(index);
  };

  // Tutup lightbox
  const closeLightbox = () => {
    setActiveImage(null);
    setCurrentImageIndex(0);
  };

  // Navigasi lightbox
  const moveNext = () => {
    if (filteredImages.length <= 1) return;
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setActiveImage(filteredImages[nextIndex].url);
  };

  const movePrev = () => {
    if (filteredImages.length <= 1) return;
    const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImageIndex(prevIndex);
    setActiveImage(filteredImages[prevIndex].url);
  };

  // Fungsi download gambar yang diperbaiki
  const downloadImage = async (url, filename) => {
    try {
      toast.loading('Mempersiapkan download...');
      
      // Fetch gambar sebagai blob
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Buat URL objek dari blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Buat elemen anchor untuk download
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || `gallery-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      
      // Bersihkan memori
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      
      toast.dismiss();
      toast.success('Download dimulai!');
    } catch (error) {
      toast.dismiss();
      toast.error('Gagal mendownload gambar');
      console.error('Download error:', error);
      
      // Fallback: Buka di tab baru jika teknik blob gagal
      window.open(url, '_blank');
    }
  };

  // Download gambar dengan event (untuk card)
  const handleCardDownload = (image, e) => {
    e.stopPropagation();
    downloadImage(image.url, `${image.name.replace(/\s+/g, '_')}.jpg`);
  };

  // Share gambar
  const shareImage = async (url) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Lihat gambar ini',
          url: url
        });
      } else {
        navigator.clipboard.writeText(url);
        toast.success('Link disalin ke clipboard!');
      }
    } catch (error) {
      console.error('Sharing failed', error);
      toast.error('Berbagi gagal');
    }
  };

  // Komponen grid card item
  const GalleryCard = ({ image, index }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <div 
        ref={ref}
        className={`relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white ${
          inView ? 'animate-fadeIn' : 'opacity-0'
        }`}
        onClick={() => openLightbox(image, index)}
      >
        <div className="relative aspect-square w-full">
          <Image
            src={image.url}
            alt={image.name || "Gallery item"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 8} // Prioritas gambar di atas fold
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-sm md:text-base truncate">{image.name}</h3>
              {image.category && (
                <span className="inline-block mt-1 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                  {image.category}
                </span>
              )}
            </div>
            
            <div className="flex gap-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(image.id);
                }}
                className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              >
                {likes[image.id] ? (
                  <FaHeart className="h-3 w-3 md:h-4 md:w-4 text-red-400" />
                ) : (
                  <FaRegHeart className="h-3 w-3 md:h-4 md:w-4" />
                )}
              </button>
              
              <button 
                onClick={(e) => handleCardDownload(image, e)}
                className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              >
                <FaDownload className="h-3 w-3 md:h-4 md:w-4" />
              </button>
            </div>
          </div>
          
          {image.description && (
            <p className="text-white text-xs mt-2 line-clamp-2">
              {image.description}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <Toaster position="top-right" toastOptions={{ 
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }
      }} />
      
      {/* Lightbox */}
      {activeImage && (
        <CustomLightbox
          isOpen={true}
          mainSrc={activeImage}
          nextSrc={filteredImages.length > 1 ? filteredImages[(currentImageIndex + 1) % filteredImages.length]?.url : undefined}
          prevSrc={filteredImages.length > 1 ? filteredImages[(currentImageIndex - 1 + filteredImages.length) % filteredImages.length]?.url : undefined}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={filteredImages.length > 1 ? movePrev : undefined}
          onMoveNextRequest={filteredImages.length > 1 ? moveNext : undefined}
          imageTitle={filteredImages[currentImageIndex]?.name || "Gambar"}
        />
      )}
      
      {/* Lightbox toolbar buttons - positioned over the lightbox */}
      {activeImage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2">
          <button 
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            onClick={() => downloadImage(
              activeImage, 
              `${filteredImages[currentImageIndex]?.name.replace(/\s+/g, '_')}.jpg`
            )}
          >
            <FaDownload />
          </button>
          <button 
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            onClick={() => toggleLike(filteredImages[currentImageIndex].id)}
          >
            {likes[filteredImages[currentImageIndex]?.id] ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
          </button>
          <button 
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            onClick={() => shareImage(activeImage)}
          >
            <FaShare />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            Galeri Publik
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Koleksi gambar inspiratif dari komunitas. Upload gambar Anda sendiri!
          </p>
        </div>
        
        <div className="flex flex-wrap justify-between gap-4 items-center">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari gambar..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaPlus className="h-4 w-4" />
              Unggah Gambar
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !selectedCategory 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
            }`}
          >
            Semua
          </button>
          
          {categories.slice(0, 8).map(category => (
            <button 
              key={category.id}
              onClick={() => setSelectedCategory({ value: category.name, label: category.name })}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory?.value === category.name 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-purple-600" />
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <GalleryCard key={image.id} image={image} index={index} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto flex items-center justify-center mb-6">
              <FaImages className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-800">Tidak ada hasil</h3>
            <p className="mt-2 text-gray-500">
              {searchQuery || selectedCategory 
                ? "Coba kata kunci lain atau filter berbeda" 
                : "Jadilah yang pertama mengunggah gambar ke galeri publik!"}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium py-2.5 px-6 rounded-xl shadow hover:shadow-md transition-all"
            >
              <FaCloudUploadAlt className="h-5 w-5" />
              Unggah Gambar
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="font-bold text-xl text-gray-800">Unggah Gambar Baru</h3>
              <button 
                onClick={resetUpload}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              {selectedFiles.length > 0 ? (
                <div className="mb-6">
                  {selectedFiles.slice(0, 1).map((file, index) => {
                    const metadata = imageMetadatas[index] || {};
                    return (
                      <div key={index} className="bg-gray-50 rounded-xl p-5">
                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 mb-5">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nama Gambar *
                            </label>
                            <input
                              type="text"
                              value={metadata.name || ''}
                              onChange={(e) => updateMetadata(metadata.id, 'name', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Berikan nama yang menarik"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Deskripsi (Opsional)
                            </label>
                            <textarea
                              value={metadata.description || ''}
                              onChange={(e) => updateMetadata(metadata.id, 'description', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Deskripsikan gambar ini..."
                              rows={2}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Kategori
                            </label>
                            <CreatableSelect
                              isClearable
                              options={categories.map(c => ({ value: c.name, label: c.name }))}
                              value={metadata.category ? { value: metadata.category, label: metadata.category } : null}
                              onChange={(option) => 
                                updateMetadata(metadata.id, 'category', option?.value || '')
                              }
                              onCreateOption={(newCategory) => {
                                updateMetadata(metadata.id, 'category', newCategory);
                              }}
                              placeholder="Pilih atau buat kategori baru..."
                              className="react-select-container"
                              classNamePrefix="react-select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  padding: '0.25rem',
                                  borderRadius: '0.75rem',
                                  borderColor: '#d1d5db',
                                  minHeight: '3rem'
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: '#9ca3af'
                                })
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedFiles.length} file dipilih
                  </p>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-xl p-10 text-center mb-4 cursor-pointer transition-all duration-300 ${
                    dragActive 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => fileInputRef.current.click()}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <FaCloudUploadAlt className={`h-16 w-16 mx-auto mb-4 ${
                    dragActive ? 'text-purple-500' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-lg mb-1">Klik atau tarik file ke sini</p>
                  <p className="text-sm text-gray-500">
                    Format: JPG, PNG, GIF (max 50MB per file, maks 1 file)
                  </p>
                  <button className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-xl transition-colors">
                    Pilih File
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/jpeg,image/png,image/gif"
                multiple
              />
            </div>
            
            <div className="p-5 border-t flex justify-between bg-gray-50">
              <button
                onClick={resetUpload}
                className="py-3 px-6 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors font-medium"
              >
                Batal
              </button>
              
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || uploading}
                className={`py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
                  selectedFiles.length > 0 && !uploading 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 text-current" />
                    Mengunggah...
                  </>
                ) : (
                  "Unggah Sekarang"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Upload Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-18 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 z-40"
        aria-label="Unggah gambar"
      >
        <FaCloudUploadAlt className="h-6 w-6" />
      </button>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

      `}</style>
    </div>
  );
};

export default GalleryPage;