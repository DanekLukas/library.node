import { findAll, findById, findSome, totalCount } from './utils'
import { gql } from 'apollo-server-express'
import { groupAttributes, group as groupInit } from '../models/group'
import { user_group } from 'models/user_group'

type SKUPINA = ReturnType<typeof groupInit.initModel>

export const groupGraphql = (dbTable: SKUPINA) => {
  return {
    typeDefs: gql`
      input groupInput {
        id: Int
        created_at: Date
        name: String
      }
      extend type Query {
        groups(offset: Int, limit: Int): [group]
        findSomeGroup(offset: Int, limit: Int, order: String): [group]
        group(id: ID!): group
        totalCountGroup: Int
      }
      extend type Mutation {
        insertGroup(name: String): Int!
        updateGroup(id: Int, name: String): Int!
        deleteGroup(where: whereId): Boolean!
      }
      type group {
        id: Int
        created_at: Date
        name: String
      }
    `,
    resolvers: {
      Query: {
        groups: async (obj: any, args: any, context: any, info: any) =>
          await findAll(dbTable, args.limit || 10, args.offset || 0),
        findSomeGroup: async (obj: any, args: any, context: any, info: any) =>
          await findSome(dbTable, args.order || 'id', args.offset || 0, args.limit || 10),
        group: async (obj: any, args: any, context: any, info: any) =>
          (await findById(dbTable, args.id)) as groupAttributes,
        totalCountGroup: async (obj: any, args: any, context: any, info: any) =>
          await totalCount(dbTable),
      },
      Mutation: {
        insertGroup: async (obj: any, args: any, context: any, info: any) => {
          const id = (
            await dbTable.create(Object.assign(args, { created_by: context.session.user.id }))
          ).id
          if (id < 1) return 0
          await user_group.create({ id_user: context.session.user.id, id_group: id })
          return id
        },
        updateGroup: async (obj: any, args: any, context: any, info: any) =>
          (
            await dbTable.update(args, {
              where: { id: args.id, created_by: context.session.user.id },
            })
          )[0],
        // .then(async (ret: Promise<[number]>) => {
        //   return (await ret)[0]
        // }),
        deleteGroup: async (obj: any, args: any, context: any, info: any) => {
          console.log(args)
          const count = await dbTable.destroy({
            where: { id: args.where.id, created_by: context.session.user.id },
            force: true,
          })
          if (count < 1) return count
          await user_group.destroy({ where: { id_group: args.where.id } })
          return count
        },
      },
    },
  }
}
