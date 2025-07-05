const cloudinary = require('cloudinary').v2;

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'learnhub/images',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        filename: result.public_id,
        size: result.bytes,
        type: result.format
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading image'
    });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'learnhub/videos',
          transformation: [
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        duration: result.duration,
        format: result.format,
        size: result.bytes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading video'
    });
  }
}; 