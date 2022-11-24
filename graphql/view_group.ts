import { GraphQLSchemaModule } from 'apollo-server-core'
import { findAll, findOne, findSome, totalCount } from './utils'
import { gql } from 'apollo-server-express'
import { groupAttributes, view_group as view_groupInit } from '../models/view_group'

type VIEW_SKUPINA = ReturnType<typeof view_groupInit.initModel>

export const view_groupGraphql = (dbTable: VIEW_SKUPINA): GraphQLSchemaModule => {
  return {
    typeDefs: gql`
      input view_groupInput {
        id_group: Int
        group_name: String
        id_user: Int
        password: String
        id_user_type: Int
        email: String
        user_type_name: String
        id_group_actual: Int
      }
      extend type Query {
        view_group(offset: Int, limit: Int, order: String): [a_group]
        v_totalCountGroup(id_user: Int, id_group: Int): Int
      }
      type v_group {
        id_group: Int
        group_name: String
        created_by: Int
        id_user: Int
        password: String
        id_user_type: Int
        email: String
        user_type_name: String
        id_group_actual: Int
      }
      type a_group {
        id_group: Int
        group_name: String
        created_by: Int
        id_user: Int
        password: String
        id_user_type: Int
        email: String
        user_type_name: String
        actual: Boolean
      }
    `,
    resolvers: {
      Query: {
        view_group: async (obj: any, args: any, context: any, info: any) => {
          return (
            await findAll(
              dbTable,
              args.limit || 10,
              args.offset || 0,
              {
                id_user: context.session.user.id,
              },
              ['id_group', 'group_name', 'id_user_type', 'user_type_name', 'created_by']
            )
          ).map(itm => Object.assign(itm, { actual: itm.id_group === context.session.user.actual }))
        },
        v_totalCountGroup: async (obj: any, args: any, context: any, info: any) => {
          return await totalCount(dbTable, {
            where: {
              id_user: context.session.user.id,
              id_group: args.id_group || context.session.user.actual,
            },
          })
        },
      },
    },
  }
}
