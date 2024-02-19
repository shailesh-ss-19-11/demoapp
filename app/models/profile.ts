import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public user_id: number

  @column()
  public mobile: number
  
  @column()
  public name: number

  @column()
  public gender: number

  @column()
  public dob: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
