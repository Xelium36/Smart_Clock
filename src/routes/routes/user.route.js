import {Router} from 'express';
import{listUsers,getOneUser,createOneUser,updateOneUser,deleteOneUser} from '../../controllers/user.controller.js';

const router = Router();

router.get('/', listUsers);
router.get('/:userId', getOneUser);
router.post('/', createOneUser);
router.patch('/:userId', updateOneUser);
router.delete('/:userId', deleteOneUser);
router . get ("/", listUser ) ;
router . post ("/", createUser ) ;


export default router;