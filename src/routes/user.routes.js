// Router
//importing router from express

import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router = Router()  // same as const app = express()

//usage and work
router.route("/register").post(registerUser)

//exporting must
export default router 

//where to import these router and controllers
//basically in app.js so that index.js should have clean code