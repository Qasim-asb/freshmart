import cloudinary from '../config/cloudinary.js'

export const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, { folder: 'freshmart' })
  return {
    public_id: result.public_id,
    url: result.secure_url
  }
}

export const deleteFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId)
}
