/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import ProfilesController from '#controllers/profiles_controller'
import { middleware } from '#start/kernel'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})


router.post('/register', [AuthController,"register"])
router.post('/login', [AuthController,"login"])
router.post('/logout', [AuthController,"logout"]).use(middleware.auth({
  guards:['api']
}))

router.get('/user/viewProfile', [ProfilesController,"viewProfile"]).use(middleware.auth({
  guards:['api']
}))

router.get('/user/viewProfile/:id', [ProfilesController,"viewSingleProfile"]).use(middleware.auth({
  guards:['api']
}))
router.post('/user/createprofile', [ProfilesController,"createprofile"]).use(middleware.auth({
  guards:['api']
}))
router.put('/user/updateProfile/:id', [ProfilesController,"updateProfile"]).use(middleware.auth({
  guards:['api']
}))
router.delete('/user/deleteProfile', [ProfilesController,"deleteProfile"]).use(middleware.auth({
  guards:['api']
}))



