import { GraphQLSchemaModule } from 'apollo-server-core'
import { findAll, totalCount } from './utils'
import { gql } from 'apollo-server-express'
import { view_member as view_memberInit } from '../models/view_member'

type VIEW_CLENOVE = ReturnType<typeof view_memberInit.initModel>

export const view_memberGraphql = (dbTable: VIEW_CLENOVE): GraphQLSchemaModule => {
  return {
    typeDefs: gql`
      input view_memberInput {
        bind_id_user: Int
        id_group: Int
        group_name: String
        id_user: Int
        first_name: String
        surname: String
        email: String
      }
      extend type Query {
        view_member(offset: Int, limit: Int, order: String): [member]
        totalCountMember(bind_id_user: Int, id_group: Int): Int
      }
      type member {
        bind_id_user: Int
        id_group: Int
        created_by: Int
        group_name: String
        id_user: Int
        first_name: String
        surname: String
        email: String
      }
    `,
    resolvers: {
      Query: {
        view_member: async (obj: any, args: any, context: any, info: any) =>
          await findAll(
            dbTable,
            args.limit || 10,
            args.offset || 0,
            {
              bind_id_user: context.session.user.id,
            },
            ['id_user', 'first_name', 'surname', 'email', 'group_name', 'id_group', 'created_by']
          ),
        totalCountMember: async (obj: any, args: any, context: any, info: any) => {
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
