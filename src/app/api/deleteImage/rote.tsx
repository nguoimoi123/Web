import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const uploadDirectory = path.join(process.cwd(), 'public/images');

const deleteImage = (req: NextApiRequest, res: NextApiResponse) => {
  const { img_url } = req.body;
  const filePath = path.join(uploadDirectory, img_url.replace('/images/', ''));

  // Kiểm tra và xóa file
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting file.' });
    }
    return res.status(200).json({ message: 'Image deleted successfully.' });
  });
};

export default deleteImage;
