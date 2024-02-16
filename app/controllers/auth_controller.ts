import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine';
// import dbConfig from './../../config/database.js'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user';
import auth from '@adonisjs/auth/services/main';
import { AccessToken } from '@adonisjs/auth/access_tokens';

export default class AuthController {


  // async chkDb() {
  //     console.log(dbConfig);
  // }

  async login({ request, response, auth }: HttpContext) {

    console.log(AccessToken)
    const { email, password } = request.only(['email', 'password'])
    let user = await User.findBy('email', email)
    if (!user) {
      response.abort('Invalid credentials')
    }
    await hash.verify(user.password, password)
    const user_data = await User.verifyCredentials(email, password);
    const token = await User.accessTokens.create(user_data)

    return {
      type: 'bearer',
      userId: user_data.id,
      value: token.value!.release(),
      tokens: User.accessTokens.all(auth.user!)
    }
    return user_data;
    /**
     * Now login the user or create a token for them
     */
  }

  async register({ request,response }: HttpContext) {
    let validateData = await this.validation(request.body())

    let isuserexist = await User.findBy('email', request.body().email)
    if(isuserexist){
      return response.json({message:"email already exist"})
    }

    const newUser = request.all() as Partial<User>
    const user = await User.create(newUser)
    return { email: user.email, id: user.id, message: "user created successfully" };

  }

  // async logout({ request }: HttpContext) { 
  //   // console.log(request.headers().authorization);
  //   return request.headers().authorization;
  //   // const { email } = request.only(['email'])
  //   // let user = await User.findBy('email', email)

  //   // if (!user) {
  //   //   response.abort('Invalid credentials')
  //   // }

  //   await User.accessTokens.delete(user, request.headers().authorization);
  //   // return await User.accessTokens.all(user!)
  // }

  public async logout({ request, response, auth }: HttpContext) {

    console.log(request.headers())
    const profileData = await User.findBy('email', request.body().email);
    const getUser = profileData.id;
    const user = await User.findOrFail(getUser)
    await User.accessTokens.delete(profileData, user.id)
    await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()
    
    console.log('====================================');
    // console.log(dbData);
    console.log('====================================');
    return response.ok({
      success: true,
      message: 'User logged out',
      data: getUser
    })
  }

  validation(data: any) {
    let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/
    let dt = vine.compile(
      vine.object({
        email: vine.string().email(),
        password: vine.string().regex(new RegExp(regex))
      })
    );


    const payload = dt.validate(data)
    return payload;
  }
}

