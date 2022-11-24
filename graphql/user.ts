import { GraphQLSchemaModule } from 'apollo-server-core'
import { findAll, findById, findSome, totalCount } from './utils'
import { gql } from 'apollo-server-express'
import { group as groupInit } from '../models/group'
import { userAttributes, user as userInit } from '../models/user'
import { user_group as user_groupInit } from '../models/user_group'
import { view_group as view_groupInit } from '../models/view_group'

import crypto from 'crypto'
import nodemailer from 'nodemailer'

type UZIVATEL = ReturnType<typeof userInit.initModel>

const getHash = (password: string) =>
  crypto.pbkdf2Sync(password, process.env.SALT!, 1000, 64, `sha512`).toString(`hex`)

export const userGraphql = (dbTable: UZIVATEL): GraphQLSchemaModule => {
  const salt = process.env.SALT!
  return {
    typeDefs: gql`
      input userInput {
        id: Int
        created_at: Date
        password: String
        first_name: String
        surname: String
        address: String
        code: String
        city: String
        state: String
        email: String
      }
      extend type Query {
        users(offset: Int, limit: Int): [user]
        findSomeUser(offset: Int, limit: Int, order: String): [user]
        user(id: Int!): user
        totalCountUser: Int
        Login(email: String, password: String): loginretval
        Logout(id: Int, email: String): Boolean
      }
      extend type Mutation {
        setGroupAktualni(id: Int): Boolean
        insertUser(
          password: String
          first_name: String
          surname: String
          address: String
          code: String
          city: String
          state: String
          email: String
        ): Int!
        updateSelf(
          first_name: String
          surname: String
          address: String
          code: String
          city: String
          state: String
          email: String
        ): Int!
        deleteUser(where: whereId): Boolean!
        Register(email: String, lang: String, id_group: Int): retval
        SetPassword(password: String, newPassword: String): loginretval
      }
      type user {
        first_name: String
        surname: String
        address: String
        code: String
        city: String
        state: String
        email: String
      }
      type retval {
        error: String
        data: String
        message: String
      }
      type loginretval {
        error: String
        data: dataretval
        message: String
      }
      type dataretval {
        id: String
        email: String
        roles: [String]
      }
    `,
    resolvers: {
      Query: {
        users: async (obj: any, args: any, context: any, info: any) =>
          await findAll(dbTable, args.limit || 10, args.offset || 0),
        findSomeUser: async (obj: any, args: any, context: any, info: any) =>
          await findSome(dbTable, args.order || 'id', args.offset || 0, args.limit || 10),
        user: async (obj: any, args: any, context: any, info: any) =>
          (await findById(dbTable, args.id)) as userAttributes,
        totalCountUser: async (obj: any, args: any, context: any, info: any) =>
          await totalCount(dbTable),
        Login: async (obj: any, args: any, context: any, info: any) => {
          try {
            const hash = getHash(args.password)
            const view_group = await view_groupInit.findOne({
              attributes: ['id_user', 'id_user_type', 'user_type_name', 'id_group_actual'],
              where: { email: args.email, password: hash },
            })
            if (view_group) {
              context.session.user = {
                id: view_group.getDataValue('id_user'),
                email: args.email,
                role: view_group.getDataValue('id_user_type'),
                actual: view_group.getDataValue('id_group_actual'),
              }
              return {
                error: '',
                data: {
                  id: view_group.getDataValue('id_user'),
                  email: args.email,
                  roles: [view_group.getDataValue('user_type_name')],
                },
                message: 'Logged in',
              }
            }
          } catch (error) {
            return {
              error: (error as any).message,
              data: { id: '', email: '', roles: [] },
              message: '',
            }
          }
        },
        Logout: (obj: any, args: any, context: any, info: any) => {
          if (args.id !== context.sesssion.user.id || args.email !== context.session.user.email)
            return false
          context.session.user = {}
          return true
        },
      },
      Mutation: {
        setGroupAktualni: async (obj: any, args: any, context: any, info: any) => {
          const id_group = (
            await view_groupInit.findOne({
              attributes: ['id_group'],
              where: { id_user: context.session.user.id, id_group: args.id },
            })
          )?.getDataValue('id_group')
          if (id_group !== args.id) return false
          const [affectedCount] = await dbTable.update(
            { id_group_actual: args.id },
            { where: { id: context.session.user.id } }
          )
          if (affectedCount < 1) return false
          context.session.user.actual = args.id
          return true
        },
        insertUser: async (obj: any, args: any, context: any, info: any) =>
          (await dbTable.create(Object.assign(args))).id,
        updateSelf: async (obj: any, args: any, context: any, info: any) =>
          (await dbTable.update(args, { where: { id: context.session.user.id } }))[0],
        // .then(async (ret: Promise<[number]>) => {
        //   return (await ret)[0]
        // }),
        deleteUser: async (obj: any, args: any, context: any, info: any) =>
          await dbTable
            .destroy({
              where: args.where,
            })
            .then(() => {
              return true
            }),
        SetPassword: async (obj: any, args: any, context: any, info: any) => {
          if (
            (
              await dbTable.update(
                { password: getHash(args.newPassword) },
                { where: { password: getHash(args.password), id: context.session.user.id } }
              )
            )[0] === 1
          )
            return {
              errro: '',
              data: { id: context.session.user.id, email: context.session.user.email },
              message: 'password updated',
            }
          else
            return { errro: '', data: { id: args.id, email: '' }, message: 'password not updated' }
        },
        Register: async (obj: any, args: any, context: any, info: any) => {
          try {
            let userId = 0
            let groupId = args.id_group || 0
            let password = ''
            if (args.email)
              userId =
                (
                  await userInit.findOne({ attributes: ['id'], where: { email: args.email } })
                )?.getDataValue('id') || 0
            if (userId !== 0) {
              if (!args.id_group)
                return {
                  error: 'Uživatel již existuje',
                  data: '',
                  message: 'Uživatel již existuje',
                }
              userId = args.id_group
            } else {
              password = crypto
                .pbkdf2Sync(crypto.randomBytes(16), salt, 1000, 64, `sha512`)
                .toString('hex')
                .substring(0, 10)
              const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`)

              const user = await userInit.create({
                id_group_actual: groupId,
                email: args.email,
                password: hash,
              })

              userId = user.id

              user.save()

              if (groupId === 0) {
                const group = await groupInit.create({
                  name: '',
                  created_by: userId,
                })

                groupId = group.id

                group.save()

                await userInit.update({ id_group_actual: groupId }, { where: { id: userId } })
              }
            }
            const user_group = await user_groupInit.create({
              id_user: userId,
              id_group: groupId,
            })

            user_group.save()

            if (args.id_group && password === '')
              return { error: '', data: '', message: 'Uživatel byl přidán do skupiny.' }

            const transporter = nodemailer.createTransport({
              host: 'smtp10.onebit.cz',
              port: 587,
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
              },
            })

            const mailOptions = {
              from: 'Knihovna <lukas@danek-family.cz>',
              to: args.email,
              subject: 'Registrace do aplikace Knihovna',
              html: `<h3>Registrace do aplikace Knihovna</h3><p>Registrace do aplikace knihovna.</p><p>Nyní je pro tento email password "${password}"</p>`,
            }

            transporter.sendMail(mailOptions, (error, info) => {
              return { error: error || '', data: '', message: info.response || '' }
            })
            return { error: '', data: '', message: 'Mail sent' }
          } catch (error) {
            return { error: (error as any).message || '', data: '', message: '' }
          }
        },
      },
    },
  }
}
