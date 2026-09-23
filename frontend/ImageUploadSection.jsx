// Frontend/src/components/ImageUploadSection.jsx
import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/api';
import { motion } from 'framer-motion';

const ImageUploadSection = ({ onImageAnalysisResult, onLoadingChange, onError }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        onError("Invalid file type. Please upload a JPG, PNG, or JPEG image.");
        setImagePreview(null);
        setSelectedFile(null);
        return;
      }

      // Validate file size (10MB limit)
      const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE_BYTES) {
        onError("File size exceeds 10MB limit.");
        setImagePreview(null);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      onError(null); // Clear previous errors
    } else {
      setImagePreview(null);
      setSelectedFile(null);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      onError("Please select an image to analyze.");
      return;
    }
    onLoadingChange(true);
    try {
      const result = await analyzeImage(selectedFile);
      onImageAnalysisResult(result);
      setImagePreview(null); // Clear preview after analysis
      setSelectedFile(null);
      fileInputRef.current.value = ''; // Clear file input
    } catch (err) {
      onError(err.response?.data?.detail || "Failed to analyze image. Please try again.");
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 p-4 rounded-lg shadow-md mb-4 border border-white/10"
    >
      <h3 className="text-lg font-semibold mb-2 text-white">Disease Image Identification</h3>
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="block w-full text-sm text-gray-300
                   file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                   file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-200
                   hover:file:bg-blue-500/30 transition-colors cursor-pointer"
      />
      {imagePreview && (
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-gray-200">Image Preview:</h4>
          <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-md border border-gray-600" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAnalyzeImage}
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Analyze Image
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default ImageUploadSection;