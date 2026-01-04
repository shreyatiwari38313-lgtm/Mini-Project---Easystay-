
import { Router } from 'express';
import { registerUser, getAllUsers, deleteUser } from '../controllers/user.controller.js';

const router = Router();

// Routes for APIs
// Mounted at /api/v1/users in app.js
router.route('/register').post(registerUser);
router.route('/').get(getAllUsers);        // GET all users
router.route('/:id').delete(deleteUser);   // DELETE user by ID


export default router;








































// // Router
// //importing router from express

// import { Router } from 'express';
// import { registerUser } from '../controllers/user.controller.js';

// const router = Router()  // same as const app = express()

// //usage and work
// router.route("/register").post(registerUser)

// //exporting must
// export default router 

// //where to import these router and controllers
// //basically in app.js so that index.js should have clean code