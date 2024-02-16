import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine';
import Profile from '#models/profile';
export default class ProfilesController {
    async createprofile({ request, response }: HttpContext) {
        let userprofile = await Profile.findBy('mobile', request.body().mobile)
        if (userprofile) {
            return response.json({ message: "mobile number already exist" })
        }

        let validateData = await this.validation(request.body())
        let req = request.body();
        const newUser = request.all() as Partial<Profile>
        const user = await Profile.create(newUser)
        return user;
    }
    async updateProfile({ request, response }: HttpContext) {
        let validateData = await this.validation(request.body())
        // let id = request.params('id');
        // return request.params('id').id;
        const profile = await Profile.findBy('id', request.params('id').id)

        if (!profile) {
            response.abort('Invalid User')
        }
        let profileData = await Profile.query().where('id', request.params('id').id).update(request.body())

        // let profileData = await Profile.save(request.body());
        if (profileData) {
            return {
                message: "successfully updated",
            };
        }
    }
    async deleteProfile({ request }: HttpContext) {
        const profile = await Profile.findBy('mobile', request.body().mobile)
        if (!profile) {
            return {
                message: "invalid phone number"
            }
        }
        let profileData = await Profile.query().where('mobile', request.body().mobile).delete();
        return { message: "Profile Deleted Successfully" };
    }

    async viewProfile({ request }: HttpContext) {
        let profiles = await Profile.all()
        console.log(profiles)
        return profiles.map((profile) => {
            return {
                name: profile?.name,
                mobile: profile?.mobile,
                gender: profile?.gender,
                dob: profile?.dob,
            }
        })
        // return profile;
    }

    async viewSingleProfile({ request }: HttpContext) {
        console.log(request.params().id)
        const profile = await Profile.findBy('id', request.params().id)
        const obj = {
            name: profile?.name,
            mobile: profile?.mobile,
            gender: profile?.gender,
            dob: profile?.dob,
        }

        return obj;
    }

    validation(data: any) {
        let dt = vine.compile(
            vine.object({
                name: vine.string().trim().minLength(3).maxLength(30),
                dob: vine.date({
                    formats: ['DD-MM-YYYY', 'x']
                }),
                mobile: vine.string().mobile().minLength(10).maxLength(10),
                gender: vine.string().regex(new RegExp('^(?:FEMALE|MALE)$')),
            })
        );

        const payload = dt.validate(data)
        return payload;
    }
}