import multer from 'multer';

//usage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

//exporting
export const upload = multer({
     storage, 
})