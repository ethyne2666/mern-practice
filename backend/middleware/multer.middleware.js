import multer from 'multer';

//using disk storage engine to store files on disk using multer
//cb is a callback function

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage, })